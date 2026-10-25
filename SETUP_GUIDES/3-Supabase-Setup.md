# Supabase Project Setup (Authentication)

Supabase handles user authentication (Registration, Login, User Data Storage) and secures the application's backend routes by providing JWT session tokens.

### Step 1: Create the Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign in with GitHub or an Email.
2. Click **"New Project"**.
3. Select an organization (or create one).
4. Name the project (e.g., "ClientName Booking Portal").
5. Create a secure database password (save this securely, though the web app only strictly needs the API keys).
6. Pick a region closest to the actual clinic (e.g., "Frankfurt" if they are in Germany).
7. Click **"Create new project"**. It will take 1-2 minutes to provision the database.

### Step 2: Grab the API Keys
1. Once provisioned, look at the sidebar on the left and click on **"Project Settings"** (the gear icon at the bottom).
2. Click on **"API"**.
3. Under the "Project URL" section, copy the `URL`. (This becomes `NEXT_PUBLIC_SUPABASE_URL` in your `.env.local`).
4. Under "Project API keys", copy the `anon` / `public` key. (This becomes `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local`).

### Step 3: Configure Authentication Providers (Email/Password)
1. In the left sidebar, click on **"Authentication"** (the people icon).
2. Go to **"Providers"** under the Configuration section.
3. **Email** is enabled by default. Click on it.
4. If you don't want clients to require an email confirmation link to use the site right away, **turn off "Confirm email"**. (If you leave it on, they are sent a generic Supabase template email to verify their address before they can log in).
5. Ensure "Enable Email provider" is switched ON. Click Save.

### Step 4: URL Redirects Configuration (Critical)
When someone logs out or completes a flow, Supabase needs to know what URLs are permitted to redirect to without triggering security errors.
1. In the Authentication sidebar, go to **"URL Configuration"**.
2. **Site URL:** Set this to `http://localhost:3000` while developing, and change it to the actual production website URL (e.g., `https://clientclinic.com`) when you deploy.
3. Next, look at **Redirect URLs**. Add `http://localhost:3000/**` to explicitly allow redirection to all subpages. Remove this wildcard in production and replace it with exact production paths, or just use `https://clientclinic.com/**`.

That's it! Supabase is fully configured. The Next.js app handles user inserts directly via the Supabase Auth API natively without any additional custom SQL configurations required for basic auth purposes.
