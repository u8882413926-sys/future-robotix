/**
 * FUTURE ROBOTIX — Site Content & Configuration
 * Authoritative enterprise robotics configuration and verifiable legal data.
 * Used by main.js and across all pages.
 */

const SITE = {
  name: 'FUTURE ROBOTIX',
  wordmark: 'FUTURE ROBOTIX',
  tagline: 'Industrial-Grade Autonomous Systems & Advanced Robotics.',
  domain: 'futurerobotix.in',

  // Official Legal & Government Registration
  udyam: 'UDYAM-DL-03-0091615',
  legalRegistration: 'Ministry of Micro, Small & Medium Enterprises (MSME), Government of India',
  enterpriseType: 'Officially Registered Micro-Enterprise (Robotics & Mechatronics)',
  registeredAddress: 'M-28, Top Floor, Sham Nagar, Khyala Road, New Delhi 110018',
  complianceStandards: 'ISO-aligned mechatronics fabrication, CE/RoHS compliant electronics, dual-layer hardware E-Stop protocols',

  // Founder & Chief Technology Architect
  founder: {
    name: 'Uday Sahu',
    role: 'Founder & Chief Technology Architect',
    shortBio: 'Uday Sahu leads FUTURE ROBOTIX as Founder and Chief Technology Architect. Specializing in VLSI design and embedded mechatronics from GGSIPU, he engineers autonomous mobility platforms, ROS 2 embedded kinematics, custom PCB avionics, and multi-sensor edge AI systems.',
    specialization: 'VLSI System Design, Embedded Robotics, Field-Oriented Motor Control (FOC), LiDAR SLAM Navigation',
    linkedin: 'https://linkedin.com/company/futurerobotix'
  },

  // Grievance Officer & Corporate Regulatory Affairs
  grievanceOfficer: {
    name: 'Ms. Shikha Choudhary',
    role: 'Operations & Grievance Officer',
    email: 'hello@futurerobotix.in',
    responsibilities: 'Statutory compliance, DPDP framework adherence, institutional partnership coordination.'
  },

  // Official Engineering & Procurement Channels
  contact: {
    emailHello: 'hello@futurerobotix.in',
    emailOrders: 'orders@futurerobotix.in',
    emailSupport: 'support@futurerobotix.in',
    supportHours: 'Monday – Saturday: 09:30 – 18:30 IST',
    responseTime: 'Guaranteed technical response within 1 business day'
  },

  // Deployment & Manufacturing Standards
  manufacturing: {
    materials: '6061-T6 Aircraft-Grade Aluminum Alloy, Carbon Fiber Composite Shells, Industrial Polycarbonate',
    actuators: 'High-Torque Brushless DC (BLDC) Motors, Planetary & Cycloidal Reduction Gearboxes, Magnetic Absolute Encoders',
    avionics: 'NVIDIA Jetson Edge AI Compute, STM32 Real-Time Microcontrollers, High-Current Smart BMS',
    testingProtocol: '48-Hour Continuous Autonomous Burn-In, Ingress & Thermal Stress Qualification prior to shipment'
  },

  year: new Date().getFullYear(),
};

// Export for use in CommonJS modules if required
if (typeof module !== 'undefined') module.exports = SITE;
