import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      return NextResponse.json({ appointments: [] });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID });
    const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${firstSheetTitle}!A:N`,
    });

    const rows = response.data.values || [];

    const appointments = rows.map((row, index) => ({
      rowIndex: index,
      timestamp: row[0] || '',
      firstName: row[1] || '',
      lastName: row[2] || '',
      dateOfBirth: row[3] || '',
      patientStatus: row[4] || '',
      insuranceType: row[5] || '',
      email: row[6] || '',
      phone: row[7] || '',
      address: row[8] || '',
      city: row[9] || '',
      appointmentDate: row[10] || '',
      appointmentTime: row[11] || '',
      appointmentDetails: row[12] || '',
      status: row[13] || '',
      paymentStatus: row[14] || 'Pending',
    })).filter((a, i) => i > 0 && a.email); // skip header row

    // Sort: upcoming first, then past
    const today = new Date().toISOString().split('T')[0];
    appointments.sort((a, b) => {
      if (a.appointmentDate >= today && b.appointmentDate < today) return -1;
      if (a.appointmentDate < today && b.appointmentDate >= today) return 1;
      return a.appointmentDate.localeCompare(b.appointmentDate);
    });

    return NextResponse.json({ appointments });
  } catch (error: any) {
    console.error('Admin appointments error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
