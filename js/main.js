(function () {
  "use strict";

  // --- Helpers ---
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on  = (el, evt, fn, opt) => el && el.addEventListener(evt, fn, opt);

// --- 1. Load Components (Header/Footer) ---
async function initSite() {
  try {
    // FIXED: Removed the "/" before "components"
    const headerRes = await fetch('components/header-content.html'); 
    if (headerRes.ok) {
      const headerPlaceholder = qs('#header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = await headerRes.text();
        setupMobileNav(); 
      }
    }

    // FIXED: Removed the "/" before "components"
    const footerRes = await fetch('components/footer-content.html');
    if (footerRes.ok) {
      const footerPlaceholder = qs('#footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = await footerRes.text();
      }
    }
  } catch (err) {
    console.error("Component loading failed.", err);
  }
}

  // --- 2. Mobile Navigation Logic ---
  function setupMobileNav() {
    const navToggle = qs('#navToggle');
    const navMenu   = qs('.nav-menu');

    if (navToggle && navMenu) {
      on(navToggle, 'click', (e) => {
        e.stopPropagation();
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
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // --- 3. Chips (Visual/Aria state) ---
  function setupChips() {
    const chipGroups = qsa('.filters');
    chipGroups.forEach(group => {
      const chips = qsa('.chip', group);
      chips.forEach(chip => {
        on(chip, 'click', () => {
          chips.forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-pressed', 'false');
          });
          chip.classList.add('active');
          chip.setAttribute('aria-pressed', 'true');
          
          // Send event to area.js
          const ev = new CustomEvent('chip:change', { 
            detail: { value: chip.dataset.filter || 'all' } 
          });
          group.dispatchEvent(ev);
        });
      });
    });
  }

  // --- 4. Smooth Anchor Scroll ---
  function setupSmoothScroll() {
    qsa('a[href^="#"]').forEach(a => {
      on(a, 'click', (e) => {
        const id = a.getAttribute('href');
        const tgt = id && id !== '#' ? qs(id) : null;
        if (!tgt) return;
        e.preventDefault();
        tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // Start Everything
  initSite();
  setupChips();
  setupSmoothScroll();

})();
