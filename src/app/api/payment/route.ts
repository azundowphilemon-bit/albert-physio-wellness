  import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const CONSULTATION_FEE = 300;
const DEPOSIT_PERCENT = 0.30;
export const DEPOSIT_AMOUNT = CONSULTATION_FEE * DEPOSIT_PERCENT; // 90 GHS
export const BALANCE_AMOUNT = CONSULTATION_FEE - DEPOSIT_AMOUNT;  // 210 GHS

export async function POST(request: Request) {
  try {
    const { email, appointmentDate, appointmentTime, cardNumber, expiryDate, cvv } = await request.json();

    if (!email || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // ── MOCK PAYMENT PROCESSING ──
    // TODO: Replace this block with real Paystack API call when account is ready:
    //
    // const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email,
    //     amount: DEPOSIT_AMOUNT * 100, // Paystack uses pesewas
    //     currency: 'GHS',
    //     metadata: { appointmentDate, appointmentTime },
    //   }),
    // });

    // Simulate a failed payment for test card 0000 0000 0000 0000
    if (cardNumber?.replace(/\s/g, '') === '0000000000000000') {
      return NextResponse.json({ error: 'Payment declined. Please check your card details.' }, { status: 402 });
    }

    // All other cards succeed in mock mode
    const mockReference = `MOCK-${Date.now()}`;

    // ── UPDATE GOOGLE SHEETS with payment status ──
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      const auth = new google.auth.GoogleAuth({
        credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: privateKey },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID });
      const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';

      const sheetData = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${firstSheetTitle}!A:P`,
      });

      const rows = sheetData.data.values || [];
      // Skip header row (index 0) when searching for the appointment
      const rowIndex = rows.findIndex(
        (row, i) => i > 0 &&
               row[6]?.toLowerCase() === email.toLowerCase() &&
               row[10] === appointmentDate &&
               row[11] === appointmentTime
      );

      if (rowIndex !== -1) {
        const sheetRowNumber = rowIndex + 1;
        // Column O (index 14) = Payment Status, Column P (index 15) = Payment Reference
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `${firstSheetTitle}!O${sheetRowNumber}:P${sheetRowNumber}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[`Deposit Paid (GHS ${DEPOSIT_AMOUNT})`, mockReference]]
          },
        });
      }
    }

    // ── Send payment confirmation email ──
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const formattedDate = new Date(appointmentDate + 'T12:00:00').toLocaleDateString('en-GB', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        await transporter.sendMail({
          from: `"Albert Physio & Wellness" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Deposit Confirmed — Your Appointment is Secured`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#f0fdfa;font-family:Inter,Arial,sans-serif;">
              <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#115e59,#0d9488);padding:40px 32px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:24px;">Albert Physio & Wellness</h1>
                  <p style="color:#ccfbf1;margin:8px 0 0;font-size:14px;">Pokuasi, Accra, Ghana</p>
                </div>
                <div style="padding:32px;">
                  <div style="text-align:center;margin-bottom:24px;">
                    <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:12px;">✓</div>
                    <h2 style="color:#0f172a;margin:0 0 8px;">Appointment Confirmed!</h2>
                    <p style="color:#64748b;font-size:15px;margin:0;">Your deposit has been received and your slot is secured.</p>
                  </div>

                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:20px;">
                    <h3 style="color:#0f766e;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Appointment Details</h3>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:40%;">Date</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${formattedDate}</td></tr>
                      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Time</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${appointmentTime}</td></tr>
                      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Reference</td><td style="padding:8px 0;color:#0f172a;font-size:13px;font-family:monospace;">${mockReference}</td></tr>
                    </table>
                  </div>

                  <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:20px;">
                    <h3 style="color:#854d0e;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">💳 Payment Summary</h3>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr><td style="padding:6px 0;color:#92400e;font-size:14px;">Deposit Paid</td><td style="padding:6px 0;color:#166534;font-size:14px;font-weight:700;text-align:right;">GHS ${DEPOSIT_AMOUNT}.00 ✓</td></tr>
                      <tr style="border-top:1px solid #fde68a;"><td style="padding:6px 0;color:#92400e;font-size:14px;">Balance Due on Arrival</td><td style="padding:6px 0;color:#92400e;font-size:14px;font-weight:600;text-align:right;">GHS ${BALANCE_AMOUNT}.00</td></tr>
                    </table>
                  </div>

                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:20px;">
                    <p style="color:#166534;font-size:13px;margin:0;line-height:1.6;">
                      📍 <strong>Location:</strong> Pokuasi, Accra, Ghana<br/>
                      📞 <strong>Phone:</strong> +233 123 456 789<br/>
                      ✉️ <strong>Email:</strong> info@albert-physio.de
                    </p>
                  </div>

                  <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                    Please bring this confirmation and your balance payment on the day of your appointment.
                  </p>
                </div>
                <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} Albert Physio & Wellness. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        console.log('✅ Payment confirmation email sent to', email);
      } catch (emailErr: any) {
        console.error('❌ Payment confirmation email error:', emailErr.message);
      }
    }

    // ── Send payment confirmation email to patient ──
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const formattedDate = new Date(appointmentDate + 'T12:00:00').toLocaleDateString('en-GB', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        await transporter.sendMail({
          from: `"Albert Physio & Wellness" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Deposit Confirmed — Your Appointment is Secured`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#f0fdfa;font-family:Inter,Arial,sans-serif;">
              <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#115e59,#0d9488);padding:40px 32px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:24px;">Albert Physio & Wellness</h1>
                  <p style="color:#ccfbf1;margin:8px 0 0;font-size:14px;">Pokuasi, Accra, Ghana</p>
                </div>
                <div style="padding:32px;">
                  <div style="text-align:center;margin-bottom:24px;">
                    <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;">✓</div>
                    <h2 style="color:#0f172a;margin:16px 0 8px;">Appointment Confirmed!</h2>
                    <p style="color:#64748b;font-size:15px;margin:0;">Your deposit has been received and your slot is secured.</p>
                  </div>

                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:20px;">
                    <h3 style="color:#0f766e;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Appointment Details</h3>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:40%;">Date</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${formattedDate}</td></tr>
                      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Time</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${appointmentTime}</td></tr>
                      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:8px 0;color:#64748b;font-size:14px;">Reference</td><td style="padding:8px 0;color:#0f172a;font-size:13px;font-family:monospace;">${mockReference}</td></tr>
                    </table>
                  </div>

                  <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:20px;">
                    <h3 style="color:#854d0e;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">💳 Payment Summary</h3>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr><td style="padding:6px 0;color:#92400e;font-size:14px;">Deposit Paid</td><td style="padding:6px 0;color:#166534;font-size:14px;font-weight:700;text-align:right;">GHS ${DEPOSIT_AMOUNT}.00 ✓</td></tr>
                      <tr style="border-top:1px solid #fde68a;"><td style="padding:6px 0;color:#92400e;font-size:14px;">Balance Due on Arrival</td><td style="padding:6px 0;color:#92400e;font-size:14px;font-weight:600;text-align:right;">GHS ${BALANCE_AMOUNT}.00</td></tr>
                    </table>
                  </div>

                  <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                    Please bring this confirmation and your balance payment on the day of your appointment.
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
        console.log('✅ Payment confirmation email sent to', email);
      } catch (emailErr: any) {
        console.error('❌ Payment confirmation email error:', emailErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      reference: mockReference,
      depositAmount: DEPOSIT_AMOUNT,
      balanceAmount: BALANCE_AMOUNT,
      message: `Deposit of GHS ${DEPOSIT_AMOUNT} received. Pay GHS ${BALANCE_AMOUNT} on arrival.`,
    });

  } catch (error: any) {
    console.error('Payment API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
