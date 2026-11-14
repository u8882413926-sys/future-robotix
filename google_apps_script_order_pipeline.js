/**
 * FUTURE ROBOTIX — Production Customer Order & Inquiry Webhook Pipeline
 * 
 * Google Apps Script Web App
 * 100% Free, Zero Server Maintenance, 99.99% Google Cloud Uptime
 * 
 * Capabilities:
 * 1. Appends every customer order/inquiry directly into Google Sheets in real-time.
 * 2. Connects to your Google Sheet by URL/ID or active container sheet.
 * 3. Sends instant executive black/grey/white alert emails to orders@ & support@futurerobotix.in.
 * 4. Sends automated confirmation emails with official Tracking Ref # to the customer.
 * 5. Dispatches natively from "FUTURE ROBOTIX Support <support@futurerobotix.in>".
 * 6. Integrates official company phone & WhatsApp: +91 84480 22906.
 */

// =============================================================================
// 1. SPREADSHEET CONFIGURATION
// =============================================================================
// Connected to your verified Google Sheet
const SPREADSHEET_ID_OR_URL = "https://docs.google.com/spreadsheets/d/1ZTS1s22x__Or70Atk2vjAt_BQXHixGQfNY3VjuGDe1w/edit";

// The name of the tab inside your Google Sheet where orders are logged
const SHEET_NAME = "Orders & Inquiries";


// =============================================================================
// 2. COMPANY IDENTITY & ADMIN RECIPIENTS
// =============================================================================
// Incoming order alerts will be delivered to these email addresses (comma-separated):
const ADMIN_EMAILS = "orders@futurerobotix.in, support@futurerobotix.in, udaysahu@futurerobotix.in";

// SENDER IDENTITY
const SENDER_NAME = "FUTURE ROBOTIX Support";
const SENDER_EMAIL = "support@futurerobotix.in";
const COMPANY_NAME = "FUTURE ROBOTIX";
const COMPANY_WEBSITE = "https://futurerobotix.in";

// OFFICIAL COMPANY CONTACT & WHATSAPP
const COMPANY_PHONE = "+91 84480 22906";
const COMPANY_WHATSAPP = "918448022906";


// =============================================================================
// 3. OPTIONAL CLOUD SENDER (RESEND API)
// =============================================================================
// Left empty ("") because you are running directly inside Google Workspace (support@futurerobotix.in),
// which natively dispatches emails with 100% DKIM & SPF authentication.
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

  const statusResponse = {
    service: "FUTURE ROBOTIX Procurement Pipeline Webhook",
    status: sheetStatus === "connected" ? "operational" : "degraded",
    buildVersion: "2026.11.14-v3-light",
    templateVersion: "v3-light-executive",
    emailTheme: "Executive Clean White, Charcoal Grey & Black",
    spreadsheet: {
      status: sheetStatus,
      name: spreadsheetName,
      url: spreadsheetUrl,
      targetTab: SHEET_NAME,
      totalRows: rowCount
    },
    emailPipeline: {
      senderIdentity: SENDER_NAME + " <" + SENDER_EMAIL + ">",
      dispatchEngine: "Google Workspace Native (" + SENDER_EMAIL + ")",
      adminRecipients: ADMIN_EMAILS
    },
    companyContact: {
      phone: COMPANY_PHONE,
      whatsapp: "+" + COMPANY_WHATSAPP
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
    
    // Format quote cleanly
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
          mode: mode,
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
function getSpreadsheet() {
  if (typeof SPREADSHEET_ID_OR_URL !== 'undefined' && SPREADSHEET_ID_OR_URL && SPREADSHEET_ID_OR_URL.trim() !== "") {
    const raw = SPREADSHEET_ID_OR_URL.trim();
    const match = raw.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const sheetId = match ? match[1] : raw;
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch (e) {
      throw new Error("Could not open Google Sheet with ID/URL '" + raw + "': " + e.message);
    }
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  throw new Error("No Google Spreadsheet found! Please paste your Google Sheet URL into 'SPREADSHEET_ID_OR_URL'.");
}

function getOrCreateOrdersSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    const sheets = ss.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheet = sheets[0];
      sheet.setName(SHEET_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_NAME, 0);
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
    
    // Header Styling: High-contrast Dark Luxury Navy (#0A0A0A)
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0A0A0A");
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

    const lastRow = sheet.getLastRow();
    const rowRange = sheet.getRange(lastRow, 1, 1, rowData.length);
    rowRange.setVerticalAlignment("middle");

    const statusCell = sheet.getRange(lastRow, rowData.length);
    statusCell.setBackground("#18181B");
    statusCell.setFontColor("#FAFAFA");
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
function sendCustomEmail(recipient, subject, htmlBody) {
  // If Resend API key is configured, send via Resend
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

      if (response.getResponseCode() === 200 || response.getResponseCode() === 201) {
        return { success: true, engine: "Resend API" };
      }
    } catch (apiErr) {
      Logger.log("Resend API fallback: " + apiErr.toString());
    }
  }

  // Google Workspace Native GmailApp Sending (Sends natively as support@futurerobotix.in)
  const options = {
    htmlBody: htmlBody,
    name: SENDER_NAME,
    replyTo: SENDER_EMAIL
  };

  try {
    GmailApp.sendEmail(recipient, subject, "", options);
    return { success: true, engine: "Google Workspace Native" };
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
function testLogOrderToSheet() {
  Logger.log("=== Testing Google Sheets Connection ===");
  try {
    const ss = getSpreadsheet();
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd MMM yyyy, hh:mm a 'IST'");
    const testRef = "FR-TEST-" + Math.floor(1000 + Math.random() * 9000);
    
    const result = logToSheet([
      formattedDate,
      testRef,
      "Verification Test Client",
      "FUTURE ROBOTIX Engineering Lab",
      "Corporate",
      "test@futurerobotix.in",
      "'+91 84480 22906",
      "Humanoid Ultimate (36 DOF)",
      "Commercial Turnkey Purchase",
      "₹24,50,000",
      "Pipeline verification test row.",
      "VERIFIED"
    ]);

    Logger.log("SUCCESS! Test row appended at row #" + result.row);
  } catch (err) {
    Logger.log("FAILED to write to Google Sheet: " + err.toString());
  }
}

function testSenderIdentity() {
  const accountEmail = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  Logger.log("Active Google Account: " + accountEmail);
  Logger.log("Sender: " + SENDER_EMAIL);
  Logger.log("Recipients: " + ADMIN_EMAILS);
}

/**
 * 1-CLICK INSTANT TEST: Customer Confirmation Email (Executive Theme)
 * In the Apps Script editor, select 'testSendCustomerConfirmation' from the toolbar
 * dropdown and click 'Run'. It instantly sends the new monochrome email to your inbox!
 */
function testSendCustomerConfirmation() {
  Logger.log("=== Testing Executive Monochrome Customer Confirmation Email ===");
  sendCustomerConfirmation({
    ref: "FR-TEST-PREVIEW",
    name: "Uday Sahu (Founder Test)",
    email: SENDER_EMAIL, // Dispatches directly to support@futurerobotix.in
    robot: "Humanoid Ultimate (36 DOF & 5-Finger Hands)",
    mode: "Commercial Turnkey Purchase",
    total: "₹24,50,000"
  });
  Logger.log("SUCCESS! Test email dispatched to: " + SENDER_EMAIL);
}


// =============================================================================
// 9. EXECUTIVE LIGHT EMAIL TEMPLATES (Clean White, Charcoal Grey & Black)
// =============================================================================

/**
 * Sends Executive White/Grey/Black notification email to orders@ and support@futurerobotix.in
 */
function sendAdminNotification(d) {
  const cleanPhone = (d.phone || "").replace(/[^0-9]/g, "");
  const clientWhatsappUrl = cleanPhone.length >= 10 
    ? "https://wa.me/" + (cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone) + "?text=" + encodeURIComponent("Hello " + d.name + ", this is Uday Sahu from FUTURE ROBOTIX regarding your order request " + d.ref + " for " + d.robot + ".")
    : "";

  const subject = "NEW ORDER: " + d.robot + " [" + d.ref + "] - " + d.organisation;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F5F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
      
      <!-- Outer Full-Width Wrapper Table (Crisp Light Executive Canvas) -->
      <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F4F5F7" style="width: 100% !important; background-color: #F4F5F7; margin: 0; padding: 36px 12px;">
        <tr>
          <td align="center" valign="top" bgcolor="#F4F5F7">
            
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 28px 32px; background-color: #FFFFFF; border-bottom: 1px solid #F3F4F6;">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #6B7280;">Internal Procurement Desk</p>
                        <h1 style="margin: 4px 0 0; font-size: 20px; font-weight: 800; color: #111827; letter-spacing: 1px;">FUTURE ROBOTIX</h1>
                      </td>
                      <td align="right" valign="middle">
                        <span style="display: inline-block; padding: 4px 10px; background-color: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 4px; font-family: 'JetBrains Mono', Consolas, monospace; font-size: 12px; font-weight: 700; color: #111827; letter-spacing: 0.5px;">${d.ref}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 32px;">

                  <!-- Meta Strip -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 12px 16px;">
                    <tr>
                      <td style="font-size: 13px; color: #6B7280;">
                        Logged: <strong style="color: #111827; font-weight: 600;">${d.date}</strong>
                      </td>
                      <td align="right" style="font-size: 12px; color: #6B7280;">
                        Status: <span style="display: inline-block; padding: 2px 8px; background-color: #111827; color: #FFFFFF; border-radius: 3px; font-weight: 600; font-size: 11px;">NEW LEAD</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Section 1: Client Profile -->
                  <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280;">Client Profile</p>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #6B7280; width: 140px;">Client Name</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #111827; font-weight: 600;">${d.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #6B7280;">Organisation</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #374151;">${d.organisation}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #6B7280;">Sector / Type</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #374151; text-transform: capitalize;">${d.contactType}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #6B7280;">Direct Phone</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 600;">
                        <a href="tel:${d.phone}" style="color: #111827; text-decoration: underline;">${d.phone}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-size: 13px; color: #6B7280;">Email Address</td>
                      <td style="padding: 10px 0; font-size: 14px;">
                        <a href="mailto:${d.email}" style="color: #111827; text-decoration: underline;">${d.email}</a>
                      </td>
                    </tr>
                  </table>

                  <!-- Section 2: Technical Specifications -->
                  <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280;">Platform Specifications</p>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; overflow: hidden;">
                    <tr>
                      <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #6B7280; width: 140px;">Robot Model</td>
                      <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #111827; font-weight: 700;">${d.robot}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #6B7280;">Procurement Mode</td>
                      <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #374151;">${d.mode}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; font-size: 13px; color: #6B7280;">Config Estimate</td>
                      <td style="padding: 12px 16px; font-size: 15px; color: #111827; font-weight: 700; font-family: 'JetBrains Mono', monospace;">${d.total}</td>
                    </tr>
                  </table>

                  <!-- Section 3: Requirements Note -->
                  <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280;">Client Requirements</p>
                  <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 14px 18px; color: #374151; font-size: 13px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 28px;">
${d.message}
                  </div>

                  <!-- Action Buttons -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 10px;">
                    <tr>
                      <td style="padding-right: 8px;" width="50%">
                        ${clientWhatsappUrl ? `
                          <a href="${clientWhatsappUrl}" style="display: block; text-align: center; background-color: #111827; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 12px 0; border-radius: 6px; text-decoration: none;">
                            Chat with Client on WhatsApp →
                          </a>
                        ` : `
                          <a href="tel:${d.phone}" style="display: block; text-align: center; background-color: #111827; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 12px 0; border-radius: 6px; text-decoration: none;">
                            Call Client Directly →
                          </a>
                        `}
                      </td>
                      <td style="padding-left: 8px;" width="50%">
                        <a href="mailto:${d.email}?subject=RE: Order Request ${d.ref} - FUTURE ROBOTIX" style="display: block; text-align: center; background-color: #FFFFFF; color: #111827; font-size: 13px; font-weight: 600; padding: 12px 0; border-radius: 6px; text-decoration: none; border: 1px solid #D1D5DB;">
                          Reply via Email →
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 32px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280; text-align: center; line-height: 1.5;">
                  FUTURE ROBOTIX Engineering Desk · Registered MSME: UDYAM-DL-03-0091615<br>
                  Direct Helpline: ${COMPANY_PHONE} · New Delhi, India
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  sendCustomEmail(ADMIN_EMAILS, subject, htmlBody);
}


/**
 * Sends Ultra-Clean Executive White/Grey/Black confirmation email to the Customer
 */
function sendCustomerConfirmation(d) {
  const subject = "Order Confirmation [" + d.ref + "] | FUTURE ROBOTIX";
  const whatsappUrl = "https://wa.me/" + COMPANY_WHATSAPP + "?text=" + encodeURIComponent("Hello FUTURE ROBOTIX team, I am contacting you regarding my order reference " + d.ref + " for the " + d.robot + ".");

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F5F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
      
      <!-- Outer Full-Width Wrapper Table (Crisp Light Executive Canvas) -->
      <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F4F5F7" style="width: 100% !important; background-color: #F4F5F7; margin: 0; padding: 36px 12px;">
        <tr>
          <td align="center" valign="top" bgcolor="#F4F5F7">
            
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
              
              <!-- Minimalist Brand Header -->
              <tr>
                <td style="padding: 32px 36px 24px; background-color: #FFFFFF; border-bottom: 1px solid #F3F4F6;">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <h1 style="margin: 0; font-size: 21px; font-weight: 800; letter-spacing: 1.5px; color: #111827;">FUTURE ROBOTIX</h1>
                        <p style="margin: 4px 0 0; font-size: 12px; color: #6B7280; letter-spacing: 0.3px;">Autonomous Systems &amp; Advanced Mechatronics</p>
                      </td>
                      <td align="right" valign="top">
                        <span style="display: inline-block; padding: 5px 12px; background-color: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1F2937;">OFFICIAL RECEIPT</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Content Area -->
              <tr>
                <td style="padding: 36px;">

                  <p style="margin: 0 0 16px; font-size: 16px; color: #111827; font-weight: 700;">Dear ${d.name},</p>
                  
                  <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.65; color: #374151;">
                    Thank you for initiating your robotic procurement request with <strong style="color: #111827;">FUTURE ROBOTIX</strong>. Your facility specifications and payload requirements have been officially logged with our engineering desk in New Delhi.
                  </p>

                  <!-- Specification Dossier -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 32px; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="padding: 14px 18px; border-bottom: 1px solid #E5E7EB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; width: 140px;">Tracking Ref #</td>
                      <td style="padding: 14px 18px; border-bottom: 1px solid #E5E7EB; font-family: 'JetBrains Mono', Consolas, monospace; font-size: 14px; font-weight: 700; color: #111827; letter-spacing: 0.5px;">${d.ref}</td>
                    </tr>
                    <tr>
                      <td style="padding: 14px 18px; border-bottom: 1px solid #E5E7EB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6B7280;">Platform</td>
                      <td style="padding: 14px 18px; border-bottom: 1px solid #E5E7EB; font-size: 14px; font-weight: 700; color: #111827;">${d.robot}</td>
                    </tr>
                    ${d.mode ? `
                    <tr>
                      <td style="padding: 14px 18px; border-bottom: 1px solid #E5E7EB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6B7280;">Procurement Mode</td>
                      <td style="padding: 14px 18px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #374151;">${d.mode}</td>
                    </tr>
                    ` : ""}
                    ${d.total && d.total !== "Custom Quotation" ? `
                    <tr>
                      <td style="padding: 14px 18px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6B7280;">Estimated Budget</td>
                      <td style="padding: 14px 18px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #111827;">${d.total}</td>
                    </tr>
                    ` : ""}
                  </table>

                  <!-- Next Steps (Clean Monochromatic Steps) -->
                  <p style="margin: 0 0 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280;">Engineering Verification Protocol</p>
                  
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                    <tr>
                      <td valign="top" style="padding-bottom: 16px; width: 32px;">
                        <span style="display: block; width: 22px; height: 22px; line-height: 22px; text-align: center; background-color: #111827; color: #FFFFFF; font-size: 11px; font-weight: 700; border-radius: 50%;">1</span>
                      </td>
                      <td valign="top" style="padding-bottom: 16px; font-size: 13px; line-height: 1.5; color: #4B5563;">
                        <strong style="color: #111827;">Technical Review:</strong> Our systems engineers review your facility layout, payload criteria, and autonomous kinematics requirements.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top" style="padding-bottom: 16px; width: 32px;">
                        <span style="display: block; width: 22px; height: 22px; line-height: 22px; text-align: center; background-color: #111827; color: #FFFFFF; font-size: 11px; font-weight: 700; border-radius: 50%;">2</span>
                      </td>
                      <td valign="top" style="padding-bottom: 16px; font-size: 13px; line-height: 1.5; color: #4B5563;">
                        <strong style="color: #111827;">Direct Consultation:</strong> A mechatronics systems specialist will contact you directly within <strong style="color: #111827;">1 business day</strong>.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top" style="padding-bottom: 16px; width: 32px;">
                        <span style="display: block; width: 22px; height: 22px; line-height: 22px; text-align: center; background-color: #111827; color: #FFFFFF; font-size: 11px; font-weight: 700; border-radius: 50%;">3</span>
                      </td>
                      <td valign="top" style="padding-bottom: 16px; font-size: 13px; line-height: 1.5; color: #4B5563;">
                        <strong style="color: #111827;">On-Site Demonstration:</strong> We schedule an on-site feasibility survey and hardware demonstration at your premises.
                      </td>
                    </tr>
                    <tr>
                      <td valign="top" style="width: 32px;">
                        <span style="display: block; width: 22px; height: 22px; line-height: 22px; text-align: center; background-color: #111827; color: #FFFFFF; font-size: 11px; font-weight: 700; border-radius: 50%;">4</span>
                      </td>
                      <td valign="top" style="font-size: 13px; line-height: 1.5; color: #4B5563;">
                        <strong style="color: #111827;">MoU &amp; Itemized Commercial Invoice:</strong> Final institutional quotation and comprehensive SLA warranty contract issued under our MSME accreditation.
                      </td>
                    </tr>
                  </table>

                  <!-- Fast-Track WhatsApp CTA (Clean, Executive High Contrast) -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 22px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #111827;">Require Immediate Feasibility Scheduling?</p>
                        <p style="margin: 0 0 16px; font-size: 13px; color: #6B7280; line-height: 1.5;">Connect directly with our Chief Technology Architect on WhatsApp with your tracking reference.</p>
                        <a href="${whatsappUrl}" style="display: inline-block; background-color: #111827; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 6px; text-decoration: none; letter-spacing: 0.3px;">
                          Fast-Track on WhatsApp (${COMPANY_PHONE}) →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 13px; color: #6B7280; line-height: 1.6;">
                    You can also reply directly to this email or write to <a href="mailto:support@futurerobotix.in" style="color: #111827; text-decoration: underline; font-weight: 600;">support@futurerobotix.in</a> at any time.
                  </p>

                </td>
              </tr>

              <!-- Official Legal Footer -->
              <tr>
                <td style="padding: 24px 36px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280; text-align: center; line-height: 1.6;">
                  FUTURE ROBOTIX · Registered Address: M-28, Top Floor, Sham Nagar, Khyala Road, New Delhi 110018<br>
                  Accredited by Ministry of MSME, Govt. of India · UDYAM-DL-03-0091615<br>
                  Direct Technical Desk: <a href="tel:+918448022906" style="color: #111827; text-decoration: none; font-weight: 600;">${COMPANY_PHONE}</a>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  sendCustomEmail(d.email, subject, htmlBody);
}
