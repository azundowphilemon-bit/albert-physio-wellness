# Render.com Free Deployment Guide for Albert Physio & Wellness

Follow these steps to deploy your Next.js application to Render's free tier.

---

### Step 1: Push your project to GitHub

1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `albert-physio-wellness`). You can make it **Private** or **Public**.
2. Open PowerShell or Terminal in the `albert-physio-app` folder and run:

```powershell
cd C:\Users\Acer\Desktop\Albert_physiotherapie\albert-physio-app
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/albert-physio-wellness.git
git push -u origin main
```

*(Replace `YOUR_GITHUB_USERNAME` and repository name with your actual GitHub link)*

---

### Step 2: Create Web Service on Render

1. Log in to [dashboard.render.com](https://dashboard.render.com) using your GitHub account.
2. Click the blue **"New +"** button in the top right and select **"Web Service"**.
3. Under **Connect a repository**, choose your `albert-physio-wellness` repository.
4. Configure the following fields:

| Setting | Value |
| :--- | :--- |
| **Name** | `albert-physio-wellness` (or your preferred name) |
| **Region** | `Frankfurt (EU Central)` *(Recommended for Europe/Africa)* |
| **Branch** | `main` |
| **Root Directory** | *(Leave empty)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Instance Type** | **Free ($0/mo)** |

---

### Step 3: Add Environment Variables

Scroll down to the **Environment Variables** section on Render. Add each of these keys by copying their values from your local `.env.local` file:

1. `NODE_VERSION` $\rightarrow$ `20.18.0`
2. `NEXT_PUBLIC_SUPABASE_URL` $\rightarrow$ *(from .env.local)*
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` $\rightarrow$ *(from .env.local)*
4. `EMAIL_USER` $\rightarrow$ *(from .env.local)*
5. `EMAIL_PASS` $\rightarrow$ *(from .env.local)*
6. `GOOGLE_SHEET_ID` $\rightarrow$ *(from .env.local)*
7. `GOOGLE_CLIENT_EMAIL` $\rightarrow$ *(from .env.local)*
8. `GOOGLE_PRIVATE_KEY` $\rightarrow$ *(from .env.local)*
9. `GOOGLE_CALENDAR_ID` $\rightarrow$ *(from .env.local)*
10. `ADMIN_PASSWORD` $\rightarrow$ *(from .env.local)*
11. `IT_ADMIN_PASSWORD` $\rightarrow$ *(from .env.local)*

> **Tip for GOOGLE_PRIVATE_KEY:** Copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. The application backend automatically handles line-breaks.

---

### Step 4: Deploy & Access Your Live Site

1. Click **"Deploy Web Service"** at the bottom of the page.
2. Render will build the Next.js production bundle. Within 2–3 minutes, the status will show **"Live"**.
3. Your free public URL will be ready at:
   `https://albert-physio-wellness.onrender.com`

---

### Verification Checklist After Deployment:
- [ ] Test the landing page and navigation.
- [ ] Test the **Clinic Concierge** widget at the bottom right.
- [ ] Test the `/book` page appointment flow with Google Calendar.
- [ ] Verify the `/it-admin` health check route using your `IT_ADMIN_PASSWORD`.
