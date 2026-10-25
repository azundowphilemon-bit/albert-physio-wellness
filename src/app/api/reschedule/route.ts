import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, oldDate, oldTime, newDate, newTime } = await request.json();

    if (!email || !oldDate || !oldTime || !newDate || !newTime) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user || user.email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // ── 1. Update Google Sheets ──
    if (process.env.GOOGLE_CLIENT_EMAIL && privateKey && process.env.GOOGLE_SHEET_ID) {
      const sheetsAuth = new google.auth.GoogleAuth({
        credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth: sheetsAuth });
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID });
      const sheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';

      const sheetData = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${sheetTitle}!A:N`,
      });

      const rows = sheetData.data.values || [];
      const rowIndex = rows.findIndex(
        (row, i) => i > 0 &&
          row[6]?.toLowerCase() === email.toLowerCase() &&
          row[10] === oldDate &&
          row[11] === oldTime
      );

      if (rowIndex === -1) {
        return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
      }

      const sheetRow = rowIndex + 1;
      // Update columns K (date) and L (time) — indices 10 and 11
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${sheetTitle}!K${sheetRow}:L${sheetRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[newDate, newTime]] },
      });
    }

    // ── 2. Update Google Calendar ──
    if (process.env.GOOGLE_CLIENT_EMAIL && privateKey && process.env.GOOGLE_CALENDAR_ID) {
      try {
        const calAuth = new google.auth.GoogleAuth({
          credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        const calendar = google.calendar({ version: 'v3', auth: calAuth });

        // Find and delete old event
        const startOfDay = new Date(`${oldDate}T00:00:00`);
        const endOfDay = new Date(`${oldDate}T23:59:59`);
        const events = await calendar.events.list({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          singleEvents: true,
        });

        const match = events.data.items?.find(ev => {
          if (!ev.start?.dateTime) return false;
          const evTime = new Date(ev.start.dateTime).toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin'
          });
          return evTime === oldTime;
        });

        if (match?.id) {
          await calendar.events.delete({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            eventId: match.id,
          });
        }

        // Create new event
        const [hours, minutes] = newTime.split(':').map(Number);
        const endHours = String((hours + 1) % 24).padStart(2, '0');
        const endTime = `${endHours}:${String(minutes).padStart(2, '0')}`;

        // Get patient name from sheet for calendar summary
        const sheetsAuth2 = new google.auth.GoogleAuth({
          credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const sheets2 = google.sheets({ version: 'v4', auth: sheetsAuth2 });
        const spreadsheet2 = await sheets2.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID });
        const sheetTitle2 = spreadsheet2.data.sheets?.[0]?.properties?.title || 'Sheet1';
        const sheetData2 = await sheets2.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID!,
          range: `${sheetTitle2}!A:N`,
        });
        const rows2 = sheetData2.data.values || [];
        const updatedRow = rows2.find(
          (row, i) => i > 0 &&
            row[6]?.toLowerCase() === email.toLowerCase() &&
            row[10] === newDate &&
            row[11] === newTime
        );
        const patientName = updatedRow ? `${updatedRow[1]} ${updatedRow[2]}` : email;

        await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          requestBody: {
            summary: `Physio: ${patientName} (Rescheduled)`,
            description: `Email: ${email}\nRescheduled from ${oldDate} ${oldTime}`,
            start: { dateTime: `${newDate}T${newTime}:00`, timeZone: 'Europe/Berlin' },
            end: { dateTime: `${newDate}T${endTime}:00`, timeZone: 'Europe/Berlin' },
          },
        });
      } catch (calErr: any) {
        console.error('❌ Calendar reschedule error:', calErr.message);
      }
    }

    // ── 3. Send confirmation email ──
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const fmtDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        
        const format12Hour = (time24: string) => {
          if (!time24) return '';
          const [h, m] = time24.split(':');
          const hours = parseInt(h, 10);
          const suffix = hours >= 12 ? 'PM' : 'AM';
          const hours12 = hours % 12 || 12;
          return `${hours12}:${m} ${suffix}`;
        };

        const displayOldTime = format12Hour(oldTime);
        const displayNewTime = format12Hour(newTime);

        await transporter.sendMail({
          from: `"Albert Physio & Wellness" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Appointment Rescheduled — ${fmtDate(newDate)} at ${displayNewTime}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#f0fdfa;font-family:Inter,Arial,sans-serif;">
              <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#115e59,#0d9488);padding:40px 32px;text-align:center;">
                  <h1 style="color:#fff;margin:0;font-size:24px;">Albert Physio & Wellness</h1>
                  <p style="color:#ccfbf1;margin:8px 0 0;font-size:14px;">Pokuasi, Accra, Ghana</p>
                </div>
                <div style="padding:32px;">
                  <h2 style="color:#0f172a;margin:0 0 8px;">Appointment Rescheduled 📅</h2>
                  <p style="color:#64748b;font-size:15px;margin:0 0 24px;">Your appointment has been successfully rescheduled.</p>

                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:20px;">
                    <h3 style="color:#64748b;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Previous Appointment</h3>
                    <p style="color:#94a3b8;font-size:14px;margin:0;text-decoration:line-through;">${fmtDate(oldDate)} at ${displayOldTime}</p>
                  </div>

                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:20px;">
                    <h3 style="color:#166534;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">New Appointment</h3>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:40%;">Date</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${fmtDate(newDate)}</td></tr>
                      <tr style="border-top:1px solid #dcfce7;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Time</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${displayNewTime}</td></tr>
                    </table>
                  </div>

                  <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                    If you need to make further changes, log in to your patient portal.
                  </p>
                </div>
                <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} Albert Physio & Wellness</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailErr: any) {
        console.error('❌ Reschedule email error:', emailErr.message);
      }
    }

    return NextResponse.json({ success: true, message: 'Appointment rescheduled successfully.' });

  } catch (error: any) {
    console.error('Reschedule API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
