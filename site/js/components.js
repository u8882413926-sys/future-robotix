/**
 * FUTURE ROBOTIX — components.js
 * Injects nav and footer into every page via id="site-nav" and id="site-footer"
 */

const SITE = {
  wordmark: 'FUTURE ROBOTIX',
  udyam: 'UDYAM-DL-03-0091615',
  address: 'M-28, Top Floor, Sham Nagar, Khyala Road, New Delhi 110018',
  emails: { hello: 'hello@futurerobotics.in', orders: 'orders@futurerobotics.in', support: 'support@futurerobotics.in' },
  phone: null,
  year: new Date().getFullYear(),
};

function _root() {
  // Detect depth: robots/slug.html is depth-2 → needs '../'
  const parts = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
  const inSubdir = parts.length >= 2 && !parts[parts.length - 1].includes('.');
  // Simpler: check if we're in /robots/ directory by looking at href
  const href = window.location.href;
  const hasRobotsDir = /\/robots\/[^/]+\.html/.test(href);
  return hasRobotsDir ? '../' : '';
}

function injectNav() {
  const el = document.getElementById('site-nav');
  if (!el) return;
  const r = _root();
  const isDark = el.dataset.dark === 'true';
  if (isDark) el.classList.add('nav--dark');

  el.innerHTML = `
    <div class="nav__inner">
      <a href="${r}index.html" class="nav__logo" aria-label="FUTURE ROBOTIX — go to home page">
        <span class="wordmark">FUTURE ROBOTIX</span>
      </a>
      <nav id="nav-links" class="nav__links" aria-label="Main navigation">
        <a href="${r}index.html"        class="nav__link" id="nl-home">Home</a>
        <a href="${r}robots.html"       class="nav__link" id="nl-robots">Robots</a>
        <a href="${r}institutions.html" class="nav__link" id="nl-inst">Institutions</a>
        <a href="${r}experience.html"   class="nav__link" id="nl-exp">Experience</a>
        <a href="${r}team.html"         class="nav__link" id="nl-team">Team</a>
        <a href="${r}about.html"        class="nav__link" id="nl-about">About</a>
        <a href="${r}contact.html" class="btn btn--primary btn--sm" id="nl-contact">Talk to us</a>
      </nav>
      <button class="nav__hamburger" id="nav-hamburger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
    </div>`;

  // Active link
  const path = window.location.pathname;
  const linkMap = { 'nl-home': 'index', 'nl-robots': 'robots', 'nl-inst': 'institutions', 'nl-exp': 'experience', 'nl-team': 'team', 'nl-about': 'about' };
  for (const [id, key] of Object.entries(linkMap)) {
    const lnk = document.getElementById(id);
    if (lnk && (path.includes(key) || (key === 'index' && (path === '/' || path.endsWith('index.html'))))) {
      lnk.classList.add('active');
    }
  }
}

function injectFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const r = _root();
  const phoneHtml = SITE.phone
    ? `<div class="footer__link"><a href="tel:${SITE.phone}" class="footer__link">${SITE.phone}</a></div>`
    : `<div class="footer__link" style="color:rgba(255,255,255,0.45);font-size:0.85rem">Mon–Sat: 09:30–18:30 IST</div>`;

  el.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <p class="footer__wordmark">FUTURE ROBOTIX</p>
          <p class="footer__tagline">The future you imagined as a child.<br>Built today.</p>
          <div class="trust-badge">
            <span class="trust-badge__dot"></span>
            Udyam MSME · ${SITE.udyam}
          </div>
        </div>
        <div>
          <p class="footer__col-title">Explore</p>
          <nav class="footer__links" aria-label="Footer navigation">
            <a href="${r}robots.html" class="footer__link">Robots</a>
            <a href="${r}institutions.html" class="footer__link">Institutions</a>
            <a href="${r}experience.html" class="footer__link">Experience</a>
            <a href="${r}team.html" class="footer__link">Team</a>
            <a href="${r}about.html" class="footer__link">About</a>
            <a href="${r}contact.html" class="footer__link">Contact</a>
          </nav>
        </div>
        <div>
          <p class="footer__col-title">Legal</p>
          <nav class="footer__links" aria-label="Legal pages">
            <a href="${r}privacy.html" class="footer__link">Privacy Policy</a>
            <a href="${r}terms.html" class="footer__link">Terms of Use</a>
            <a href="${r}order-terms.html" class="footer__link">Order Terms</a>
          </nav>
        </div>
        <div>
          <p class="footer__col-title">Contact</p>
          <div class="footer__links">
            <a href="mailto:${SITE.emails.hello}" class="footer__link">${SITE.emails.hello}</a>
            <a href="mailto:${SITE.emails.orders}" class="footer__link">${SITE.emails.orders}</a>
            ${phoneHtml}
            <div class="footer__link" style="font-size:0.8125rem;color:rgba(255,255,255,0.35);line-height:1.6">${SITE.address}</div>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__reg">FUTURE ROBOTIX · Udyam MSME ${SITE.udyam} · Sole proprietorship · New Delhi</p>
        <p class="footer__copy">© ${SITE.year} FUTURE ROBOTIX. All rights reserved.</p>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  injectNav();
  injectFooter();
});
