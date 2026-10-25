# Comprehensive Next.js Old Boys Association Platform Prompt

Copy and paste the prompt below into a new conversation when building the registration and newsletter platform for the Old Boys Association.

***

**User Prompt:**

Please act as a Senior Full-Stack Next.js Developer. I need to build a clean, web-based Registration and Newsletter platform for an **[Old Boys School Association / Alumni Group]**.

### 1. Technology Stack
*   **Framework:** Next.js (App Router, completely TypeScript).
*   **Database/Storage:** Google Sheets API (this will act as the only database for storing all registered alumni).
*   **Email Engine:** Nodemailer (for automated registration emails and sending bulk newsletters).
*   **Styling:** Vanilla CSS focusing on a clean, professional "school prestige" design system. Minimalist but polished.

### 2. Core Features & Workflows
*   **The Registration Form (Homepage):** 
    *   A beautifully designed public-facing form.
    *   **Fields:** First Name, Last Name, Graduation Year, Email Address, Phone Number, Current Profession, and a short "Favorite School Memory" text area.
    *   **Action:** On submit, it must append the data directly to a Google Sheet.
    *   **Confirmation:** Instantly use Nodemailer to send a welcome/thank-you email to the new registrant.
    *   **Notification:** Instantly use Nodemailer to send an alert email to the admin/association president that a new member has registered.
*   **The Admin Dashboard (`/admin`):**
    *   **Authentication:** Protected by a simple hardcoded `ADMIN_PASSWORD` stored in `.env.local` (no complex database auth required, as it is just for the admin).
    *   **Member Directory:** A clean data table that fetches and displays all registered users directly from the Google Sheet.
    *   **Newsletter Broadcast Tool:** A rich text area inside the dashboard where the admin can write a newsletter subject and body. When they click "Send Broadcast", the backend API must read the Google Sheet, grab every registered email address, and use Nodemailer to bulk-send the newsletter to everyone at once.

### 3. Critical Backend Rules & Resilience
1.  **Google Sheets Integration:** Standardize using `googleapis`. Ensure the appending logic handles edge cases (e.g., if a column is skipped).
2.  **Bulk Email Handling:** When the admin triggers a broadcast, ensure they are sent out via `Bcc` (Blind Carbon Copy) so alumni cannot see each other's email addresses, OR send them in a looped generic batch to prevent massive spam-blocking by Gmail.
3.  **Environment Variables:** The app MUST strictly rely on `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `EMAIL_USER`, `EMAIL_PASS`, and `ADMIN_PASSWORD`. 

Please begin by asking any clarifying questions about the school colors or branding if needed. If none, start by creating the Next.js foundation and the `globals.css` design system.
