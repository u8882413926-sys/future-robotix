# FUTURE ROBOTIX — Website

Static multi-page website. No build step. Open `index.html` in any browser.

---

## Folder structure

```
site/
├── index.html              Home
├── robots.html             Robot grid (all 12)
├── robots/
│   ├── humanoid-essential.html
│   ├── humanoid-interactive.html
│   ├── humanoid-ultimate.html
│   ├── assistant-essential.html
│   ├── assistant-interactive.html
│   ├── assistant-premium.html
│   ├── sphere-play.html
│   ├── sphere-ai.html
│   ├── pet-essential.html
│   ├── pet-advanced.html
│   ├── pet-premium.html
│   └── butterfly-guide.html
├── institutions.html
├── experience.html
├── team.html
├── about.html
├── contact.html
├── privacy.html
├── terms.html
├── order-terms.html
├── order-success.html      (noindex)
├── 404.html                (noindex)
├── sitemap.xml
├── robots.txt
├── css/
│   └── design.css          Full design system (tokens, components, motion)
├── js/
│   ├── components.js       Nav + footer injector (shared across all pages)
│   ├── main.js             Scroll reveal, FAQ, form validation, [FILL] highlighter
│   ├── config.js           Site-wide constants (domain, emails, Udyam, etc.)
│   └── robots-render.js    Robot card grid + full detail page renderer
├── data/
│   └── robots.json         All 12 robot configurations
├── images/
│   └── robots/             Drop .webp images here (named per robots.json)
└── public/
    └── legal/              Drop redacted Udyam certificate PDF here
```

---

## How to open locally

Double-click `index.html`, or right-click → Open with → your browser.

> **Note:** Robot detail pages (`robots/humanoid-essential.html` etc.) load
> `data/robots.json` via `fetch()`. Chrome blocks `fetch()` from `file://`
> by default. Use one of these instead:
> - VS Code → **Live Server** extension → click "Go Live"
> - Python: `python -m http.server 8080` in the `site/` folder, then open `http://localhost:8080`
> - Node: `npx serve .` in the `site/` folder

---

## Filling in the placeholders

Every `[FILL: ...]` item is highlighted in **amber** on screen and in the code.
They map to the questions in `../QUESTIONS.md`. Priority order:

| Priority | Items |
|---|---|
| **Must have before launch** | A1–A10 in QUESTIONS.md (domain, phone, emails, working hours, infra providers) |
| **Needed for a full site** | B1–B5 (founder story, achievements, LinkedIn, team, experience) |
| **Robot content** | Populate `data/robots.json` — every `[FILL: ...]` in that file |
| **Legal** | Have a lawyer review `privacy.html`, `terms.html`, `order-terms.html` before going live |
| **Certificate** | Place redacted Udyam PDF at `public/legal/udyam-certificate-redacted.pdf` |

---

## Adding robot images

1. Place `.webp` files in `images/robots/`.  
   File names must match `images[0]` in `data/robots.json` exactly, e.g. `humanoid-essential.webp`.
2. The site shows a stylised placeholder (robot silhouette + "Image coming soon") until the real image is present.
3. Use 1600×1200 px for card images. Detail hero auto-scales.

---

## Design system

All colours, fonts, spacing, and motion live in `css/design.css` as CSS custom properties.
See `../DESIGN.md` for the full specification.

**Colour accent:** `--accent: #FF8A3D` (Ember orange)  
**Dark backgrounds:** `--bg-0` through `--bg-3`  
**Fonts:** Sora (headings) · Inter (body) · JetBrains Mono (specs/numbers)

---

## [FILL] items still outstanding (count: 16)

See `../QUESTIONS.md` Section A–C for the complete list with context.
The dev console will also log a warning for every `[FILL` found on page load.

Quick reference:

| Code | Missing item |
|---|---|
| A1 | Domain → confirmed as `futurerobotix.in` ✓ |
| A2 | Official phone number |
| A3 | WhatsApp business number |
| A4 | Working hours |
| A5 | Grievance officer email |
| A6 | Grievance officer phone |
| A7 | Hosting provider |
| A8 | Enquiry storage provider |
| A9 | Email hosting provider |
| A10 | Backup provider |
| B1 | Founder story |
| B2 | Founder achievements |
| B3 | Founder LinkedIn URL |
| B4 | Team members |
| B5 | Provable club/competition/demo work |
| C1 | Redacted Udyam certificate PDF |

---

## Pre-launch checklist

- [ ] All `[FILL: ...]` items replaced with real content
- [ ] Lawyer has reviewed all three legal pages
- [ ] Redacted Udyam certificate PDF placed in `public/legal/`
- [ ] Real robot images placed in `images/robots/`
- [ ] Founder photo placed and linked in `team.html`
- [ ] Contact form backend wired up (replace the `setTimeout` demo in `contact.html` and `robots-render.js`)
- [ ] Domain DNS configured
- [ ] HTTPS enabled on hosting
- [ ] Sitemap submitted to Google Search Console
- [ ] `robots.txt` verified
- [ ] Test all 12 robot detail pages
- [ ] Test on mobile (iPhone + Android)
- [ ] Test with keyboard only (accessibility)
- [ ] Verify order-success.html and 404.html carry `noindex`

---

## Already confirmed (no further action needed)

- ✅ Udyam number: UDYAM-DL-03-0091615
- ✅ Legal structure: Sole proprietorship
- ✅ Registered address: M-28, Top Floor, Sham Nagar, Khyala Road, New Delhi 110018
- ✅ No GSTIN
- ✅ Grievance Officer name: Ms. Shikha Choudhary
- ✅ Domain: futurerobotix.in
- ✅ Email addresses: hello@ / orders@ / support@ @futurerobotix.in
- ✅ Product portfolio: 12 configurations across 5 families
- ✅ Legal drafts: Privacy Policy, Terms of Use, Order Terms (awaiting lawyer review)

