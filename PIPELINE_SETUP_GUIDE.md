# FUTURE ROBOTIX — Customer Order & Lead Pipeline Setup Guide

This guide explains how to activate your customer order pipeline so that whenever someone fills out the contact or order request form on [futurerobotix.in](https://futurerobotix.in), their details are **instantly logged into Google Sheets** and **sent directly to your email and phone**.

---

## 🏗️ How the Pipeline Works

```
Customer Submits Order Request (contact.html)
   │
   ├──> 1. Browser generates unique Reference ID (e.g. FR-261112-4821)
   │
   ├──> 2. Sends details to Google Apps Script Webhook (100% Free, 99.99% Uptime)
   │       ├── Automatically logs a new row in Google Sheets (Your Live CRM)
   │       ├── Sends instant formatted alert email to orders@futurerobotix.in & your personal Gmail
   │       └── Sends automated confirmation email with Ref # to the customer
   │
   └──> 3. Seamlessly redirects customer to order-success.html
           ├── Displays official reference number & summary
           └── Offers 1-click WhatsApp button to connect directly with your team
```

---

## ⚡ 3-Minute Quick Setup

### Step 1: Create Your Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name the spreadsheet: `FUTURE ROBOTIX - Customer Orders & Inquiries`.

### Step 2: Add the Webhook Script
1. In your Google Sheet, click **Extensions** in the top menu → **Apps Script**.
2. Delete any default code in the editor (`function myFunction() { ... }`).
3. Open the file [`google_apps_script_order_pipeline.js`](./google_apps_script_order_pipeline.js) in this project folder.
4. Copy the entire contents and paste it into the Google Apps Script editor. Both your emails (`orders@futurerobotix.in, udaysahu@futurerobotix.in`) are already configured in line 15:
   ```javascript
   const ADMIN_EMAILS = "orders@futurerobotix.in, udaysahu@futurerobotix.in";
   ```
5. Click the 💾 **Save** icon (or press `Ctrl + S`).

### Step 3: Deploy as Web App
1. At the top right of the Apps Script window, click the blue **Deploy** button → **New deployment**.
2. Click the gear ⚙️ icon next to "Select type" and select **Web app**.
3. Fill in the deployment details:
   - **Description**: `FUTURE ROBOTIX Orders Pipeline`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: allows your website to submit orders without login)*
4. Click **Deploy**.
5. Google will ask for authorization on first deploy:
   - Click **Authorize access**.
   - Select your Google account.
   - Click **Advanced** → **Go to Untitled project (unsafe)** → Click **Allow**.
6. Google will provide a **Web App URL** that looks like:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. Copy this **Web App URL**.

### Step 4: Paste Web App URL into `js/config.js`
Open `js/config.js` and paste your URL into `pipelineEndpoint`:

```javascript
  contact: {
    emailHello: 'hello@futurerobotix.in',
    emailOrders: 'orders@futurerobotix.in',
    emailSupport: 'support@futurerobotix.in',
    phone: '+91 98765 43210',             // Replace with your real phone number
    whatsappNumber: '919876543210',       // Replace with your WhatsApp number (with country code, no +)
    pipelineEndpoint: 'https://script.google.com/macros/s/AKfycbx.../exec', // <-- PASTE HERE
    supportHours: 'Monday – Saturday: 09:30 – 18:30 IST',
    responseTime: 'Guaranteed technical response within 1 business day'
  },
```

---

## 🧪 Testing Your Pipeline

1. Open `contact.html` in your browser.
2. Fill out test details (e.g. Name: `Test Lead`, Email: your email, Robot: `Humanoid Essential`).
3. Click **Submit Request**.
4. You will see:
   - The button shows "Logging Request..." with a spinner.
   - You are redirected to `order-success.html` displaying your official Reference ID (`FR-XXXXXX`).
   - Check your Google Sheet: a new row with timestamp, client name, phone, email, robot model, and status has been automatically appended!
   - Check your email: an instant formatted notification email with direct "Chat on WhatsApp" and "Reply" links has arrived!

---

## 🔒 Why This Architecture is the Most Stable
1. **Zero Server Maintenance**: Runs entirely on Google's cloud infrastructure (99.99% uptime). No node server or database to manage, patch, or pay for.
2. **100% Free Forever**: No limits on lead volume (unlike 3rd-party services that charge after 50 leads).
3. **Google Sheets as Mobile CRM**: You can install the Google Sheets app on your phone and get real-time order alerts anywhere. You can also add custom columns to the sheet (e.g. "Quotation Amount", "Assigned Engineer", "Follow-up Date").
4. **WhatsApp Instant Fallback**: High-ticket B2B deals in India move fast. The automatic WhatsApp button on `order-success.html` and in your alert emails ensures you can respond to institutional buyers in under 5 minutes.

