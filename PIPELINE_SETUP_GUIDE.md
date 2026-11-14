# FUTURE ROBOTIX — Customer Order & Lead Pipeline Setup Guide

This comprehensive troubleshooting and setup guide fixes the two common issues:
1. **Orders not appearing in the Google Sheet**.
2. **Emails going to / sending as personal Gmail (`udayasuss@gmail.com`) instead of `support@futurerobotix.in`**.

---

## 🔍 Why These Two Issues Happened

### Issue 1: Why Orders Were Not Appearing in the Google Sheet
* **Standalone Script vs Sheet-bound Script:** If you opened [script.google.com](https://script.google.com) directly to paste the script, Google Apps Script was not linked to your Google Sheet (`getActiveSpreadsheet()` returned `null`), so it couldn't log the rows.
* **The "Hidden Tab" Issue:** If the script was linked, Google Apps Script created a new tab named **"Orders & Inquiries"** at the bottom of your sheet while you were looking at the default blank **"Sheet1"** tab.
* **Old Version Cached:** Google Apps Script web apps do NOT update when you just click "Save". You must deploy a **New Version** for code changes to take effect.

### Issue 2: Why Emails Sent From & Landed in `udayasuss@gmail.com`
* **Why alerts landed in `udayasuss@gmail.com`:** `udayasuss@gmail.com` was listed inside `ADMIN_EMAILS` on line 17.
* **Why emails sent *from* `udayasuss@gmail.com`:** Google anti-spoofing security strictly blocks free `@gmail.com` accounts from forging or sending emails as `@futurerobotix.in` unless:
  * **Option A (Recommended & Fastest):** You use the free **Resend API** (3,000 free emails/month, 2-minute setup).
  * **Option B:** You add `support@futurerobotix.in` as a verified **"Send mail as"** SMTP alias in your Gmail settings.
  * **Option C:** You deploy the Google Apps Script while logged into your Google Workspace account for `futurerobotix.in`.

---

## 🛠️ Step-by-Step Fix (5 Minutes)

### Step 1: Open Your Google Sheet & Copy Its URL
1. Open your target Google Sheet: [Google Sheets](https://sheets.google.com).
2. Copy the entire URL from your browser address bar:
   `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`

---

### Step 2: Update the Script Configuration
Open [`google_apps_script_order_pipeline.js`](./google_apps_script_order_pipeline.js) and configure the top variables:

```javascript
// 1. Paste your Google Sheet URL here:
const SPREADSHEET_ID_OR_URL = "https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit";

// 2. Set where YOU want to receive order alerts (Removed personal Gmail):
const ADMIN_EMAILS = "orders@futurerobotix.in, support@futurerobotix.in, udaysahu@futurerobotix.in";

// 3. Sender Identity:
const SENDER_NAME = "FUTURE ROBOTIX Support";
const SENDER_EMAIL = "support@futurerobotix.in";

// 4. (Recommended) If using Resend for custom domain sending:
const RESEND_API_KEY = "re_your_api_key_here"; // Or leave "" if using Gmail SMTP alias
```

---

### Step 3: Paste Code into Google Apps Script
1. Go to your Google Apps Script project at [script.google.com](https://script.google.com) (or inside your Google Sheet: **Extensions → Apps Script**).
2. Replace all existing code with the complete code from [`google_apps_script_order_pipeline.js`](./google_apps_script_order_pipeline.js).
3. Click the 💾 **Save** icon (`Ctrl + S`).

---

### Step 4: Run the 1-Click Test Functions (Verify Right Inside the Editor!)

You don't need to guess if it works — run these two built-in test functions directly inside the Apps Script toolbar:

#### 🧪 Test 1: Test Google Sheet Logging
1. In the Apps Script toolbar, click the function dropdown (where it says `doPost` or `myFunction`) and select **`testLogOrderToSheet`**.
2. Click **Run**.
3. Grant authorization if prompted by Google (Click *Advanced → Go to Untitled project (unsafe) → Allow*).
4. Look at the **Execution log** at the bottom:
   ```
   === Testing Google Sheets Connection ===
   Spreadsheet Found: FUTURE ROBOTIX - Customer Orders & Inquiries
   Spreadsheet URL: https://docs.google.com/spreadsheets/d/...
   ✅ SUCCESS! Test row appended at row #2
   👉 Open your spreadsheet to view the row: https://docs.google.com/...
   ```
5. Open your Google Sheet — you will see the formatted row with headers, Reference ID, and status `VERIFIED`!

#### 🧪 Test 2: Test Sender Identity
1. Select **`testSenderIdentity`** from the function dropdown.
2. Click **Run**.
3. Check the Execution log — it will tell you your exact email sending status and dispatch a test alert to your email!

---

### Step 5: How to Send Emails as `support@futurerobotix.in`

Choose whichever option is easiest for you:

#### Option A: Free Resend API (Fastest & 100% Reliable — 2 Minutes)
1. Sign up for a free account at [resend.com](https://resend.com) (free 3,000 emails/month forever).
2. In Resend dashboard → **Domains** → Click **Add Domain** → enter `futurerobotix.in`.
3. Add the 3 DNS records (TXT & MX for resend) at your domain registrar (Hostinger / GoDaddy / Cloudflare).
4. In Resend dashboard → **API Keys** → Click **Create API Key**.
5. Copy the key (starts with `re_...`) and paste it into line 42 of the script:
   ```javascript
   const RESEND_API_KEY = "re_xxxxxxxxxxxxxxxxxxxx";
   ```
6. **Result:** Every customer confirmation email and admin alert is sent cleanly with SPF, DKIM, and DMARC passing directly as `FUTURE ROBOTIX Support <support@futurerobotix.in>`!

#### Option B: Gmail "Send Mail As" SMTP Alias (If you already have webmail/SMTP hosting)
If you already have an email inbox for `support@futurerobotix.in` (e.g. Hostinger Webmail, Zoho Mail, Titan, cPanel):
1. Open [Gmail](https://mail.google.com) on `udayasuss@gmail.com`.
2. Click the ⚙️ **Settings gear** → **See all settings** → **Accounts and Import** tab.
3. Under **"Send mail as"**, click **"Add another email address"**.
4. Enter:
   - **Name:** `FUTURE ROBOTIX Support`
   - **Email address:** `support@futurerobotix.in`
   - **Uncheck** "Treat as an alias".
5. Enter your email provider's SMTP details:
   - **SMTP Server:** e.g. `smtp.hostinger.com` or `smtppro.zoho.in`
   - **Port:** `465` (SSL) or `587` (TLS)
   - **Username:** `support@futurerobotix.in`
   - **Password:** your mailbox password
6. Enter the verification code sent to your inbox.
7. Once verified, Google Apps Script will natively dispatch using `support@futurerobotix.in`!

#### Option C: Deploy via Google Workspace
If `support@futurerobotix.in` is an active Google Workspace account:
Simply open Apps Script while logged into `support@futurerobotix.in` and deploy the Web App from that account.

---

### Step 6: Deploy New Version (CRITICAL STEP)

Whenever you edit Google Apps Script, **saving alone does NOT update the live web webhook!** You must publish a new version:

1. In the top-right of the Apps Script window, click **Deploy** → **Manage deployments**.
2. Click the ✏️ **Edit** icon next to the active deployment.
3. In the **Version** dropdown, select **New version**.
4. Make sure:
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone`
5. Click **Deploy**.
6. Google will show your Web App URL:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. Ensure this URL matches `pipelineEndpoint` in `js/config.js` and `site/js/config.js`.

---

## 🌐 Instant Browser Health Check

You can verify the entire setup anytime by opening your Web App URL directly in your browser:
`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`

It will return:
```json
{
  "service": "FUTURE ROBOTIX Procurement Pipeline Webhook",
  "status": "operational",
  "spreadsheet": {
    "status": "connected",
    "name": "FUTURE ROBOTIX - Customer Orders & Inquiries",
    "url": "https://docs.google.com/spreadsheets/d/...",
    "targetTab": "Orders & Inquiries",
    "totalRows": 2
  },
  "emailPipeline": {
    "senderIdentity": "FUTURE ROBOTIX Support <support@futurerobotix.in>",
    "dispatchEngine": "Resend API (Cloud Custom Domain: support@futurerobotix.in)",
    "adminRecipients": "orders@futurerobotix.in, support@futurerobotix.in, udaysahu@futurerobotix.in"
  }
}
```

If anything is ever disconnected, the browser health check will instantly tell you exactly what needs attention!
