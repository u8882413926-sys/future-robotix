/**
 * FUTURE ROBOTIX — components.js
 * Injects nav and footer into every page via id="site-nav" and id="site-footer"
 */

const SITE = {
  wordmark: 'FUTURE ROBOTIX',
  udyam: 'UDYAM-DL-03-0091615',
  address: 'M-28, Top Floor, Sham Nagar, Khyala Road, New Delhi 110018',
  emails: { hello: 'hello@futurerobotix.in', orders: 'orders@futurerobotix.in', support: 'support@futurerobotix.in' },
  phone: null,
  year: new Date().getFullYear(),
};

function _root() {
  if (window.location.protocol === 'file:') {
    const href = window.location.href.replace(/\\/g, '/');
    return href.includes('/robots/') ? '../' : '';
  }
  return '/';
}

function _url(slug) {
  if (window.location.protocol === 'file:') {
    const r = _root();
    return slug === '' ? `${r}index.html` : `${r}${slug}.html`;
  }
  return slug === '' ? '/' : `/${slug}`;
}

function _asset(path) {
  if (window.location.protocol === 'file:') {
    const r = _root();
    return `${r}${path}`;
  }
  return `/${path}`;
}

function injectNav() {
  const el = document.getElementById('site-nav');
  if (!el) return;
  const isDark = el.dataset.dark === 'true';
  if (isDark) el.classList.add('nav--dark');

  el.innerHTML = `
    <div class="nav__inner">
      <a href="${_url('')}" class="nav__logo" aria-label="FUTURE ROBOTIX — Autonomous Systems">
        <img src="${_asset('images/brand/future-robotix-logo.png')}" alt="FUTURE ROBOTIX — Autonomous Systems" class="nav__logo-img">
      </a>
      <nav id="nav-links" class="nav__links" aria-label="Main navigation">
        <a href="${_url('')}"             class="nav__link" id="nl-home">Home</a>
        <a href="${_url('robots')}"       class="nav__link" id="nl-robots">Robots</a>
        <a href="${_url('institutions')}" class="nav__link" id="nl-inst">Institutions</a>
        <a href="${_url('experience')}"   class="nav__link" id="nl-exp">Experience</a>
        <a href="${_url('team')}"         class="nav__link" id="nl-team">Team</a>
        <a href="${_url('about')}"        class="nav__link" id="nl-about">About</a>
        <a href="${_url('contact')}"      class="btn btn--primary btn--sm" id="nl-contact">Talk to us</a>
      </nav>
      <button class="nav__hamburger" id="nav-hamburger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
    </div>`;

  // Active link
  const path = window.location.pathname.toLowerCase();
  const linkMap = {
    'nl-home': path === '/' || path.endsWith('/index.html') || path.endsWith('/index') || path === '',
    'nl-robots': path.includes('/robots'),
    'nl-inst': path.includes('/institutions'),
    'nl-exp': path.includes('/experience'),
    'nl-team': path.includes('/team'),
    'nl-about': path.includes('/about')
  };
  for (const [id, active] of Object.entries(linkMap)) {
    const lnk = document.getElementById(id);
    if (lnk && active) {
      lnk.classList.add('active');
    }
  }
}

function injectFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const phoneHtml = SITE.phone
    ? `<div class="footer__link"><a href="tel:${SITE.phone}" class="footer__link">${SITE.phone}</a></div>`
    : `<div class="footer__link" style="color:rgba(255,255,255,0.45);font-size:0.85rem">Engineering Desk: Mon–Sat 09:30–18:30 IST</div>`;

  el.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <a href="${_url('')}" aria-label="FUTURE ROBOTIX Home" style="display:inline-block;text-decoration:none">
            <img src="${_asset('images/brand/future-robotix-logo-white.png')}" alt="FUTURE ROBOTIX — Autonomous Systems" class="footer__logo-img">
          </a>
          <p class="footer__tagline">Industrial-grade autonomous robotics &amp; mechatronic systems.<br>Engineered for mission-critical institutional and enterprise deployment.</p>
          <div class="trust-badge mt-4">
            <span class="trust-badge__dot"></span>
            Govt. of India MSME Registered · ${SITE.udyam}
          </div>
        </div>
        <div>
          <p class="footer__col-title">Robotic Systems</p>
          <nav class="footer__links" aria-label="Footer navigation">
            <a href="${_url('robots')}" class="footer__link">All Robotic Models (12)</a>
            <a href="${_url('institutions')}" class="footer__link">Institutional Deployment</a>
            <a href="${_url('experience')}" class="footer__link">Engineering Showcase</a>
            <a href="${_url('team')}" class="footer__link">Leadership &amp; Team</a>
            <a href="${_url('about')}" class="footer__link">Corporate &amp; MSME Standing</a>
            <a href="${_url('contact')}" class="footer__link">Commercial Inquiry &amp; Demo</a>
          </nav>
        </div>
        <div>
          <p class="footer__col-title">Compliance &amp; Legal</p>
          <nav class="footer__links" aria-label="Legal pages">
            <a href="${_url('privacy')}" class="footer__link">Privacy &amp; Data Protection</a>
            <a href="${_url('terms')}" class="footer__link">Terms of Service</a>
            <a href="${_url('order-terms')}" class="footer__link">Commercial Quotation Terms</a>
          </nav>
        </div>
        <div>
          <p class="footer__col-title">Engineering Desk</p>
          <div class="footer__links">
            <a href="mailto:${SITE.emails.orders}" class="footer__link"><strong>Procurement:</strong> ${SITE.emails.orders}</a>
            <a href="mailto:${SITE.emails.hello}" class="footer__link"><strong>Inquiries:</strong> ${SITE.emails.hello}</a>
            ${phoneHtml}
            <div class="footer__link" style="font-size:0.8125rem;color:rgba(255,255,255,0.45);line-height:1.6;margin-top:8px">
              R&amp;D &amp; Assembly Facility:<br>${SITE.address}
            </div>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__reg">FUTURE ROBOTIX · Officially Registered Autonomous Systems Enterprise · Ministry of MSME, Govt. of India (Udyam: ${SITE.udyam}) · New Delhi, India</p>
        <p class="footer__copy">© ${SITE.year} FUTURE ROBOTIX. All rights reserved.</p>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  injectNav();
  injectFooter();
});
