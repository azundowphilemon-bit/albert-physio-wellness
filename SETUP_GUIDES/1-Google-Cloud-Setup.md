# Google Cloud Console Setup (Calendar & Sheets)

To allow your web app to automatically interact with a business's Google Calendar and Google Sheets without manual human login prompts, you need a "Service Account". Think of it as a robotic employee that you give permission to edit specific documents.

### Step 1: Create the Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your standard Google account (or a generic agency account).
3. Click the dropdown at the very top left (next to the Google Cloud logo) and click **"New Project"**.
4. Name it something like "ClientName-BookingApp" and click **Create**.

### Step 2: Enable the APIs
1. Make sure your new project is selected at the top.
2. In the left sidebar, click **"APIs & Services" > "Library"**.
3. Search for **"Google Calendar API"** and click **Enable**.
4. Go back to the Library.
5. Search for **"Google Sheets API"** and click **Enable**.

### Step 3: Create the Service Account ("The Robot")
1. In the left sidebar, go to **"APIs & Services" > "Credentials"**.
2. Click **"+ CREATE CREDENTIALS"** at the top, and select **"Service account"**.
3. **Name it** (e.g., `clientname-bot`). The system will generate an email address for it (e.g., `clientname-bot@project-123.iam.gserviceaccount.com`).
4. Click **Create and Continue**, then click **Done** (leave role blank, we don't need general access, just specific document access).

### Step 4: Get the Private Key
1. You will be back on the Credentials page. Look under the "Service Accounts" list at the bottom and click the pencil/edit icon next to the bot you just created.
2. Go to the **"KEYS"** tab.
3. Click **"ADD KEY" > "Create new key"**.
4. Format: **JSON**. Click **Create**.
5. This will download a `.json` file to your computer. Open it in a text editor (like Notepad or VSCode). 
6. Keep this open! You will need the `client_email` and `private_key` from this file for your `.env.local` file.

### Step 5: Granting the Robot Access to the Specific Calendar and Sheet
The robot exists, but by default, it has access to nothing. You must share specific files with its email address (the one ending in `.iam.gserviceaccount.com`).

**For Google Calendar:**
1. Open the business's actual Google Calendar (calendar.google.com).
2. Hover over the calendar you want to use on the left sidebar, click the 3 dots (**...**), and click **"Settings and sharing"**.
3. Scroll down to **"Share with specific people or groups"**.
4. Click **"Add people and groups"**.
5. Paste the robot's `client_email` address.
6. **CRITICAL STEP:** Change the permission dropdown from "See all event details" to **"Make changes to events"**. If you don't do this, it cannot book or delete appointments!
7. Click Send. 
8. While you are here, scroll further down to **"Integrate calendar"** and copy the **Calendar ID** (it usually looks like their email address or a long string). You will need this for the `.env.local` file.

**For Google Sheets:**
1. Open the business's Google Sheet where you want to store bookings.
2. Click the big green **"Share"** button in the top right.
3. Paste the robot's `client_email` address.
4. Make sure it is set to **"Editor"**.
5. Click Send.
6. Look at the URL of the Google Sheet. It looks like `https://docs.google.com/spreadsheets/d/abc123xyz456/edit`. The long string of random characters between `/d/` and `/edit` is the **Sheet ID**. Copy it for your `.env.local` file.
