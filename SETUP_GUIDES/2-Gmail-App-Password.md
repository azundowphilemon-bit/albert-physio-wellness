# Gmail App Password Setup (Nodemailer)

To allow your Node.js backend to send automated transactional emails (like booking confirmations) via the client's Gmail address, you cannot use their normal login password. Google blocks standard logins from servers. Instead, you need to generate an **"App Password"**.

### Prerequisites
1. The client must have a standard Gmail workspace account or normal Gmail account (e.g., `info@clientclinic.com` or `clientclinic@gmail.com`).
2. **Two-Step Verification (2FA) MUST be turned on** for that Google account. If 2FA is off, Google will hide the App Passwords menu.

### Step 1: Navigate to Google Account Security
1. Log into the Gmail account you intend to send emails from.
2. Click the profile picture in the top right corner and click **"Manage your Google Account"**.
3. In the left-hand menu, click **"Security"**.

### Step 2: Ensure 2-Step Verification is ON
1. Scroll down to the **"How you sign in to Google"** section.
2. Check the status of **"2-Step Verification"**. If it's off, follow the prompts to turn it on (it will ask for a phone number). 

### Step 3: Generate the App Password
1. Once 2-Step Verification is active, you either click into **2-Step Verification** and scroll to the bottom to find "App Passwords", OR you can simply use the top search bar inside the Google Account to search for **"App Passwords"**.
2. When you reach the App Passwords screen, it may ask you to give it a name. Type something recognizable like `"Website Notifications"` and click **Create**.
3. A yellow popup box will appear containing a 16-character password (e.g. `abcd efgh ijkl mnop`). 

### Step 4: Configure Your Environment Variable
1. Copy that 16-character string. You do not need to keep the spaces. (It is exactly 16 letters long).
2. You will never be able to view this password again once you close the popup. 
3. Paste it directly into your `.env.local` file as `EMAIL_PASS="abcdefghijklmnop"`.
4. Set the `EMAIL_USER` in `.env.local` as the actual full Gmail address.
