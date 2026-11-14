/**
 * FUTURE ROBOTIX — Production Customer Order & Inquiry Webhook Pipeline
 * 
 * Google Apps Script Web App
 * 100% Free, Zero Server Maintenance, 99.99% Google Cloud Uptime
 * 
 * Capabilities:
 * 1. Appends every customer order/inquiry directly into Google Sheets in real-time.
 * 2. Connects to your Google Sheet by URL/ID or active container sheet.
 * 3. Sends instant formatted alert emails to orders@futurerobotix.in & support@futurerobotix.in.
 * 4. Sends automated confirmation emails with official Tracking Ref # to the customer.
 * 5. Dispatches emails as "FUTURE ROBOTIX Support <support@futurerobotix.in>".
 * 6. Provides built-in 1-click test functions: testLogOrderToSheet() and testSenderIdentity().
 */

// =============================================================================
// 1. SPREADSHEET CONFIGURATION (Fix for: orders not appearing in spreadsheet)
// =============================================================================
// PASTE YOUR GOOGLE SHEET URL OR SPREADSHEET ID HERE.
// If your script was created standalone or outside the sheet, pasting your URL/ID
// guarantees 100% that incoming orders are written to your exact Google Sheet!
// Example: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
// Or just ID: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
// (Leave as "" ONLY if this script is directly inside Google Sheets via Extensions > Apps Script)
const SPREADSHEET_ID_OR_URL = "";

// The name of the tab inside your Google Sheet where orders are logged
const SHEET_NAME = "Orders & Inquiries";


// =============================================================================
// 2. EMAIL IDENTITY & RECIPIENTS (Fix for: mails going to/from personal Gmail)
// =============================================================================
// WHERE YOU RECEIVE ORDERS:
// Incoming order alerts will be delivered to these email addresses (comma-separated).
// (Removed udayasuss@gmail.com so all order alerts go to your official business addresses.
//  If you want a personal backup copy, you can add ", udayasuss@gmail.com" at the end).
const ADMIN_EMAILS = "orders@futurerobotix.in, support@futurerobotix.in, udaysahu@futurerobotix.in";

// SENDER IDENTITY:
// Outgoing customer confirmations & alerts will display this name and address
const SENDER_NAME = "FUTURE ROBOTIX Support";
const SENDER_EMAIL = "support@futurerobotix.in";
const COMPANY_NAME = "FUTURE ROBOTIX";
const COMPANY_WEBSITE = "https://futurerobotix.in";


// =============================================================================
// 3. CLOUD SENDER: RESEND API (Recommended to send as support@futurerobotix.in)
// =============================================================================
// Google Apps Script running under a free @gmail.com account cannot send emails
// claiming to be from @futurerobotix.in unless:
//   Option A: You paste a free Resend API key below (https://resend.com - free 3,000 emails/mo).
//             This sends 100% authenticated emails from support@futurerobotix.in with zero SMTP hassle!
//   Option B: You add support@futurerobotix.in in your personal Gmail Settings -> Accounts and Import -> "Send mail as" (using your email hosting SMTP credentials).
// If left empty (""), the script attempts GmailApp alias verification, and if not verified, sends via GmailApp.
const RESEND_API_KEY = "";


// =============================================================================
// 4. BROWSER HEALTH CHECK ENDPOINT (doGet)
// =============================================================================
/**
 * Health check endpoint: Open your Web App URL in your browser to verify
 * spreadsheet connectivity, row count, and email dispatch status in real-time.
 */
function doGet(e) {
  let sheetStatus = "unconnected";
  let spreadsheetUrl = "";
  let spreadsheetName = "";
  let rowCount = 0;

  try {
    const ss = getSpreadsheet();
    sheetStatus = "connected";
    spreadsheetUrl = ss.getUrl();
    spreadsheetName = ss.getName();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (sheet) {
      rowCount = sheet.getLastRow();
    }
  } catch (err) {
    sheetStatus = "error: " + err.message;
  }

  let emailMode = "GmailApp (Primary Account)";
  if (typeof RESEND_API_KEY !== 'undefined' && RESEND_API_KEY && RESEND_API_KEY.trim().startsWith("re_")) {
    emailMode = "Resend API (Cloud Custom Domain: " + SENDER_EMAIL + ")";
  } else {
    try {
      const aliases = GmailApp.getAliases();
      if (aliases && aliases.indexOf(SENDER_EMAIL) !== -1) {
        emailMode = "GmailApp Alias (" + SENDER_EMAIL + " verified)";
      }
    } catch (e) {}
  }

  const statusResponse = {
    service: "FUTURE ROBOTIX Procurement Pipeline Webhook",
    status: sheetStatus === "connected" ? "operational" : "degraded",
    spreadsheet: {
      status: sheetStatus,
      name: spreadsheetName,
      url: spreadsheetUrl,
      targetTab: SHEET_NAME,
      totalRows: rowCount
    },
    emailPipeline: {
      senderIdentity: SENDER_NAME + " <" + SENDER_EMAIL + ">",
      dispatchEngine: emailMode,
      adminRecipients: ADMIN_EMAILS
    },
    timestamp: new Date().toISOString()
  };

  return ContentService.createTextOutput(JSON.stringify(statusResponse, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}


// =============================================================================
// 5. MAIN WEBHOOK RECEIVER (doPost)
// =============================================================================
/**
 * Main Webhook Receiver: Handles submissions from contact.html
 */
function doPost(e) {
  try {
    let data = {};
    if (e && e.postData && e.postData.type && e.postData.type.includes("json")) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      // Parse URL-encoded body
      const pairs = e.postData.contents.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        data[decodeURIComponent(pair[0])] = decodeURIComponent((pair[1] || '').replace(/\+/g, ' '));
      }
    }

    // Extract fields with robust fallbacks
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd MMM yyyy, hh:mm a 'IST'");
    const ref = data.ref || ("FR-" + Utilities.formatDate(timestamp, "Asia/Kolkata", "yyMMdd") + "-" + Math.floor(1000 + Math.random() * 9000));
    const name = (data.name || "Client").trim();
    const organisation = (data.organisation || data.organization || "Individual / Not specified").trim();
    const contactType = (data.type || "Corporate").trim();
    const email = (data.email || "").trim();
    const phone = (data.phone || "Not provided").trim();
    const robot = (data.robot || "General Robotic Advisory").trim();
    const mode = data.mode === "build" ? "Academic Build Workshop" : "Commercial Turnkey Purchase";
    
    // Format quote cleanly (avoid NaN)
    let total = "Custom Quotation";
    if (data.total && data.total.toString().trim() !== "") {
      const rawTotal = data.total.toString().trim();
      if (rawTotal.startsWith("₹")) {
        total = rawTotal;
      } else {
        const num = parseFloat(rawTotal.replace(/[^0-9.]/g, ''));
        total = isNaN(num) ? rawTotal : ("₹" + num.toLocaleString('en-IN'));
      }
    }

    const message = (data.message || "No additional requirements noted.").trim();
    const status = "NEW ORDER";

    // 1. Log to Google Sheet
    let sheetLogResult = null;
    let sheetLogError = null;
    try {
      sheetLogResult = logToSheet([
        formattedDate,
        ref,
        name,
        organisation,
        contactType,
        email,
        "'" + phone, // Apostrophe prevents Sheets from dropping leading zeros or country codes
        robot,
        mode,
        total,
        message,
        status
      ]);
    } catch (sheetErr) {
      sheetLogError = sheetErr.toString();
      Logger.log("Sheet Logging Error: " + sheetLogError);
    }

    // 2. Send Alert Email to Founder & Procurement Desk (orders@ & support@)
    try {
      sendAdminNotification({
        date: formattedDate,
        ref: ref,
        name: name,
        organisation: organisation,
        contactType: contactType,
        email: email,
        phone: phone,
        robot: robot,
        mode: mode,
        total: total,
        message: message,
        sheetError: sheetLogError,
        spreadsheetUrl: sheetLogResult ? sheetLogResult.spreadsheetUrl : null
      });
    } catch (adminMailErr) {
      Logger.log("Admin Email Error: " + adminMailErr.toString());
    }

    // 3. Send Automated Customer Confirmation Email (if valid customer email provided)
    if (email && email.includes("@")) {
      try {
        sendCustomerConfirmation({
          ref: ref,
          name: name,
          email: email,
          robot: robot,
          total: total
        });
      } catch (custMailErr) {
        Logger.log("Customer Email Error: " + custMailErr.toString());
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      ref: ref,
      sheetLogged: !sheetLogError,
      message: "Order request received and processed successfully."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Fatal Error in doPost: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


// =============================================================================
// 6. SPREADSHEET ACCESS & ROW LOGGING
// =============================================================================
/**
 * Resolves the Google Spreadsheet instance (via SPREADSHEET_ID_OR_URL or bound active spreadsheet)
 */
function getSpreadsheet() {
  // 1. If explicit URL or ID is configured, open by ID
  if (typeof SPREADSHEET_ID_OR_URL !== 'undefined' && SPREADSHEET_ID_OR_URL && SPREADSHEET_ID_OR_URL.trim() !== "") {
    const raw = SPREADSHEET_ID_OR_URL.trim();
    const match = raw.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const sheetId = match ? match[1] : raw;
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch (e) {
      throw new Error("Could not open Google Sheet with ID/URL '" + raw + "': " + e.message + ". Please verify permissions or check the URL.");
    }
  }

  // 2. Otherwise use the active container-bound spreadsheet
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  throw new Error("No Google Spreadsheet found! Either paste your Google Sheet URL into 'SPREADSHEET_ID_OR_URL' on line 21, or create this script from inside Google Sheets via Extensions > Apps Script.");
}

/**
 * Gets or creates the target sheet tab with official FUTURE ROBOTIX header styling
 */
function getOrCreateOrdersSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // If the spreadsheet is brand new with an empty default "Sheet1", rename it to avoid extra blank tabs
    const sheets = ss.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheet = sheets[0];
      sheet.setName(SHEET_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_NAME, 0); // Insert as first tab
    }

    const headers = [
      "Timestamp (IST)", 
      "Reference #", 
      "Client Name", 
      "Organisation / Institution", 
      "Client Type", 
      "Email Address", 
      "Phone Number", 
      "Robot Configuration", 
      "Procurement Mode", 
      "Estimated Quote", 
      "Requirements / Notes", 
      "Lead Status"
    ];
    sheet.appendRow(headers);
    
    // Header Styling (Midnight Navy with bold white text)
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0F172A");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 38);
    
    try {
      for (let c = 1; c <= headers.length; c++) {
        sheet.autoResizeColumn(c);
      }
    } catch (e) {}
  }

  return sheet;
}

/**
 * Appends row to the spreadsheet safely using LockService
 */
function logToSheet(rowData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    Logger.log("Lock acquisition warning: " + e.toString());
  }

  try {
    const ss = getSpreadsheet();
    const sheet = getOrCreateOrdersSheet(ss);
    sheet.appendRow(rowData);

    // Format new row styling
    const lastRow = sheet.getLastRow();
    const rowRange = sheet.getRange(lastRow, 1, 1, rowData.length);
    rowRange.setVerticalAlignment("middle");

    // Highlight status cell
    const statusCell = sheet.getRange(lastRow, rowData.length);
    statusCell.setBackground("#FEF3C7");
    statusCell.setFontColor("#92400E");
    statusCell.setFontWeight("bold");
    statusCell.setHorizontalAlignment("center");

    SpreadsheetApp.flush();
    return {
      success: true,
      row: lastRow,
      spreadsheetUrl: ss.getUrl()
    };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}


// =============================================================================
// 7. EMAIL DISPATCH ENGINE
// =============================================================================
/**
 * Sends email with support@futurerobotix.in identity and Resend/Gmail alias support
 */
function sendCustomEmail(recipient, subject, htmlBody) {
  // 1. Try sending via Resend API if API Key is configured
  if (typeof RESEND_API_KEY !== 'undefined' && RESEND_API_KEY && RESEND_API_KEY.trim().startsWith("re_")) {
    try {
      const recipients = recipient.split(",").map(function(e) { return e.trim(); }).filter(Boolean);
      const resendPayload = {
        from: SENDER_NAME + " <" + SENDER_EMAIL + ">",
        to: recipients,
        reply_to: SENDER_EMAIL,
        subject: subject,
        html: htmlBody
      };

      const response = UrlFetchApp.fetch("https://api.resend.com/emails", {
        method: "post",
        contentType: "application/json",
        headers: {
          "Authorization": "Bearer " + RESEND_API_KEY.trim()
        },
        payload: JSON.stringify(resendPayload),
        muteHttpExceptions: true
      });

      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();
      Logger.log("Resend API Status: " + responseCode + " - " + responseText);

      if (responseCode === 200 || responseCode === 201) {
        return { success: true, engine: "Resend API" };
      } else {
        Logger.log("Resend API rejected: " + responseText + ". Falling back to GmailApp.");
      }
    } catch (apiErr) {
      Logger.log("Resend API Error: " + apiErr.toString() + ". Falling back to GmailApp.");
    }
  }

  // 2. Send via GmailApp (Checks for alias)
  let fromAlias = null;
  try {
    const aliases = GmailApp.getAliases();
    if (aliases && aliases.indexOf(SENDER_EMAIL) !== -1) {
      fromAlias = SENDER_EMAIL;
    }
  } catch (e) {
    Logger.log("Alias check error: " + e.toString());
  }

  const options = {
    htmlBody: htmlBody,
    name: SENDER_NAME,
    replyTo: SENDER_EMAIL
  };

  if (fromAlias) {
    options.from = fromAlias;
  } else {
    Logger.log("NOTICE: '" + SENDER_EMAIL + "' is not registered as an alias in Gmail. Outgoing mail will display primary account address unless Resend API key or Gmail alias is added.");
  }

  try {
    GmailApp.sendEmail(recipient, subject, "", options);
    return { success: true, engine: fromAlias ? "GmailApp Alias" : "GmailApp Primary" };
  } catch (err) {
    Logger.log("GmailApp send error: " + err.toString() + ". Falling back to MailApp.");
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody,
      name: SENDER_NAME,
      replyTo: SENDER_EMAIL
    });
    return { success: true, engine: "MailApp" };
  }
}


// =============================================================================
// 8. 1-CLICK DIAGNOSTICS & TEST RUNNERS
// =============================================================================
/**
 * 1-CLICK TEST 1: Verify Google Sheet Logging
 * Select 'testLogOrderToSheet' from the dropdown in Apps Script and click 'Run'.
 * This writes a test row directly to your Google Sheet and logs the exact URL!
 */
function testLogOrderToSheet() {
  Logger.log("==================================================");
  Logger.log("FUTURE ROBOTIX — Testing Google Sheets Connection");
  Logger.log("==================================================");
  try {
    const ss = getSpreadsheet();
    Logger.log("Spreadsheet Found: " + ss.getName());
    Logger.log("Spreadsheet URL: " + ss.getUrl());
    
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd MMM yyyy, hh:mm a 'IST'");
    const testRef = "FR-TEST-" + Math.floor(1000 + Math.random() * 9000);
    
    const result = logToSheet([
      formattedDate,
      testRef,
      "Verification Test Client",
      "FUTURE ROBOTIX Pipeline Test",
      "Corporate",
      "test@futurerobotix.in",
      "'+91 9876543210",
      "Butterfly Quadruped Robot",
      "Commercial Turnkey Purchase",
      "₹18,50,000",
      "Pipeline verification test row.",
      "VERIFIED"
    ]);

    Logger.log("✅ SUCCESS! Test row appended at row #" + result.row);
    Logger.log("👉 Open your spreadsheet to view the row: " + result.spreadsheetUrl);
  } catch (err) {
    Logger.log("❌ FAILED to write to Google Sheet!");
    Logger.log("Error details: " + err.toString());
    Logger.log("FIX: Copy your Google Sheet URL from your browser address bar and paste it into SPREADSHEET_ID_OR_URL on line 21 of this script!");
  }
  Logger.log("==================================================");
}

/**
 * 1-CLICK TEST 2: Verify Sender Identity & Email Dispatch
 * Select 'testSenderIdentity' from the dropdown in Apps Script and click 'Run'.
 * This tests whether outgoing emails show as support@futurerobotix.in.
 */
function testSenderIdentity() {
  const accountEmail = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  let aliases = [];
  try {
    aliases = GmailApp.getAliases();
  } catch (e) {
    Logger.log("Could not fetch aliases: " + e.toString());
  }

  Logger.log("==================================================");
  Logger.log("FUTURE ROBOTIX Pipeline — Sender Diagnostic");
  Logger.log("==================================================");
  Logger.log("Active Google Account: " + accountEmail);
  Logger.log("Configured Target Sender: " + SENDER_EMAIL);
  Logger.log("Admin Alert Recipient(s): " + ADMIN_EMAILS);
  Logger.log("Available Gmail Aliases: " + JSON.stringify(aliases));

  let statusMsg = "";
  if (typeof RESEND_API_KEY !== 'undefined' && RESEND_API_KEY && RESEND_API_KEY.trim().startsWith("re_")) {
    statusMsg = "Resend API: ACTIVE. Emails will be dispatched via Resend cloud from: " + SENDER_EMAIL;
    Logger.log("✅ " + statusMsg);
  } else if (aliases.indexOf(SENDER_EMAIL) !== -1) {
    statusMsg = "Alias Status: VERIFIED. '" + SENDER_EMAIL + "' is an active Gmail alias. Outgoing emails will appear from: " + SENDER_EMAIL;
    Logger.log("✅ " + statusMsg);
  } else {
    statusMsg = "Alias Status: MISSING. Emails will temporarily show sender as: " + accountEmail;
    Logger.log("⚠️ " + statusMsg);
    Logger.log("WHY IT SHOWS " + accountEmail + ":");
    Logger.log("Google Apps Script enforces strict anti-spoofing security. You cannot send as support@futurerobotix.in from a free @gmail.com account without either:");
    Logger.log("  1. Free Resend API: Sign up at resend.com, add domain futurerobotix.in, paste API key in RESEND_API_KEY (Line 42).");
    Logger.log("  2. Gmail Alias: Open Gmail -> Settings -> Accounts and Import -> 'Add another email address' (support@futurerobotix.in) with SMTP.");
    Logger.log("  3. Google Workspace: If you have Workspace for futurerobotix.in, open Apps Script and deploy directly while logged into support@futurerobotix.in.");
  }
  Logger.log("==================================================");

  // Send a test email to admin
  try {
    const testSubject = "🧪 Pipeline Test Alert | FUTURE ROBOTIX Order System";
    const testBody = `
      <div style="font-family: sans-serif; padding: 24px; background: #0B0F19; color: #fff; border-radius: 8px;">
        <h2 style="color: #FF8A3D; margin-top: 0;">FUTURE ROBOTIX Pipeline Diagnostic Test</h2>
        <p>This is a test notification from your Google Apps Script pipeline.</p>
        <p><strong>Configured Sender:</strong> ${SENDER_NAME} &lt;${SENDER_EMAIL}&gt;</p>
        <p><strong>Dispatch Status:</strong> ${statusMsg}</p>
        <p><strong>Recipients:</strong> ${ADMIN_EMAILS}</p>
      </div>
    `;
    sendCustomEmail(accountEmail, testSubject, testBody);
    Logger.log("📨 A test email has been dispatched to: " + accountEmail + ". Please inspect the sender address in your inbox!");
  } catch (err) {
    Logger.log("Failed to send test email: " + err.toString());
  }
}


// =============================================================================
// 9. EMAIL TEMPLATES
// =============================================================================
/**
 * Sends formatted alert to udaysahu@futurerobotix.in and orders@futurerobotix.in
 */
function sendAdminNotification(d) {
  const cleanPhone = (d.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone.length >= 10 
    ? "https://wa.me/" + (cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone) + "?text=" + encodeURIComponent("Hello " + d.name + ", this is Uday Sahu from FUTURE ROBOTIX regarding your order request " + d.ref + " for " + d.robot + ".")
    : "";

  const subject = "🚨 NEW ORDER REQUEST: " + d.robot + " [" + d.ref + "] - " + d.organisation;

  const sheetWarningBanner = d.sheetError ? `
    <div style="background: #7F1D1D; border: 1px solid #EF4444; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; color: #FEE2E2; font-size: 13px;">
      <strong>⚠️ SPREADSHEET LOGGING ALERT:</strong><br>
      This order could not be logged into Google Sheets: <code>${d.sheetError}</code>.<br>
      <em>Fix: Open your Apps Script code and paste your Google Sheet URL into SPREADSHEET_ID_OR_URL on line 21.</em>
    </div>
  ` : (d.spreadsheetUrl ? `
    <div style="background: #064E3B; border: 1px solid #10B981; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px; color: #D1FAE5; font-size: 13px;">
      ✓ Successfully logged to Google Sheet: <a href="${d.spreadsheetUrl}" style="color: #6EE7B7; font-weight: 600;">Open Orders Spreadsheet →</a>
    </div>
  ` : "");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #0B0F19; color: #F1F5F9; border-radius: 12px; border: 1px solid #1E293B; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #FF8A3D 0%, #EA580C 100%); padding: 24px 28px;">
        <p style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.9);">Official Procurement Desk</p>
        <h1 style="margin: 6px 0 0; font-size: 22px; color: #FFFFFF; font-weight: 700;">New Customer Order Logged</h1>
      </div>

      <div style="padding: 24px 28px;">
        ${sheetWarningBanner}

        <div style="background: #111827; border-left: 4px solid #FF8A3D; padding: 14px 18px; margin-bottom: 24px; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #94A3B8;">Reference Number: <strong style="color: #FF8A3D; font-size: 15px; font-family: monospace;">${d.ref}</strong></p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #94A3B8;">Received: <strong style="color: #E2E8F0;">${d.date}</strong></p>
        </div>

        <h3 style="margin: 0 0 12px; font-size: 15px; text-transform: uppercase; color: #FF8A3D; letter-spacing: 1px;">Customer Information</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-size: 14px; width: 140px;">Name:</td>
            <td style="padding: 8px 0; color: #F8FAFC; font-weight: 600; font-size: 14px;">${d.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-size: 14px;">Organisation:</td>
            <td style="padding: 8px 0; color: #F8FAFC; font-size: 14px;">${d.organisation}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-size: 14px;">Sector / Type:</td>
            <td style="padding: 8px 0; color: #F8FAFC; font-size: 14px; text-transform: capitalize;">${d.contactType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-size: 14px;">Email:</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${d.email}" style="color: #38BDF8; text-decoration: none;">${d.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-size: 14px;">Phone:</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${d.phone}" style="color: #38BDF8; text-decoration: none; font-weight: 600;">${d.phone}</a></td>
          </tr>
        </table>

        <h3 style="margin: 0 0 12px; font-size: 15px; text-transform: uppercase; color: #FF8A3D; letter-spacing: 1px;">Procurement Specifications</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #111827; border-radius: 8px; padding: 12px;">
          <tr>
            <td style="padding: 10px 14px; color: #94A3B8; font-size: 14px; width: 140px;">Robot Model:</td>
            <td style="padding: 10px 14px; color: #F8FAFC; font-weight: 600; font-size: 14px;">${d.robot}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; color: #94A3B8; font-size: 14px;">Mode:</td>
            <td style="padding: 10px 14px; color: #F8FAFC; font-size: 14px;">${d.mode}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; color: #94A3B8; font-size: 14px;">Config Estimate:</td>
            <td style="padding: 10px 14px; color: #34D399; font-weight: 700; font-size: 16px;">${d.total}</td>
          </tr>
        </table>

        <h3 style="margin: 0 0 8px; font-size: 15px; text-transform: uppercase; color: #FF8A3D; letter-spacing: 1px;">Client Requirements</h3>
        <div style="background: #111827; padding: 14px 18px; border-radius: 8px; color: #CBD5E1; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 28px;">
${d.message}
        </div>

        <div style="display: flex; gap: 12px; margin-top: 10px;">
          ${whatsappUrl ? `<a href="${whatsappUrl}" style="background: #25D366; color: #FFFFFF; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block; margin-right: 10px;">Chat on WhatsApp →</a>` : ""}
          <a href="mailto:${d.email}?subject=RE: Order Request ${d.ref} - FUTURE ROBOTIX" style="background: #FF8A3D; color: #FFFFFF; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">Reply via Email →</a>
        </div>
      </div>

      <div style="background: #060911; padding: 14px 28px; border-top: 1px solid #1E293B; font-size: 12px; color: #64748B; text-align: center;">
        FUTURE ROBOTIX Engineering Desk · Registered MSME: UDYAM-DL-03-0091615 · New Delhi, India
      </div>
    </div>
  `;

  sendCustomEmail(ADMIN_EMAILS, subject, htmlBody);
}

/**
 * Sends automated confirmation email to customer
 */
function sendCustomerConfirmation(d) {
  const subject = "Order Request Confirmation [" + d.ref + "] | FUTURE ROBOTIX";
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F1F5F9; border-radius: 12px; border: 1px solid #1E293B; overflow: hidden;">
      <div style="background: #111827; border-bottom: 2px solid #FF8A3D; padding: 24px 28px;">
        <h2 style="margin: 0; color: #FF8A3D; font-size: 20px; font-weight: 700;">FUTURE ROBOTIX</h2>
        <p style="margin: 4px 0 0; color: #94A3B8; font-size: 13px;">Commercial Procurement & Engineering Advisory</p>
      </div>

      <div style="padding: 24px 28px;">
        <p style="font-size: 16px; color: #F8FAFC; margin-top: 0;">Dear ${d.name},</p>
        <p style="font-size: 14px; color: #CBD5E1; line-height: 1.6;">
          Thank you for initiating your robotic procurement request with FUTURE ROBOTIX. Your specifications have been directly logged with our technical desk in New Delhi.
        </p>

        <div style="background: #111827; border: 1px solid #1E293B; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #94A3B8;">Tracking Reference: <strong style="color: #FF8A3D; font-family: monospace; font-size: 15px;">${d.ref}</strong></p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #94A3B8;">Selected Platform: <strong style="color: #FFFFFF;">${d.robot}</strong></p>
          ${d.total && d.total !== "Custom Quotation" ? `<p style="margin: 6px 0 0; font-size: 13px; color: #94A3B8;">Estimated Configuration Quote: <strong style="color: #34D399;">${d.total}</strong></p>` : ""}
        </div>

        <h3 style="font-size: 15px; color: #F1F5F9; margin: 24px 0 10px;">What happens next?</h3>
        <ol style="color: #94A3B8; font-size: 14px; line-height: 1.7; padding-left: 20px; margin: 0 0 24px;">
          <li><strong>Engineering Review:</strong> Our systems engineers review your facility parameters and operational payload.</li>
          <li><strong>Consultation:</strong> A technical engineer will contact you within <strong>1 business day</strong>.</li>
          <li><strong>On-Site Feasibility Assessment:</strong> We schedule an on-site demonstration and surface survey.</li>
          <li><strong>Itemized Quotation & MoU:</strong> Official quotation and warranty contract issued under our MSME accreditation.</li>
        </ol>

        <p style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
          If you have urgent questions, you can reply directly to this email or write to <a href="mailto:support@futurerobotix.in" style="color: #FF8A3D; text-decoration: none;">support@futurerobotix.in</a>.
        </p>
      </div>

      <div style="background: #060911; padding: 14px 28px; border-top: 1px solid #1E293B; font-size: 11px; color: #64748B; text-align: center;">
        FUTURE ROBOTIX · Registered Address: M-28, Top Floor, Sham Nagar, Khyala Road, New Delhi 110018<br>
        UDYAM-DL-03-0091615 (Ministry of MSME, Govt. of India)
      </div>
    </div>
  `;

  sendCustomEmail(d.email, subject, htmlBody);
}
