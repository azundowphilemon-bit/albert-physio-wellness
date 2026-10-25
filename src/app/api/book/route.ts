import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      firstName, 
      lastName, 
      dateOfBirth, 
      email, 
      phone, 
      address, 
      city,
      patientStatus, 
      insuranceType, 
      appointmentDate, 
      appointmentTime,
      appointmentDetails 
    } = data;

    // 0. Strict Backend Double-Booking Protection
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID && appointmentTime) {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      const calendarAuth = new google.auth.GoogleAuth({
        credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      });
      const calendar = google.calendar({ version: 'v3', auth: calendarAuth });
      
      const startOfDay = new Date(`${appointmentDate}T00:00:00`);
      const endOfDay = new Date(`${appointmentDate}T23:59:59`);
      
      const checkRes = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        timeZone: 'Europe/Berlin',
        singleEvents: true,
      });
      
      const events = checkRes.data.items || [];
      const isBooked = events.some(ev => {
        // If it's an all-day event manually placed in calendar, it blocks the whole day
        if (ev.start?.date) return true;
        
        if (ev.start?.dateTime) {
           const evTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }).format(new Date(ev.start.dateTime));
           return evTime === appointmentTime;
        }
        return false;
      });

      if (isBooked) {
        return NextResponse.json({ success: false, message: 'This time slot was just booked. Please choose another available time.' }, { status: 409 });
      }
    }

    // 1. Send Email Notifications
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const formattedDate = new Date(appointmentDate + 'T12:00:00').toLocaleDateString('en-GB', {
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
      
      const displayTime = format12Hour(appointmentTime);

      // ── Email to PATIENT ──
      const patientHtml = `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f0fdfa;font-family:Inter,Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            
            <div style="background:linear-gradient(135deg,#115e59,#0d9488);padding:40px 32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-family:Georgia,serif;">Albert Physio & Wellness</h1>
              <p style="color:#ccfbf1;margin:8px 0 0;font-size:14px;">Pokuasi, Accra, Ghana</p>
            </div>

            <div style="padding:32px;">
              <h2 style="color:#0f172a;font-size:20px;margin:0 0 8px;">Booking Received! 🎉</h2>
              <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Hi <strong>${firstName}</strong>, your appointment request has been received. 
                Please complete your deposit payment to confirm your slot.
              </p>

              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <h3 style="color:#0f766e;font-size:14px;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.5px;">Appointment Details</h3>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:40%;">Date</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${formattedDate}</td></tr>
                  <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Time</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${displayTime}</td></tr>
                  <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Patient</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${firstName} ${lastName}</td></tr>
                  <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Status</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${patientStatus === 'new' ? 'New Patient' : 'Returning Patient'}</td></tr>
                  <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Insurance</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${insuranceType === 'public' ? 'Public (NHIS)' : 'Private / Self-Pay'}</td></tr>
                  <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Reason</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${appointmentDetails}</td></tr>
                </table>
              </div>

              <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:24px;">
                <h3 style="color:#854d0e;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">💳 Payment Summary</h3>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#92400e;font-size:14px;">Consultation Fee</td><td style="padding:6px 0;color:#92400e;font-size:14px;text-align:right;">GHS 300.00</td></tr>
                  <tr><td style="padding:6px 0;color:#92400e;font-size:14px;">Deposit (30%) — Pay online</td><td style="padding:6px 0;color:#92400e;font-size:14px;font-weight:700;text-align:right;">GHS 90.00</td></tr>
                  <tr style="border-top:1px solid #fde68a;"><td style="padding:6px 0;color:#92400e;font-size:14px;">Balance — Pay on arrival</td><td style="padding:6px 0;color:#92400e;font-size:14px;text-align:right;">GHS 210.00</td></tr>
                </table>
              </div>

              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="color:#166534;font-size:13px;margin:0;line-height:1.6;">
                  📍 <strong>Location:</strong> Pokuasi, Accra, Ghana<br/>
                  📞 <strong>Phone:</strong> +233 123 456 789<br/>
                  ✉️ <strong>Email:</strong> info@albert-physio.de
                </p>
              </div>

              <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                If you need to cancel or reschedule, please log in to your patient portal or contact us directly.
              </p>
            </div>

            <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} Albert Physio & Wellness. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // ── Email to CLINIC ──
      const clinicHtml = `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <div style="background:#0f172a;padding:24px 32px;">
              <h2 style="color:#ffffff;margin:0;font-size:18px;">🔔 New Appointment Request</h2>
              <p style="color:#64748b;margin:4px 0 0;font-size:13px;">Albert Physio Admin Notification</p>
            </div>
            <div style="padding:32px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;width:35%;">Patient Name</td><td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Date of Birth</td><td style="padding:10px 0;color:#0f172a;font-size:14px;border-bottom:1px solid #f1f5f9;">${dateOfBirth}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Email</td><td style="padding:10px 0;color:#0f172a;font-size:14px;border-bottom:1px solid #f1f5f9;">${email}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Phone</td><td style="padding:10px 0;color:#0f172a;font-size:14px;border-bottom:1px solid #f1f5f9;">${phone}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Appointment Date</td><td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9;">${formattedDate} at ${displayTime}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Patient Type</td><td style="padding:10px 0;color:#0f172a;font-size:14px;border-bottom:1px solid #f1f5f9;">${patientStatus === 'new' ? 'New Patient' : 'Returning Patient'}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Insurance</td><td style="padding:10px 0;color:#0f172a;font-size:14px;border-bottom:1px solid #f1f5f9;">${insuranceType === 'public' ? 'Public (NHIS)' : 'Private / Self-Pay'}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;">Reason for Visit</td><td style="padding:10px 0;color:#0f172a;font-size:14px;">${appointmentDetails}</td></tr>
              </table>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send to patient
      await transporter.sendMail({
        from: `"Albert Physio & Wellness" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Booking Received — ${formattedDate} at ${displayTime}`,
        html: patientHtml,
      });

      // Send to clinic
      await transporter.sendMail({
        from: `"Albert Physio Bookings" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Appointment: ${firstName} ${lastName} — ${formattedDate} at ${displayTime}`,
        html: clinicHtml,
      });

    } else {
      console.warn('Email credentials not found in env variables. Skipping email.');
    }

    // 2. Append to Google Sheets
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

      const sheetsAuth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth: sheetsAuth });

      try {
        // First, get the actual sheet name dynamically to avoid hardcoded name mismatch
        const spreadsheet = await sheets.spreadsheets.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
        });
        const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
        const range = `${firstSheetTitle}!A:M`;

        const sheetResponse = await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              [
                new Date().toISOString(), // Submission Timestamp
                firstName,
                lastName,
                dateOfBirth,
                patientStatus === 'new' ? 'New Patient' : 'Returning',
                insuranceType === 'public' ? 'Public' : 'Private',
                email,
                phone,
                address || '',
                city || '',
                appointmentDate,
                appointmentTime,
                appointmentDetails
              ]
            ]
          }
        });
        console.log('✅ Successfully wrote to Google Sheets at range:', sheetResponse.data.updates?.updatedRange);
      } catch (sheetsError: any) {
        console.error('❌ Google Sheets Error:', sheetsError?.message || sheetsError);
        // Don't throw — continue to calendar and still return success for the booking
      }
    } else {
      console.warn('Google Sheets credentials not found. Skipping Sheets.');
    }

    // 3. Sync to Google Calendar
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID && appointmentTime) {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

      const calendarAuth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      const calendar = google.calendar({ version: 'v3', auth: calendarAuth });

      try {
        const [hours, minutes] = appointmentTime.split(':').map(Number);
        const endHours = String((hours + 1) % 24).padStart(2, '0');
        const endTime = `${endHours}:${String(minutes).padStart(2, '0')}`;

        await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          requestBody: {
            summary: `Physio: ${firstName} ${lastName}`,
            description: `Phone: ${phone}\nEmail: ${email}\nStatus: ${patientStatus === 'new' ? 'New Patient' : 'Returning'}\nDetails: ${appointmentDetails}`,
            start: {
              dateTime: `${appointmentDate}T${appointmentTime}:00`,
              timeZone: 'Europe/Berlin',
            },
            end: {
              dateTime: `${appointmentDate}T${endTime}:00`,
              timeZone: 'Europe/Berlin',
            },
          }
        });
        console.log('✅ Successfully created Google Calendar event');
      } catch (calendarError: any) {
        console.error('❌ Google Calendar Error:', calendarError?.message || calendarError);
      }
    } else if (!process.env.GOOGLE_CALENDAR_ID) {
      console.warn('Google Calendar credentials not found. Skipping Calendar.');
    }

    return NextResponse.json({ success: true, message: 'Booking received successfully.' });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
