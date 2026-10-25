# Environment Variables Checklist (`.env.local`)

This document outlines the master configuration file needed to connect your Next.js application to all external third-party services safely. 

### Development Rules
* You need to create a file named `.env.local` in the **root** of your Next.js project. 
* Next.js automatically loads `.env.local` files securely.
* Do not commit this file to GitHub/Git. (Ensure `.env.local` is listed in your `.gitignore` file!).

### Production Rules
* When deploying to Vercel, Netlify, or your production server, you must manually copy these exact Keys and Values into the platform's Environment Variables settings dashboard.

---

### The Template
Copy this template into your `.env.local` file and fill in the values based on instructions generated in Guides 1, 2, and 3.

```env
# ------------------------------------------------------------- #
# SUPABASE CONFIG (See SETUP_GUIDES/3-Supabase-Setup.md)        #
# ------------------------------------------------------------- #
# Get these from Supabase Project Settings > API
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1...[LONG-STRING]"


# ------------------------------------------------------------- #
# GOOGLE CLOUD CONFIG (See SETUP_GUIDES/1-Google-Cloud-Setup.md)#
# ------------------------------------------------------------- #
# Extract 'client_email' and 'private_key' from the downloaded JSON key file.
# NOTE: Private keys contain \n newline characters. Paste it EXACTLY as is inside the quotes.
GOOGLE_CLIENT_EMAIL="clientname-bot@project-123.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvA...[LONG_STRING_HERE]...\nzK+jH=\n-----END PRIVATE KEY-----\n"

# The Google Calendar ID you find in settings. Easiest check is if it looks like an email.
GOOGLE_CALENDAR_ID="c_123456789xyz@group.calendar.google.com"

# The ID string found within the URL of your target Google Sheet.
GOOGLE_SHEET_ID="1A2B3C4D5E6F7G8H9I0J_"


# ------------------------------------------------------------- #
# EMAIL NOTIFICATIONS (See SETUP_GUIDES/2-Gmail-App-Password.md)#
# ------------------------------------------------------------- #
# The email address that the Nodemailer server will "log into" to dispatch emails.
EMAIL_USER="info@clientclinic.com"

# The 16-character App Password generated via Google Account Security (NOT the regular login password)
EMAIL_PASS="abcdefghijklmnop"


# ------------------------------------------------------------- #
# INTERNAL ADMIN PORTAL CREDENTIALS                             #
# ------------------------------------------------------------- #
# Hardcoded custom passwords that block access to /admin and /it-admin routes
ADMIN_PASSWORD="MySecureAdminPassword123"
IT_ADMIN_PASSWORD="MySecureITPassword123"
```
