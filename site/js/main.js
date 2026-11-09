/**
 * FUTURE ROBOTIX — main.js
 * Nav scroll, mobile menu, scroll reveals, FAQ, form helpers, fill highlighter
 */

/* ---- 1. Nav scroll + hamburger ---- */
document.addEventListener('DOMContentLoaded', () => {
  const nav    = document.querySelector('.nav');
  const burger = document.getElementById('nav-hamburger');
  const links  = document.getElementById('nav-links');

  // Scroll
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  let menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    if (!links || !burger) return;
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    // Animate hamburger → ✕
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  burger?.addEventListener('click', () => setMenu(!menuOpen));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) { setMenu(false); burger?.focus(); } });

  /* ---- 2. Scroll reveals ---- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const siblings = el.parentElement
          ? Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'))
          : [];
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(idx * 90, 450) + 'ms';
        el.classList.add('visible');
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ---- 3. FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---- 4. Fill highlighter ---- */
  function highlightFills(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.includes('[FILL')) return;
      const wrap = document.createElement('span');
      wrap.innerHTML = node.textContent.replace(
        /\[FILL:[^\]]*\]/g,
        m => `<span class="fill-missing" title="Missing — see QUESTIONS.md">${m}</span>`
      );
      node.parentNode.replaceChild(wrap, node);
    } else if (node.nodeType === Node.ELEMENT_NODE &&
               !['SCRIPT','STYLE','NOSCRIPT','TEMPLATE'].includes(node.tagName)) {
      Array.from(node.childNodes).forEach(highlightFills);
    }
  }
  highlightFills(document.body);
});

/* ---- 5. Form validation ---- */
function validateField(inp) {
  const err = document.getElementById(inp.id + '-error') || document.getElementById(inp.id + '-err');
  const v   = inp.value.trim();
  let msg   = '';

  if (inp.required && !v)
    msg = inp.dataset.errorRequired || inp.dataset.errRequired || 'This field is required.';
  else if (inp.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    msg = 'Please enter a valid email address.';
  else if (inp.type === 'tel' && v && !/^[+\d\s\-().]{7,15}$/.test(v))
    msg = 'Please enter a valid phone number.';

  if (err) { err.textContent = msg; err.classList.toggle('visible', !!msg); }
  inp.classList.toggle('error', !!msg);
  return !msg;
}

function initForm(form, onValid) {
  if (!form) return;
  const inputs = form.querySelectorAll('input:not([type=hidden]), textarea, select');
  inputs.forEach(i => i.addEventListener('blur', () => validateField(i)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    inputs.forEach(i => { if (!validateField(i)) ok = false; });
    // Checkbox check
    const cb = form.querySelector('input[type="checkbox"][required]');
    if (cb && !cb.checked) {
      const cbErr = document.getElementById(cb.id + '-error') || document.getElementById(cb.id + '-err');
      if (cbErr) { cbErr.textContent = 'Please tick the box to continue.'; cbErr.classList.add('visible'); }
      ok = false;
    }
    if (ok) onValid(form);
  });
}

/* ---- 6. Helpers ---- */
function formatINR(n) {
  if (n === null || n === undefined || isNaN(n)) return null;
  return '₹' + Number(n).toLocaleString('en-IN');
}
function priceLabel(n) { return formatINR(n) || 'Price on request'; }
function genRef()      { return 'FR-' + Date.now().toString(36).toUpperCase().slice(-6); }
function getRobot(slug) {
  return (window.ROBOTS_DATA?.robots || []).find(r => r.slug === slug) || null;
}

window.FR = { validateField, initForm, formatINR, priceLabel, genRef, getRobot };
