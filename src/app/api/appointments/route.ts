import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
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
      return NextResponse.json({ appointments: [] });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${firstSheetTitle}!A:N`,
    });

    const rows = response.data.values || [];

    // Columns: [0]timestamp [1]firstName [2]lastName [3]dob [4]status [5]insurance
    //          [6]email [7]phone [8]address [9]city [10]date [11]time [12]details
    // Skip header row (index 0)
    const appointments = rows
      .filter((row, i) => i > 0 && row[6]?.toLowerCase() === email.toLowerCase())
      .map(row => ({
        timestamp: row[0] || '',
        firstName: row[1] || '',
        lastName: row[2] || '',
        patientStatus: row[4] || '',
        insuranceType: row[5] || '',
        appointmentDate: row[10] || '',
        appointmentTime: row[11] || '',
        appointmentDetails: row[12] || '',
        status: row[13] || '',
      }))
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

    return NextResponse.json({ appointments });

  } catch (error: any) {
    console.error('Appointments API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
