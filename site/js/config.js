/**
 * FUTURE ROBOTIX — Site Content & Configuration
 * All confirmed facts are filled in. [FILL: ...] items are still missing.
 * Used by main.js and all pages.
 */

const SITE = {
  name: 'FUTURE ROBOTIX',
  wordmark: 'FUTURE',
  tagline: 'The future you imagined as a child. Built today.',
  domain: 'futurerobotix.in',

  // Confirmed
  udyam: 'UDYAM-DL-03-0091615',
  legalStructure: 'Sole proprietorship',
  registeredAddress: 'M-28, Top Floor, Sham Nagar, Khyala Road, New Delhi 110018',
  gstin: null, // No GSTIN

  // Founder
  founder: {
    name: 'Uday Sahu',
    role: 'Founder and CEO',
    shortBio: 'Uday studies B.Tech in VLSI (Electrical Engineering) at VIPS-TC, GGSIPU. He works on autonomous robotics, embedded motor control systems, custom PCB avionics and AI-driven hardware.',
    story: null,        // [FILL: founder story]
    achievements: null, // [FILL: founder achievements]
    linkedin: null,     // [FILL: founder LinkedIn URL]
    photo: null,        // [FILL: founder photo file]
  },

  // Grievance Officer (confirmed name, contact still missing)
  grievanceOfficer: {
    name: 'Ms. Shikha Choudhary',
    email: null,  // [FILL: grievance officer email]
    phone: null,  // [FILL: grievance officer phone]
  },

  // Contact (all missing)
  contact: {
    phone: null,      // [FILL: official phone number]
    whatsapp: null,   // [FILL: WhatsApp business number]
    hours: null,      // [FILL: working hours]
    emailHello: `hello@futurerobotix.in`,
    emailOrders: `orders@futurerobotix.in`,
    emailSupport: `support@futurerobotix.in`,
  },

  // Infrastructure (all missing)
  infra: {
    hosting: null,       // [FILL: hosting provider]
    enquiryStorage: null,// [FILL: enquiry storage provider]
    emailHosting: null,  // [FILL: email hosting provider]
    backup: null,        // [FILL: backup provider]
    analytics: null,     // [FILL: analytics tool or "none"]
  },

  // Reply time (placeholder)
  replyTime: '[FILL: reply time promise, e.g. within 2 working days]',

  // Udyam certificate (awaiting redacted PDF)
  udyamCertPdf: null, // [FILL: redacted Udyam certificate PDF]

  // Year
  year: new Date().getFullYear(),
};

// Export for use in modules
if (typeof module !== 'undefined') module.exports = SITE;

