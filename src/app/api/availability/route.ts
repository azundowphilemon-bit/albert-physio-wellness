import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date'); // Format: YYYY-MM-DD

    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter is required.' }, { status: 400 });
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
      console.warn('Google Calendar credentials missing. Returning empty array for availability.');
      return NextResponse.json({ bookedSlots: [] });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    // Setup query boundaries
    const startOfDay = new Date(`${dateParam}T00:00:00`);
    const endOfDay = new Date(`${dateParam}T23:59:59`);

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      timeZone: 'Europe/Berlin',
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const bookedSlots: string[] = [];

    // Map the events to 60-minute time slots (e.g. "10:00")
    events.forEach(event => {
      // Handle "All Day" events which block out the whole day
      if (event.start?.date) {
        for (let i = 8; i <= 17; i++) {
          bookedSlots.push(`${i.toString().padStart(2, '0')}:00`);
        }
      } 
      // Handle standard timed events
      else if (event.start?.dateTime && event.end?.dateTime) {
        let currentSlot = new Date(event.start.dateTime);
        const endSlot = new Date(event.end.dateTime);
        
        while (currentSlot < endSlot) {
          // Format based on the clinic timezone to safely extract HH:mm
          const timeString = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin'
          }).format(currentSlot);
          
          bookedSlots.push(timeString);
          
          // Increment by 1 hour to see if the event takes up the next slot too
          currentSlot.setHours(currentSlot.getHours() + 1);
        }
      }
    });

    return NextResponse.json({ bookedSlots });

  } catch (error: any) {
    console.error('Availability API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
