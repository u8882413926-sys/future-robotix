/**
 * FUTURE ROBOTIX — robots-render.js
 * ─────────────────────────────────────────
 * Autonomous robotics showcase, spec sheet, and live configurator.
 * Data-bound to window.ROBOTS_DATA (zero network fetch, instant load).
 * 
 * Features:
 * - High-tech "Coming Soon" hardware placeholders (without mock images)
 * - Rich technical specifications matrix (Dimensions, Actuators, Battery, Sensors, Compute, ROS 2)
 * - Dual procurement pathways (Turnkey Commercial Deployment vs Academic Campus Build Kit)
 * - Interactive live pricing and dynamic quotation breakdown
 */

/* ─── Currency Formatter (Indian Numbering) ─── */
function formatINR(n) {
  if (n === null || n === undefined || isNaN(n)) return 'Price on request';
  return '₹' + Number(n).toLocaleString('en-IN');
}

/* ─── Geometric Family SVG Iconography ─── */
function getFamilyIconSvg(family, size = 48) {
  switch (family) {
    case 'humanoid':
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="24" cy="9" r="4.5"/>
          <rect x="17" y="16" width="14" height="15" rx="3"/>
          <line x1="20" y1="21" x2="28" y2="21"/>
          <path d="M17 19L11 27M31 19L37 27"/>
          <path d="M21 31L20 42M27 31L28 42"/>
        </svg>`;
    case 'assistant':
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="14" y="9" width="20" height="15" rx="4"/>
          <circle cx="20" cy="16" r="1.5" fill="currentColor"/>
          <circle cx="28" cy="16" r="1.5" fill="currentColor"/>
          <line x1="20" y1="20" x2="28" y2="20"/>
          <path d="M24 24L24 37"/>
          <rect x="13" y="37" width="22" height="4" rx="2"/>
        </svg>`;
    case 'sphere':
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="24" cy="24" r="17"/>
          <ellipse cx="24" cy="24" rx="17" ry="6"/>
          <ellipse cx="24" cy="24" rx="6" ry="17"/>
          <circle cx="24" cy="24" r="3.5" fill="currentColor"/>
        </svg>`;
    case 'pet':
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="12" y="17" width="22" height="12" rx="3"/>
          <path d="M34 19L40 14L42 18L34 23"/>
          <path d="M15 29L12 41M19 29L18 41M27 29L28 41M31 29L34 41"/>
          <path d="M12 19L8 16"/>
        </svg>`;
    case 'butterfly':
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <ellipse cx="24" cy="24" rx="2" ry="12"/>
          <path d="M22 17C14 9 6 15 10 25C13 31 22 25 22 25"/>
          <path d="M26 17C34 9 42 15 38 25C35 31 26 25 26 25"/>
          <path d="M22 25C15 29 14 37 20 39C23 40 23 33 23 33"/>
          <path d="M26 25C33 29 34 37 28 39C25 40 25 33 25 33"/>
          <path d="M23 12L20 6M25 12L28 6"/>
        </svg>`;
    default:
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="12" y="12" width="24" height="24" rx="4"/>
          <circle cx="20" cy="20" r="2" fill="currentColor"/>
          <circle cx="28" cy="20" r="2" fill="currentColor"/>
          <line x1="18" y1="28" x2="30" y2="28"/>
        </svg>`;
  }
}

/* ─── Grid Robot Card (Fleet & Homepage Showcase) ─── */
function renderRobotCard(robot, idx = 0, root = '') {
  const delay = Math.min(idx * 40, 360);
  const isFile = window.location.protocol === 'file:';
  const inRobotsDir = window.location.href.replace(/\\/g, '/').includes('/robots/');
  const r = (root !== undefined && root !== '') ? root : (isFile ? (inRobotsDir ? '../' : '') : '/');
  
  const basePriceText = robot.modes?.buy?.basePrice ? `From ${formatINR(robot.modes.buy.basePrice)}` : 'Custom Quote';
  const buildPriceText = robot.modes?.build?.kitPrice ? `Build Kit: ${formatINR(robot.modes.build.kitPrice)}` : 'On Request';

  const detailUrl = isFile ? `${r}robots/${robot.slug}.html` : `/robots/${robot.slug}`;
  const contactUrl = isFile
    ? `${r}contact.html?robot=${encodeURIComponent(robot.slug)}&name=${encodeURIComponent(robot.name)}`
    : `/contact?robot=${encodeURIComponent(robot.slug)}&name=${encodeURIComponent(robot.name)}`;

  // Spec highlights
  const quick = robot.quickSpecs || {};
  const formTag = quick.form || (robot.specs?.[0] ? robot.specs[0].split('·')[0].replace('Dimensions:', '').trim() : 'Standard Form');
  const batteryTag = quick.battery || (robot.specs?.[1] ? robot.specs[1].split('·')[0].replace('Battery:', '').trim() : 'High Runtime');
  const dofTag = quick.dof || (robot.specs?.[2] ? robot.specs[2].split('·')[0].replace('Kinematics:', '').trim() : 'Autonomous');

  // Capability Pills
  const opPills = (robot.operations || []).slice(0, 2).map(o => `<span class="robot-pill">${o.label}</span>`).join('');

  return `
    <article class="robot-box reveal" style="transition-delay:${delay}ms" data-family="${robot.family}" data-slug="${robot.slug}">
      <!-- Top badges -->
      <div class="robot-box__header">
        <span class="badge badge--dark">${robot.family.toUpperCase()}</span>
        <span class="robot-box__price-tag">${basePriceText}</span>
      </div>

      <!-- High-Tech "Coming Soon" Hardware Media Box -->
      <div class="robot-box__media">
        <div class="robot-box__placeholder">
          <div class="placeholder-grid"></div>
          <div class="placeholder-radar"></div>
          <div class="placeholder-icon">
            ${getFamilyIconSvg(robot.family, 52)}
          </div>
          <div class="placeholder-status">
            <span class="pulse-dot"></span>
            <span class="placeholder-status__text">IMAGE COMING SOON</span>
          </div>
          <div class="placeholder-note">Physical Units · On-Site Demo Ready</div>
        </div>
      </div>

      <!-- Info Area with Rich Details -->
      <div class="robot-box__body">
        <div class="flex items-center justify-between gap-2 mb-1">
          <h3 class="robot-box__title">${robot.name}</h3>
          <span class="robot-model-code">${robot.modelCode || robot.slug.toUpperCase()}</span>
        </div>
        <p class="robot-box__tagline">${robot.tagline}</p>

        <!-- Quick Spec Chips -->
        <div class="robot-card-specs">
          <span class="spec-chip" title="Form Factor & Weight">📐 ${formTag}</span>
          <span class="spec-chip" title="Power Architecture">⚡ ${batteryTag}</span>
          <span class="spec-chip" title="Joint Kinematics">⚙️ ${dofTag}</span>
        </div>

        <!-- Procurement Dual Pricing Snippet -->
        <div class="robot-card-modes">
          <div>
            <span class="text-low" style="font-size:0.68rem;display:block;text-transform:uppercase;letter-spacing:0.04em">Turnkey Purchase</span>
            <strong>${basePriceText}</strong>
          </div>
          <div style="text-align:right">
            <span class="text-low" style="font-size:0.68rem;display:block;text-transform:uppercase;letter-spacing:0.04em">Student Build Kit</span>
            <strong>${buildPriceText}</strong>
          </div>
        </div>

        <div class="robot-box__pills">${opPills}</div>
      </div>

      <!-- Hover Action Overlay -->
      <div class="robot-box__overlay">
        <div class="robot-box__overlay-content">
          <p class="robot-box__overlay-text">${robot.tagline}</p>
          <div class="robot-box__actions">
            <a href="${detailUrl}" class="btn btn--primary btn--sm" id="btn-know-more-${robot.slug}">
              Know More <span class="btn__arrow">→</span>
            </a>
            <a href="${contactUrl}" 
               class="btn btn--secondary btn--sm" id="btn-order-${robot.slug}">
              Order Robot
            </a>
          </div>
        </div>
      </div>

      <!-- Direct Card Link -->
      <a href="${detailUrl}" class="robot-box__hitbox" aria-label="Explore ${robot.name}"></a>
    </article>`;
}

/* ─── Detail Page Renderer (Comprehensive Specs & Interactive Configurator) ─── */
function renderRobotDetail(robot, rootEl) {
  if (!rootEl) return;
  const isFile = window.location.protocol === 'file:';
  const r = isFile ? '../' : '/';
  const allRobotsUrl = isFile ? `${r}robots.html` : '/robots';
  const contactUrl = isFile
    ? `${r}contact.html?robot=${encodeURIComponent(robot.slug)}&name=${encodeURIComponent(robot.name)}`
    : `/contact?robot=${encodeURIComponent(robot.slug)}&name=${encodeURIComponent(robot.name)}`;
  const generalContactUrl = isFile ? `${r}contact.html` : '/contact';

  const basePrice = robot.modes?.buy?.basePrice || 0;
  const buildMode = robot.modes?.build || {
    kitPrice: Math.round(basePrice * 0.7),
    mentorDayRate: 18000,
    perStudentMaterial: 4500,
    minStudents: 20
  };

  // Quick Automotive Highlight Stats Bar
  const quick = robot.quickSpecs || {};
  const statItems = [
    { label: 'Form Factor / Weight', value: quick.form || '38 kg' },
    { label: 'Battery / Runtime', value: quick.battery || '8h Run' },
    { label: 'Kinematics & Control', value: quick.dof || 'ROS 2 Autonomy' },
    { label: 'Starting Commercial Base', value: formatINR(basePrice) }
  ];

  const statBarHtml = statItems.map(item => `
    <div class="stat-item">
      <p class="stat-value" style="font-size:clamp(1.1rem, 1rem + 0.8vw, 1.55rem);font-weight:600">${item.value}</p>
      <p class="stat-label">${item.label}</p>
    </div>
  `).join('');

  // Comprehensive Detailed Specifications Matrix (13 categories)
  const detailedSpecs = robot.detailedSpecs || {};
  const detailedSpecsHtml = Object.entries(detailedSpecs).map(([title, val]) => `
    <div class="detailed-spec-card">
      <p class="detailed-spec-card__label">${title}</p>
      <p class="detailed-spec-card__value">${val}</p>
    </div>
  `).join('');

  // Operations / Capability Packages Checkboxes
  const opsHtml = (robot.operations || []).map((op, idx) => {
    const priceTag = op.priceAdd ? `+${formatINR(op.priceAdd)}` : 'Included';
    return `
      <label class="op-row ${idx === 0 ? 'selected' : ''}" id="op-row-${op.id}">
        <input class="op-row__cb" type="checkbox" id="op-${op.id}" data-op="${op.id}" data-add="${op.priceAdd || 0}" ${idx === 0 ? 'checked' : ''}>
        <div class="op-row__info">
          <p class="op-row__label">${op.label}</p>
          <p class="op-row__desc">${op.description}</p>
        </div>
        <span class="op-row__price">${priceTag}</span>
      </label>
    `;
  }).join('');

  // Standard Inclusions
  const inclusions = robot.standardInclusions || [
    'Pre-deployment facility mapping and radio survey in Delhi NCR / Pan-India',
    'Complete ROS 2 Humble SDK with Python & C++ client APIs',
    '1-Year Comprehensive On-Site Mechatronics Warranty',
    'Staff operator training & cloud dashboard management access'
  ];
  const inclusionsHtml = inclusions.map(inc => `
    <li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:0.9375rem;color:var(--text-mid)">
      <span style="color:var(--success);font-weight:bold">✓</span>
      <span>${inc}</span>
    </li>
  `).join('');

  // Target Industry Applications
  const applications = robot.applications || [
    'Corporate Facilities & Headquarters',
    'Academic & University Research Labs',
    'Institutional Customer Experience Centers'
  ];
  const applicationsHtml = applications.map(app => `
    <span class="badge" style="background:var(--bg-1);border:1px solid var(--line);padding:6px 14px;font-size:0.8125rem">${app}</span>
  `).join('');

  rootEl.innerHTML = `
    <!-- Top Breadcrumbs -->
    <div class="detail-breadcrumb-bar">
      <div class="container">
        <div class="flex items-center justify-between wrap gap-3">
          <div class="flex items-center gap-3">
            <a href="${allRobotsUrl}" class="back-link">← All Robots</a>
            <span class="text-low">/</span>
            <span class="badge">${robot.family.toUpperCase()}</span>
            <span class="text-low">/</span>
            <span class="text-hi font-medium">${robot.name}</span>
          </div>
          <a href="${contactUrl}" class="btn btn--primary btn--sm">
            Order This Robot <span class="btn__arrow">→</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Product Showcase Hero -->
    <section class="section" style="padding-top:var(--s-6);padding-bottom:var(--s-7)">
      <div class="container">
        <div class="detail-hero-showcase">
          
          <!-- Left: High-Tech "Image Coming Soon" Showcase Media -->
          <div class="detail-hero-media">
            <div class="detail-hero-placeholder">
              <div class="hero-placeholder__inner">
                <div class="flex items-center justify-center gap-2 mb-3">
                  <span class="badge badge--dark">${robot.family.toUpperCase()} PLATFORM</span>
                  <span class="badge badge--coming-soon"><span class="pulse-dot"></span> PHOTOGRAPHY COMING SOON</span>
                </div>
                <div class="hero-placeholder__icon">
                  ${getFamilyIconSvg(robot.family, 84)}
                </div>
                <p class="hero-placeholder__model">${robot.modelCode || robot.slug.toUpperCase()} · SERIAL HARDWARE</p>
                <h3 class="hero-placeholder__name">${robot.name}</h3>
                <p class="hero-placeholder__desc">
                  Physical production engineering units are undergoing 48-hour burn-in and calibration at our New Delhi facility.<br>
                  Live on-site demonstrations, facility mapping, and pilot commissioning are available across India.
                </p>
                <div class="hero-placeholder__features">
                  <span class="hero-feat-chip">✓ Working Units in Delhi NCR</span>
                  <span class="hero-feat-chip">✓ Pan-India On-Site Demos</span>
                  <span class="hero-feat-chip">✓ MSME Verified (UDYAM-DL-03-0091615)</span>
                </div>
                <div class="mt-5">
                  <a href="${contactUrl}" class="btn btn--secondary btn--sm">
                    Request In-Person Hardware Demonstration <span class="btn__arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Hero Information & Quick Actions -->
          <div class="detail-hero-info">
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge--dark">${robot.family.toUpperCase()} ROBOT</span>
              <span class="badge" style="font-family:var(--font-mono)">${robot.modelCode || robot.slug.toUpperCase()}</span>
            </div>
            <h1 class="h1 mb-3">${robot.name}</h1>
            <p class="lead text-mid mb-4">${robot.tagline}</p>
            
            <div class="detail-price-headline mb-4">
              <span class="text-low small uppercase font-mono">Turnkey Procurement Starting From</span>
              <p class="h2 text-hi mt-1">${formatINR(basePrice)}</p>
              <p class="small text-low mt-1">Ex-factory New Delhi · Includes base chassis, core BMS, and selected modules. No upfront payment required.</p>
            </div>

            <div class="flex wrap gap-2 mb-5">
              <span class="badge" style="background:var(--bg-1);border:1px solid var(--line);font-size:0.75rem;padding:5px 10px">✓ Industrial-Grade Certified Subsystems</span>
              <span class="badge" style="background:var(--bg-1);border:1px solid var(--line);font-size:0.75rem;padding:5px 10px">✓ 48-Hour Burn-In Tested</span>
              <span class="badge" style="background:var(--bg-1);border:1px solid var(--line);font-size:0.75rem;padding:5px 10px">✓ Govt. MSME Accredited</span>
            </div>

            <div class="flex gap-3 wrap">
              <a href="#configurator-section" class="btn btn--primary">
                Configure &amp; Order <span class="btn__arrow">→</span>
              </a>
              <a href="#specs-section" class="btn btn--secondary">
                View Full Specifications
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Automotive Quick Specs Bar -->
    <section class="stat-bar-section">
      <div class="container">
        <div class="stat-bar">
          ${statBarHtml}
        </div>
      </div>
    </section>

    <!-- Detailed Content & Configurator Section -->
    <section class="section" style="padding-top:var(--s-9);background:var(--bg-0)">
      <div class="container">
        <div class="detail-layout">

          <!-- Left Column: Story, Specs, Dual Modes, Operations -->
          <div class="detail-main-col">
            
            <!-- Overview Description & Environments -->
            <div class="reveal">
              <span class="eyebrow">Enterprise Autonomous Platform</span>
              <h2 class="h2 mt-2 mb-4">Engineered for Real-World Deployment</h2>
              <p class="body text-mid" style="font-size:1.125rem;line-height:1.8;margin-bottom:var(--s-4)">${robot.description}</p>
              <div class="flex wrap gap-2 mt-4 items-center">
                <span class="small font-medium text-hi" style="margin-right:4px">Ideal For:</span>
                ${applicationsHtml}
              </div>
            </div>

            <!-- Full Technical Specifications Matrix -->
            <div class="mt-9 reveal" id="specs-section">
              <div class="mb-5">
                <span class="eyebrow">Hardware Architecture</span>
                <h2 class="h2 mt-2 mb-2">Technical Specifications Matrix</h2>
                <p class="text-mid">Factory-calibrated hardware components and industrial avionics engineered for continuous reliable operation.</p>
              </div>
              <div class="detailed-specs-grid">
                ${detailedSpecsHtml}
              </div>
            </div>

            <!-- Two-Pathway Procurement Configurator -->
            <div class="mt-9 reveal" id="configurator-section">
              <div class="mb-4">
                <span class="eyebrow">Procurement Pathways</span>
                <h2 class="h2 mt-2">How Would You Like to Procure?</h2>
                <p class="text-mid mt-1">Companies typically select turnkey delivery; colleges and universities can invite our mentor team for a hands-on campus build workshop.</p>
              </div>

              <!-- Pathway Tabs -->
              <div class="order-mode-tabs" role="tablist">
                <button class="order-mode-tab active-mode" id="tab-mode-buy" type="button" role="tab" aria-selected="true">
                  Turnkey Commercial (Buy)
                </button>
                <button class="order-mode-tab" id="tab-mode-build" type="button" role="tab" aria-selected="false">
                  Campus Build Kit (Build)
                </button>
              </div>

              <!-- Build Workshop Configuration Box (shown when Build tab is active) -->
              <div id="build-config-box" class="build-config-box" style="display:none">
                <div class="flex items-center justify-between wrap gap-2 mb-3">
                  <div>
                    <h3 class="h3" style="font-size:1.2rem">Academic Campus Build Workshop</h3>
                    <p class="small text-mid mt-1">Our engineering mentors visit your institution with all structural components, motors, and sensors.</p>
                  </div>
                  <span class="badge badge--dark">COLLEGE / UNIVERSITY PROGRAM</span>
                </div>

                <div class="build-slider-row">
                  <div>
                    <label for="build-students" class="font-medium" style="display:block">Participating Students</label>
                    <span class="small text-low">Minimum ${buildMode.minStudents} students required · ₹${Number(buildMode.perStudentMaterial).toLocaleString('en-IN')}/student materials</span>
                  </div>
                  <input type="number" id="build-students" class="build-input-number" min="${buildMode.minStudents}" max="150" value="${buildMode.minStudents}">
                </div>

                <div class="build-slider-row" style="margin-bottom:0">
                  <div>
                    <label for="build-days" class="font-medium" style="display:block">Mentor Days on Campus</label>
                    <span class="small text-low">₹${Number(buildMode.mentorDayRate).toLocaleString('en-IN')}/day engineering guidance</span>
                  </div>
                  <input type="number" id="build-days" class="build-input-number" min="1" max="10" value="2">
                </div>
              </div>

              <!-- Optional Capabilities & Sensory Packages -->
              <div class="mb-4">
                <h3 class="h3" style="font-size:1.25rem">Select Optional Capabilities</h3>
                <p class="text-mid mt-1">Add specialized perception, software intelligence, or integration packages to your configuration.</p>
              </div>
              <div class="op-list-box">
                ${opsHtml}
              </div>
            </div>

            <!-- Standard Package Inclusions -->
            <div class="mt-9 reveal" style="background:var(--bg-1);border:1px solid var(--line);border-radius:var(--r-md);padding:var(--s-6)">
              <h3 class="h3 mb-3">Standard Included Services</h3>
              <p class="text-mid small mb-4">Every robot delivery or workshop package includes our full lifecycle engineering support:</p>
              <ul style="list-style:none;padding:0;margin:0">
                ${inclusionsHtml}
              </ul>
            </div>

            <!-- Commitment-Free Order Request Placement Card -->
            <div class="mt-9 reveal" id="order-section">
              <div class="order-placement-card">
                <div class="order-placement-card__header">
                  <span class="badge badge--dark mb-2">OFFICIAL COMMERCIAL REQUEST</span>
                  <h2 class="h2 text-hi">Order Your ${robot.name}</h2>
                  <p class="text-mid mt-2">Connect directly with our robotics engineering team in New Delhi. No upfront commitment required.</p>
                </div>
                <div class="order-placement-card__body">
                  <div class="order-steps-summary">
                    <div class="order-step-pill">
                      <span class="order-step-num">1</span>
                      <span class="order-step-text">Submit Request</span>
                    </div>
                    <div class="order-step-arrow">→</div>
                    <div class="order-step-pill">
                      <span class="order-step-num">2</span>
                      <span class="order-step-text">On-Site Demonstration</span>
                    </div>
                    <div class="order-step-arrow">→</div>
                    <div class="order-step-pill">
                      <span class="order-step-num">3</span>
                      <span class="order-step-text">Formal Quotation</span>
                    </div>
                  </div>
                  <p class="small text-mid mt-5" style="line-height:1.6">
                    Commercial order requests on this portal are commitment-free expressions of interest. Our systems engineers visit your premises in Delhi NCR or pan-India, survey floor surfaces and network reception, demonstrate physical hardware, and prepare an itemized contract quotation with official institutional warranty.
                  </p>
                  <div class="mt-6">
                    <a href="${contactUrl}" 
                       class="btn btn--primary" id="btn-place-order-now" style="width:100%;justify-content:center;padding:18px 28px;font-size:1.0625rem">
                      Proceed to Place Order Request <span class="btn__arrow">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div><!-- /detail-main-col -->

          <!-- Right Column: Sticky Quote Summary Panel -->
          <aside class="detail-sidebar-col">
            <div class="price-panel">
              <div class="price-panel__head">
                <p class="eyebrow" id="price-panel-title">Estimated Turnkey Quote</p>
                <p class="price-panel__total mt-2" id="price-total">${formatINR(basePrice)}</p>
                <p class="price-panel__note mt-1" id="price-panel-note">Includes base chassis, core BMS, and selected modules.</p>
              </div>
              <div class="price-panel__body" id="price-breakdown">
                <!-- Injected dynamically via updateLivePrice() -->
              </div>
              <div class="price-panel__cta">
                <a href="${contactUrl}" 
                   class="btn btn--primary" style="width:100%;justify-content:center" id="btn-sidebar-order">
                  Order This Robot <span class="btn__arrow">→</span>
                </a>
                <a href="${generalContactUrl}" class="btn btn--secondary btn--sm" style="width:100%;justify-content:center">
                  Speak to Engineer
                </a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  `;

  // Dynamic Live Price Calculator supporting both Turnkey & Build modes
  let currentMode = 'buy';

  function updateLivePrice() {
    const lines = [];
    let total = 0;

    if (currentMode === 'buy') {
      total = basePrice;
      lines.push({ name: `Base Platform (${robot.name})`, price: formatINR(basePrice) });

      // Add checked operations
      const checkedBoxes = Array.from(rootEl.querySelectorAll('.op-row input[type="checkbox"]:checked'));
      checkedBoxes.forEach(cb => {
        const addVal = parseFloat(cb.dataset.add) || 0;
        const op = (robot.operations || []).find(o => o.id === cb.dataset.op);
        total += addVal;
        lines.push({
          name: op ? op.label : 'Additional Module',
          price: addVal > 0 ? `+${formatINR(addVal)}` : 'Included'
        });
      });

      const titleEl = document.getElementById('price-panel-title');
      const noteEl = document.getElementById('price-panel-note');
      if (titleEl) titleEl.textContent = 'Estimated Turnkey Quote';
      if (noteEl) noteEl.textContent = 'Includes base chassis, core BMS, and selected modules.';

    } else {
      // Academic Build Workshop Mode
      const studentsInp = document.getElementById('build-students');
      const daysInp = document.getElementById('build-days');
      const numStudents = Math.max(buildMode.minStudents, parseInt(studentsInp?.value || buildMode.minStudents, 10));
      const numDays = Math.max(1, parseInt(daysInp?.value || 2, 10));

      const kitPrice = buildMode.kitPrice;
      const materialsCost = numStudents * (buildMode.perStudentMaterial || 4500);
      const mentorCost = numDays * (buildMode.mentorDayRate || 18000);

      total = kitPrice + materialsCost + mentorCost;

      lines.push({ name: `Assembly Robot Kit (${robot.name})`, price: formatINR(kitPrice) });
      lines.push({ name: `Student Materials (${numStudents} students)`, price: `+${formatINR(materialsCost)}` });
      lines.push({ name: `On-Campus Mentors (${numDays} days)`, price: `+${formatINR(mentorCost)}` });

      // Add checked operations as optional add-ons to the kit
      const checkedBoxes = Array.from(rootEl.querySelectorAll('.op-row input[type="checkbox"]:checked'));
      checkedBoxes.forEach(cb => {
        const addVal = parseFloat(cb.dataset.add) || 0;
        const op = (robot.operations || []).find(o => o.id === cb.dataset.op);
        total += addVal;
        lines.push({
          name: op ? op.label : 'Module Kit',
          price: addVal > 0 ? `+${formatINR(addVal)}` : 'Included'
        });
      });

      const titleEl = document.getElementById('price-panel-title');
      const noteEl = document.getElementById('price-panel-note');
      if (titleEl) titleEl.textContent = 'Estimated Campus Workshop Quote';
      if (noteEl) noteEl.textContent = `Includes complete hardware kit, ${numStudents} students, and ${numDays} mentor days.`;
    }

    const totalEl = document.getElementById('price-total');
    if (totalEl) totalEl.textContent = formatINR(total);

    const breakdownEl = document.getElementById('price-breakdown');
    if (breakdownEl) {
      breakdownEl.innerHTML = lines.map(line => `
        <div class="price-line">
          <span class="price-line__label">${line.name}</span>
          <span class="price-line__value">${line.price}</span>
        </div>
      `).join('');
    }

    // Update target URLs with mode & total
    const dynamicContactUrl = `${contactUrl}&mode=${encodeURIComponent(currentMode)}&total=${encodeURIComponent(total)}`;
    const placeBtn = document.getElementById('btn-place-order-now');
    const sideBtn = document.getElementById('btn-sidebar-order');
    if (placeBtn) placeBtn.href = dynamicContactUrl;
    if (sideBtn) sideBtn.href = dynamicContactUrl;
  }

  // Wire Mode Switcher Tabs
  const tabBuy = rootEl.querySelector('#tab-mode-buy');
  const tabBuild = rootEl.querySelector('#tab-mode-build');
  const buildBox = rootEl.querySelector('#build-config-box');

  tabBuy?.addEventListener('click', () => {
    currentMode = 'buy';
    tabBuy.classList.add('active-mode');
    tabBuy.setAttribute('aria-selected', 'true');
    tabBuild.classList.remove('active-mode');
    tabBuild.setAttribute('aria-selected', 'false');
    if (buildBox) buildBox.style.display = 'none';
    updateLivePrice();
  });

  tabBuild?.addEventListener('click', () => {
    currentMode = 'build';
    tabBuild.classList.add('active-mode');
    tabBuild.setAttribute('aria-selected', 'true');
    tabBuy.classList.remove('active-mode');
    tabBuy.setAttribute('aria-selected', 'false');
    if (buildBox) buildBox.style.display = 'block';
    updateLivePrice();
  });

  // Wire Student & Day inputs
  const studentsInp = rootEl.querySelector('#build-students');
  const daysInp = rootEl.querySelector('#build-days');
  studentsInp?.addEventListener('input', updateLivePrice);
  daysInp?.addEventListener('input', updateLivePrice);

  // Wire Capabilities Checkboxes
  rootEl.querySelectorAll('.op-row input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.closest('.op-row')?.classList.toggle('selected', cb.checked);
      updateLivePrice();
    });
  });

  // Initial Calculation
  updateLivePrice();
}

/* ─── Auto-Boot for Robot Detail Pages ─── */
function initDetailPage() {
  const slugMeta = document.getElementById('robot-slug-data');
  const rootEl = document.getElementById('robot-detail-root');
  if (!slugMeta || !rootEl) return;

  const slug = slugMeta.dataset.slug;
  const robotList = window.ROBOTS_DATA?.robots || [];
  const robot = robotList.find(r => r.slug === slug);

  if (robot) {
    document.title = `${robot.name} | FUTURE ROBOTIX`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = `${robot.tagline} Customise specifications and order directly from FUTURE ROBOTIX.`;
    renderRobotDetail(robot, rootEl);
  } else {
    const isFile = window.location.protocol === 'file:';
    const allRobotsUrl = isFile ? '../robots.html' : '/robots';
    rootEl.innerHTML = `
      <div class="container" style="padding:120px 0;text-align:center">
        <h1 class="h2">Robot model not found.</h1>
        <p class="text-mid mt-3">The requested robot configuration does not exist or has been updated.</p>
        <a href="${allRobotsUrl}" class="btn btn--primary mt-6">← View All Robots</a>
      </div>
    `;
  }
}

// Attach auto-boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDetailPage);
} else {
  initDetailPage();
}
