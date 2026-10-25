import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, appointmentDate, appointmentTime } = await request.json();

    if (!email || !appointmentDate || !appointmentTime) {
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

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const sheetsAuth = new google.auth.GoogleAuth({
      credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: sheetsAuth });

    // Get sheet name and all rows
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID });
    const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';

    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${firstSheetTitle}!A:N`,
    });

    const rows = sheetData.data.values || [];

    // Columns: [6]=email, [10]=date, [11]=time — skip header row (index 0)
    const rowIndex = rows.findIndex(
      (row, i) => i > 0 &&
             row[6]?.toLowerCase() === email.toLowerCase() &&
             row[10] === appointmentDate &&
             row[11] === appointmentTime
    );

    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    // Update column N (index 13) with "Cancelled" status
    const sheetRowNumber = rowIndex + 1; // Sheets rows are 1-indexed
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${firstSheetTitle}!N${sheetRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [['Cancelled']] },
    });

    console.log(`✅ Marked row ${sheetRowNumber} as Cancelled in Sheets`);

    // Remove from Google Calendar
    if (process.env.GOOGLE_CALENDAR_ID) {
      try {
        const calendarAuth = new google.auth.GoogleAuth({
          credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const calendar = google.calendar({ version: 'v3', auth: calendarAuth });

        const startOfDay = new Date(`${appointmentDate}T00:00:00`);
        const endOfDay = new Date(`${appointmentDate}T23:59:59`);

        const events = await calendar.events.list({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          singleEvents: true,
        });

        // Find the event matching the time slot
        const match = events.data.items?.find(ev => {
          if (!ev.start?.dateTime) return false;
          const evTime = new Date(ev.start.dateTime).toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin'
          });
          return evTime === appointmentTime;
        });

        if (match?.id) {
          await calendar.events.delete({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            eventId: match.id,
          });
          console.log(`✅ Deleted calendar event: ${match.id}`);
        }
      } catch (calErr: any) {
        console.error('❌ Calendar deletion error:', calErr.message);
        // Don't fail the whole request if calendar delete fails
      }
    }

    return NextResponse.json({ success: true, message: 'Appointment cancelled successfully.' });

  } catch (error: any) {
    console.error('Cancel API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
