# Comprehensive Next.js Appointment Platform Master Prompt

Copy and paste the prompt below into a new conversation when building a similar tool for a future client. Before sending it, simply replace the placeholder text in the brackets `[like this]` with the specific client's details.

***

**User Prompt:**

Please act as a Senior Full-Stack Next.js Developer. I need to build a comprehensive, production-ready appointment booking web application for my client, **[Client's Business Name / e.g., A Dental Clinic, Hair Salon, Consulting Firm]**.

### 1. Technology Stack
*   **Framework:** Next.js (App Router, strictly TypeScript).
*   **Database & Auth:** Supabase (for user registration, JWT session management, and protecting APIs).
*   **Database/Storage (The CRM):** Google Sheets API (to log all bookings, emails, and patient details).
*   **Automated Scheduling:** Google Calendar API (to read availability and create exact timed events).
*   **Email:** Nodemailer (sending transactional emails on booking, rescheduling, and registration).
*   **Styling:** Vanilla CSS focusing on a rich, premium "Glassmorphism" design system. 

### 2. Design System & UX Guidelines
*   **Aesthetics:** The design MUST feel ultra-premium and similar to platforms like Doctolib. Use smooth gradients, glassmorphism UI cards (`backdrop-filter: blur()`), subtle drop shadows, and high-quality modern fonts (e.g., Inter or Roboto).
*   **Form Usability:** Implement dynamic multi-step forms with progress indicators. Inputs should have floating labels and clear valid/invalid states.
*   **Responsiveness:** The layout must be perfectly mobile-first using CSS Grid and Flexbox.

### 3. Core Features & User Workflows
*   **Authentication Portal:** A Registration and Login page. Include a "show/hide" eye-icon for password visibility. 
*   **Patient Dashboard:** Once logged in, users should see their profile, upcoming bookings, and past history. They must be able to cancel or reschedule their own upcoming appointments safely.
*   **The Booking Flow:** 
    *   *Step 1:* User inputs their reason for visit.
    *   *Step 2:* User selects a date. The system must fetch current exact availability from Google Calendar for that date.
    *   *Step 3:* User inputs personal details (Name, Email, Phone, Address). 
    *   *Step 4:* Final review and mocked "deposit payment" UI to confirm the slot.
    *   *Step 5:* On completion, append the data to Google Sheets, insert the time block onto Google Calendar, and fire a confirmation email to both the business and the client.

### 4. Admin & IT Portals
*   **Clinic Admin Dashboard (`/admin`):** Protected by a hardcoded `.env.local` password. It reads the Google Sheet data directly and presents it in a clean, filterable data table so the secretary can see upcoming/past/cancelled appointments and manually cancel/refund them.
*   **IT Health Board (`/it-admin`):** Protected by a separate `.env.local` IT password. A diagnostic page that pings Supabase, Google Sheets, Google Calendar, and SMTP servers to ensure all environmental variables and API keys are successfully wired up.

### 5. Critical Backend Rules & Resilience (Do not skip these)
1.  **Strict Double-Booking Prevention:** Google Calendar natively allows overlapping events. In the booking/POST API route, you MUST include a calendar availability check *immediately before* appending data or sending emails. If the time is taken, return an HTTP 409 error.
2.  **Accurate Timezones:** Hardcode the backend logic to strictly use **[Client's Timezone, e.g., Europe/Berlin]** for formatting and reading `dateTime`, otherwise Daylight Saving changes will cause Google Calendar to shift events randomly.
3.  **All-Day Event Handling:** The availability-fetching logic must check `event.start.date` to properly block out entire days if the clinic manually inserts an "All Day" event as a holiday.
4.  **12-Hour AM/PM UI:** While the APIs should strictly communicate in reliable 24-hour time (`15:00`), build formatters so the UI and emails always display clean 12-hour AM/PM formats (`3:00 PM`) for the end user.
5.  **API Security:** Ensure that backend routes handling cancellations or rescheduling strictly verify the `Authorization: Bearer <token>` from the frontend against Supabase to guarantee users can only modify their own appointments. 

Please begin by asking any clarifying questions about the client. If none, start by creating the Next.js foundation and the `globals.css` design system.
