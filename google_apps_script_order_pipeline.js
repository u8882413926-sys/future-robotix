/**
 * FUTURE ROBOTIX — Production Customer Order & Inquiry Webhook Pipeline
 * 
 * Google Apps Script Web App
 * 100% Free, Zero Server Maintenance, 99.99% Google Cloud Uptime
 * 
 * Capabilities:
 * 1. Appends every customer order/inquiry directly into Google Sheets in real-time.
 * 2. Sends an instant formatted alert email to orders@futurerobotix.in & udaysahu@futurerobotix.in.
 * 3. Sends an automated confirmation email with official Tracking Ref # to the customer.
 * 4. Dispatches emails as "FUTURE ROBOTIX" with reply-to & sender support@futurerobotix.in.
 * 5. Provides direct 1-click WhatsApp and Phone links in your alert email for rapid response.
 */

// CONFIGURATION: Admin notification recipients & sender identity
const ADMIN_EMAILS = "orders@futurerobotix.in, udaysahu@futurerobotix.in";
const SENDER_NAME = "FUTURE ROBOTIX Support";
const SENDER_EMAIL = "support@futurerobotix.in";
const COMPANY_NAME = "FUTURE ROBOTIX";
const COMPANY_WEBSITE = "https://futurerobotix.in";
const SHEET_NAME = "Orders & Inquiries";

/**
 * Health check endpoint (when accessed via browser)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "FUTURE ROBOTIX Procurement Pipeline",
    sender: SENDER_EMAIL,
    authorizedRecipients: ADMIN_EMAILS,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Main Webhook Receiver: Handles submissions from contact.html
 */
function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.type && e.postData.type.includes("json")) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      // Parse URL-encoded body
      const pairs = e.postData.contents.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        data[decodeURIComponent(pair[0])] = decodeURIComponent((pair[1] || '').replace(/\+/g, ' '));
      }
    }

    // Extract fields with fallbacks
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd MMM yyyy, hh:mm a 'IST'");
    const ref = data.ref || ("FR-" + Utilities.formatDate(timestamp, "Asia/Kolkata", "yyMMdd") + "-" + Math.floor(1000 + Math.random() * 9000));
    const name = data.name || "Client";
    const organisation = data.organisation || data.organization || "Individual / Not specified";
    const contactType = data.type || "Corporate";
    const email = data.email || "";
    const phone = data.phone || "Not provided";
    const robot = data.robot || "General Robotic Advisory";
    const mode = data.mode === "build" ? "Academic Build Workshop" : "Commercial Turnkey Purchase";
    const total = data.total ? (data.total.toString().startsWith("₹") ? data.total : "₹" + Number(data.total).toLocaleString('en-IN')) : "Custom Quotation";
    const message = data.message || "No additional requirements noted.";
    const status = "NEW ORDER";

    // 1. Log to Google Sheet
    try {
      logToSheet([
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
      Logger.log("Sheet Logging Error: " + sheetErr.toString());
    }

    // 2. Send Alert Email to Founder & Sales Desk (udaysahu@ & orders@)
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
        message: message
      });
    } catch (adminMailErr) {
      Logger.log("Admin Email Error: " + adminMailErr.toString());
    }

    // 3. Send Automated Customer Confirmation Email (if valid email provided)
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
      message: "Order request received and logged successfully."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Fatal Error in doPost: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Appends row to the spreadsheet and creates headers if new
 */
function logToSheet(rowData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
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
    
    // Header Styling
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0F172A");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
    
    for (let c = 1; c <= headers.length; c++) {
      sheet.autoResizeColumn(c);
    }
  }

  sheet.appendRow(rowData);
}

/**
 * Helper: Sends email with support@futurerobotix.in identity and alias support
 */
function sendCustomEmail(recipient, subject, htmlBody) {
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
  }

  try {
    GmailApp.sendEmail(recipient, subject, "", options);
  } catch (err) {
    Logger.log("GmailApp send error: " + err.toString() + ". Falling back to MailApp.");
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody,
      name: SENDER_NAME,
      replyTo: SENDER_EMAIL
    });
  }
}

/**
 * Sends formatted alert to udaysahu@futurerobotix.in and orders@futurerobotix.in
 */
function sendAdminNotification(d) {
  const cleanPhone = d.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone.length >= 10 
    ? "https://wa.me/" + (cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone) + "?text=" + encodeURIComponent("Hello " + d.name + ", this is Uday Sahu from FUTURE ROBOTIX regarding your order request " + d.ref + " for " + d.robot + ".")
    : "";

  const subject = "🚨 NEW ORDER REQUEST: " + d.robot + " [" + d.ref + "] - " + d.organisation;

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #0B0F19; color: #F1F5F9; border-radius: 12px; border: 1px solid #1E293B; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #FF8A3D 0%, #EA580C 100%); padding: 24px 28px;">
        <p style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.9);">Official Procurement Desk</p>
        <h1 style="margin: 6px 0 0; font-size: 22px; color: #FFFFFF; font-weight: 700;">New Customer Order Logged</h1>
      </div>

      <div style="padding: 24px 28px;">
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
