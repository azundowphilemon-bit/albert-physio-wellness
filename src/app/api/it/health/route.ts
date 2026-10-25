import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('password') !== process.env.IT_ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, { status: 'ok' | 'error' | 'warning'; message: string; detail?: string }> = {};

  // 1. Google Sheets
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID });
    const title = res.data.sheets?.[0]?.properties?.title;
    results.googleSheets = { status: 'ok', message: 'Connected', detail: `Sheet: "${title}"` };
  } catch (e: any) {
    results.googleSheets = { status: 'error', message: 'Connection failed', detail: e.message };
  }

  // 2. Google Calendar
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.calendars.get({ calendarId: process.env.GOOGLE_CALENDAR_ID });
    results.googleCalendar = { status: 'ok', message: 'Connected', detail: `Calendar: "${res.data.summary}"` };
  } catch (e: any) {
    results.googleCalendar = { status: 'error', message: 'Connection failed', detail: e.message };
  }

  // 3. Supabase
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const res = await fetch(`${url}/rest/v1/`, { headers: { apikey: key } });
    results.supabase = res.ok
      ? { status: 'ok', message: 'Connected', detail: `URL: ${url}` }
      : { status: 'warning', message: `Responded with ${res.status}`, detail: `URL: ${url}` };
  } catch (e: any) {
    results.supabase = { status: 'error', message: 'Connection failed', detail: e.message };
  }

  // 4. Email (SMTP config check — no actual send)
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) throw new Error('EMAIL_USER or EMAIL_PASS missing');
    results.email = { status: 'ok', message: 'Configured', detail: `Sender: ${process.env.EMAIL_USER}` };
  } catch (e: any) {
    results.email = { status: 'error', message: 'Not configured', detail: e.message };
  }

  // 5. Environment variables check
  const requiredEnvs = [
    'GOOGLE_SHEET_ID', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY',
    'GOOGLE_CALENDAR_ID', 'EMAIL_USER', 'EMAIL_PASS',
    'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'ADMIN_PASSWORD', 'IT_ADMIN_PASSWORD'
  ];
  const missing = requiredEnvs.filter(k => !process.env[k]);
  results.envVars = missing.length === 0
    ? { status: 'ok', message: 'All required variables set', detail: `${requiredEnvs.length} variables checked` }
    : { status: 'error', message: `${missing.length} variable(s) missing`, detail: missing.join(', ') };

  return NextResponse.json({ results, checkedAt: new Date().toISOString() });
}
