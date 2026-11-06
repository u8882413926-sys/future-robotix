/**
 * FUTURE ROBOTIX — robots-render.js
 * ─────────────────────────────────────────
 * Tesla & Ola inspired robot card showcase and detail configurator.
 * Fully autonomous data binding from window.ROBOTS_DATA (zero network fetch, zero hanging).
 */

/* ─── Currency Formatter ─── */
function formatINR(n) {
  if (n === null || n === undefined || isNaN(n)) return 'Price on request';
  return '₹' + Number(n).toLocaleString('en-IN');
}

/* ─── Grid Robot Card (Tesla / Ola Box Style) ─── */
function renderRobotCard(robot, idx = 0, root = '') {
  const delay = Math.min(idx * 50, 400);
  const imgName = robot.images?.[0] || `${robot.slug}.svg`;
  const imgPath = `${root}images/robots/${imgName}`;
  const basePriceText = robot.modes?.buy?.basePrice ? `From ${formatINR(robot.modes.buy.basePrice)}` : 'Custom Quote';

  // Parse quick spec highlights from specs
  const specPills = (robot.specs || []).map(s => {
    // Extract short snippet before colon or bullet
    const parts = s.split('·');
    return parts[0] ? parts[0].trim() : s;
  }).slice(0, 3);

  const pillsHtml = specPills.map(p => `<span class="robot-pill">${p}</span>`).join('');

  return `
    <article class="robot-box reveal" style="transition-delay:${delay}ms" data-family="${robot.family}" data-slug="${robot.slug}">
      <!-- Top badges -->
      <div class="robot-box__header">
        <span class="badge badge--dark">${robot.family.toUpperCase()}</span>
        <span class="robot-box__price-tag">${basePriceText}</span>
      </div>

      <!-- Centered Product Image Container -->
      <div class="robot-box__media">
        <img src="${imgPath}" alt="${robot.name} by FUTURE ROBOTIX" loading="lazy" width="800" height="600"
             onerror="this.onerror=null; this.src='${root}images/robots/${robot.slug}.svg';" />
      </div>

      <!-- Info Area -->
      <div class="robot-box__body">
        <h3 class="robot-box__title">${robot.name}</h3>
        <p class="robot-box__tagline">${robot.tagline}</p>
        <div class="robot-box__pills">${pillsHtml}</div>
      </div>

      <!-- Hover Action Overlay / Buttons -->
      <div class="robot-box__overlay">
        <div class="robot-box__overlay-content">
          <p class="robot-box__overlay-text">${robot.tagline}</p>
          <div class="robot-box__actions">
            <a href="${root}robots/${robot.slug}.html" class="btn btn--primary btn--sm" id="btn-know-more-${robot.slug}">
              Know More <span class="btn__arrow">→</span>
            </a>
            <a href="${root}contact.html?robot=${encodeURIComponent(robot.slug)}&name=${encodeURIComponent(robot.name)}" 
               class="btn btn--secondary btn--sm" id="btn-order-${robot.slug}">
              Order Robot
            </a>
          </div>
        </div>
      </div>

      <!-- Entire card clickable directly to detail page -->
      <a href="${root}robots/${robot.slug}.html" class="robot-box__hitbox" aria-label="Explore ${robot.name}"></a>
    </article>`;
}

/* ─── Detail Page Renderer (Cinematic Vehicle-Showcase Style) ─── */
function renderRobotDetail(robot, rootEl) {
  if (!rootEl) return;
  const r = '../'; // Inside /robots/ directory

  const imgName = robot.images?.[0] || `${robot.slug}.svg`;
  const imgPath = `${r}images/robots/${imgName}`;
  const basePrice = robot.modes?.buy?.basePrice;

  // Key Spec Highlights for Automotive Bar
  let specBarItems = [];
  if (robot.specs && robot.specs.length >= 3) {
    specBarItems = [
      { label: 'Form Factor', value: robot.specs[0].split('·')[0].replace('Dimensions:', '').trim() },
      { label: 'Battery / Power', value: robot.specs[1].split('·')[0].replace('Battery:', '').replace('Power:', '').trim() },
      { label: 'Perception / Kinematics', value: robot.specs[2].split('·')[0].replace('Kinematics:', '').replace('Sensors:', '').replace('Mobility:', '').trim() },
      { label: 'Starting Price', value: formatINR(basePrice) }
    ];
  } else {
    specBarItems = [
      { label: 'Family', value: robot.family.toUpperCase() },
      { label: 'Classification', value: 'Commercial Grade' },
      { label: 'Starting Base', value: formatINR(basePrice) },
      { label: 'Availability', value: 'Ready to Configure' }
    ];
  }

  const specBarHtml = specBarItems.map(item => `
    <div class="stat-item">
      <p class="stat-value" style="font-size:clamp(1.1rem, 1rem + 0.8vw, 1.6rem);font-weight:600">${item.value}</p>
      <p class="stat-label">${item.label}</p>
    </div>
  `).join('');

  // Detailed Specifications Cells
  const specsGridHtml = (robot.specs || []).map(spec => {
    const parts = spec.split('·');
    const title = parts[0]?.includes(':') ? parts[0].split(':')[0].trim() : 'Configuration Spec';
    const detail = parts[0]?.includes(':') ? parts[0].split(':')[1].trim() : parts[0];
    const subdetail = parts.slice(1).join(' · ').trim();

    return `
      <div class="spec-cell">
        <p class="spec-cell__label">${title}</p>
        <p class="spec-cell__value">${detail}</p>
        ${subdetail ? `<p class="small text-low mt-1">${subdetail}</p>` : ''}
      </div>
    `;
  }).join('');

  // Operations / Capabilities List
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

  rootEl.innerHTML = `
    <!-- Top Breadcrumbs -->
    <div class="detail-breadcrumb-bar">
      <div class="container">
        <div class="flex items-center justify-between wrap gap-3">
          <div class="flex items-center gap-3">
            <a href="${r}robots.html" class="back-link">← All Robots</a>
            <span class="text-low">/</span>
            <span class="badge">${robot.family.toUpperCase()}</span>
            <span class="text-low">/</span>
            <span class="text-hi font-medium">${robot.name}</span>
          </div>
          <a href="${r}contact.html?robot=${encodeURIComponent(robot.slug)}&name=${encodeURIComponent(robot.name)}" class="btn btn--primary btn--sm">
            Order This Robot <span class="btn__arrow">→</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Product Showcase Hero -->
    <section class="section" style="padding-top:var(--s-6);padding-bottom:var(--s-7)">
      <div class="container">
        <div class="detail-hero-showcase">
          <!-- Left: Big Product Visual -->
          <div class="detail-hero-media">
            <img src="${imgPath}" alt="${robot.name}" class="detail-hero-img"
                 onerror="this.onerror=null; this.src='${r}images/robots/${robot.slug}.svg';" />
          </div>

          <!-- Right: Hero Information & Quick Actions -->
          <div class="detail-hero-info">
            <span class="badge badge--dark mb-3">${robot.family.toUpperCase()} ROBOT</span>
            <h1 class="h1 mb-3">${robot.name}</h1>
            <p class="lead text-mid mb-5">${robot.tagline}</p>
            <div class="detail-price-headline">
              <span class="text-low small uppercase">Starting from</span>
              <p class="h2 text-hi mt-1">${formatINR(basePrice)}</p>
              <p class="small text-low mt-1">Ex-factory New Delhi · Itemized quotation confirmed after on-site review.</p>
            </div>
            <div class="flex gap-3 wrap mt-6">
              <a href="#order-section" class="btn btn--primary">
                Order Configuration <span class="btn__arrow">→</span>
              </a>
              <a href="#specs-section" class="btn btn--secondary">
                View Specifications
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
          ${specBarHtml}
        </div>
      </div>
    </section>

    <!-- Detailed Content & Configurator Section -->
    <section class="section" style="padding-top:var(--s-9);background:var(--bg-0)">
      <div class="container">
        <div class="detail-layout">

          <!-- Left Column: Story, Specs, Operations -->
          <div class="detail-main-col">
            
            <!-- Overview Description -->
            <div class="reveal">
              <h2 class="h2 mb-4">Engineered for Real-World Deployment</h2>
              <p class="body text-mid" style="font-size:1.125rem;line-height:1.8">${robot.description}</p>
            </div>

            <!-- Hardware Specifications Matrix -->
            <div class="mt-9 reveal" id="specs-section">
              <h2 class="h2 mb-4">Technical Specifications</h2>
              <p class="text-mid mb-5">Factory calibrated hardware and industrial avionics for dependable operation.</p>
              <div class="spec-grid">
                ${specsGridHtml}
              </div>
            </div>

            <!-- Operations & Capability Configurator -->
            <div class="mt-9 reveal" id="configurator-section">
              <div class="flex items-center justify-between wrap gap-3 mb-4">
                <div>
                  <h2 class="h2">Select Optional Capabilities</h2>
                  <p class="text-mid mt-1">Tailor sensory packages, operational software, and cloud modules for your facility.</p>
                </div>
              </div>
              <div class="op-list-box">
                ${opsHtml}
              </div>
            </div>

            <!-- Order Confirmation & Placement Box (Required by User) -->
            <div class="mt-9 reveal" id="order-section">
              <div class="order-placement-card">
                <div class="order-placement-card__header">
                  <span class="badge badge--dark mb-2">OFFICIAL ORDER REQUEST</span>
                  <h2 class="h2 text-hi">Order Your ${robot.name}</h2>
                  <p class="text-mid mt-2">Connect directly with our robotics engineering team in New Delhi. No upfront payment required.</p>
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
                  <p class="small text-low mt-5">
                    Order requests are obligation-free. Our technical mentor visits your premises to verify navigation paths, calibrate sensors, and confirm timeline.
                  </p>
                  <div class="mt-6">
                    <a href="${r}contact.html?robot=${encodeURIComponent(robot.slug)}&name=${encodeURIComponent(robot.name)}" 
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
                <p class="eyebrow">Estimated Configuration Quote</p>
                <p class="price-panel__total mt-2" id="price-total">${formatINR(basePrice)}</p>
                <p class="price-panel__note mt-1">Includes base chassis, core BMS, and selected modules.</p>
              </div>
              <div class="price-panel__body" id="price-breakdown">
                <!-- Injected dynamically via updatePrice() -->
              </div>
              <div class="price-panel__cta">
                <a href="${r}contact.html?robot=${encodeURIComponent(robot.slug)}&name=${encodeURIComponent(robot.name)}" 
                   class="btn btn--primary" style="width:100%;justify-content:center" id="btn-sidebar-order">
                  Order This Robot <span class="btn__arrow">→</span>
                </a>
                <a href="${r}contact.html" class="btn btn--secondary btn--sm" style="width:100%;justify-content:center">
                  Speak to Engineer
                </a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  `;

  // Dynamic Price Calculator
  function updateLivePrice() {
    const checkedBoxes = Array.from(rootEl.querySelectorAll('.op-row input[type="checkbox"]:checked'));
    let total = basePrice || 0;
    const lines = [];

    if (basePrice) {
      lines.push({ name: 'Base Platform (' + robot.name + ')', price: formatINR(basePrice) });
    }

    checkedBoxes.forEach(cb => {
      const addVal = parseFloat(cb.dataset.add) || 0;
      const op = (robot.operations || []).find(o => o.id === cb.dataset.op);
      total += addVal;
      lines.push({
        name: op ? op.label : 'Additional Module',
        price: addVal > 0 ? `+${formatINR(addVal)}` : 'Included'
      });
    });

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
  }

  // Bind change listeners to checkboxes
  rootEl.querySelectorAll('.op-row input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.closest('.op-row')?.classList.toggle('selected', cb.checked);
      updateLivePrice();
    });
  });

  // Initial calculation
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
    rootEl.innerHTML = `
      <div class="container" style="padding:120px 0;text-align:center">
        <h1 class="h2">Robot model not found.</h1>
        <p class="text-mid mt-3">The requested robot configuration does not exist or has been updated.</p>
        <a href="../robots.html" class="btn btn--primary mt-6">← View All Robots</a>
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
