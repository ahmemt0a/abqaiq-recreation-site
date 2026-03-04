/* ==========================================================================
   Abqaiq Recreation — main.js (Full Rebuild)
   - Mobile nav toggle
   - Generic chip UX helpers
   - Small utilities (delegate, qs, qsa)
   ========================================================================== */
(function () {
  "use strict";

  // --- helpers -------------------------------------------------------------
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on  = (el, evt, fn, opt) => el && el.addEventListener(evt, fn, opt);

  // --- Mobile Navigation ---------------------------------------------------
  const navToggle = qs('#navToggle');
  const navMenu   = qs('.nav-menu');

  if (navToggle && navMenu) {
    on(navToggle, 'click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on ESC
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });

    // Close when clicking outside (mobile)
    on(document, 'click', (e) => {
      if (!navMenu.classList.contains('open')) return;
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Chips: visual/aria state only (filtering handled by area.js) -------
  const chipGroups = qsa('.filters');
  chipGroups.forEach(group => {
    const chips = qsa('.chip', group);
    chips.forEach(chip => {
      on(chip, 'click', () => {
        // Visual active
        chips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        // Announce selection (area.js listens optionally)
        const ev = new CustomEvent('chip:change', { detail: { value: chip.dataset.filter || 'all' } });
        group.dispatchEvent(ev);
      });
    });
  });

  // --- Small convenience: smooth anchor scroll (if needed) -----------------
  qsa('a[href^="#"]').forEach(a => {
    on(a, 'click', (e) => {
      const id = a.getAttribute('href');
      const tgt = id && id !== '#' ? qs(id) : null;
      if (!tgt) return;
      e.preventDefault();
      tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();