// /js/area.js  (replace the load() function with this resilient version)
(async function load() {
  try {
    let res = await fetch('/data/facilities.json', { cache: 'no-store' });
    if (!res.ok) {
      console.warn('[Area] /data/facilities.json status=', res.status, res.statusText, '→ trying relative path');
      res = await fetch('./data/facilities.json', { cache: 'no-store' });
    }
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('[Area] JSON parse failed. Response text was:\n', text.slice(0, 500), '...');
      throw e;
    }

    ALL = data.filter(d => (d.area || '').toLowerCase() === areaSlug);
    render(ALL);

    if (filtersEl) {
      filtersEl.addEventListener('chip:change', (ev) => {
        const val = (ev.detail && ev.detail.value) || 'all';
        if (val.toLowerCase() === 'all') return render(ALL);
        const filtered = ALL.filter(i => (i.category || '').toLowerCase() === val.toLowerCase());
        render(filtered);
      });
    }
  } catch (e) {
    console.error('[Area] Failed to load or parse facilities.json:', e);
    grid.innerHTML = '<p style="padding:12px">Could not load facilities data.</p>';
  }
})();
/* ==========================================================================
   Abqaiq Recreation — area.js (Full Rebuild)
   Renders facility cards on area pages from /data/facilities.json.
   Expects:
     <section id="facilityGrid" class="facility-grid" data-area="<slug>"></section>
   Filter chips (optional):
     <button class="chip" data-filter="Sports">Sports</button> ...
   ========================================================================== */
(function () {
  "use strict";

  const grid = document.getElementById('facilityGrid');
  if (!grid) return;

  const areaSlug = (grid.getAttribute('data-area') || '').toLowerCase();
  const filtersEl = document.querySelector('.filters');
  let ALL = [];

  // Render list -> cards
  function render(list) {
    if (!list || !list.length) {
      grid.innerHTML = '<p style="padding:12px">No facilities found for this section.</p>';
      return;
    }
    grid.innerHTML = list.map(item => {
      const url = `/facility.html?id=${encodeURIComponent(item.id)}`;
      const img = item.photo || '/images/placeholders/card.jpg';
      const cat = item.category || '';
      const st  = item.status || '';
      const name = item.name || 'Facility';
      return `
        <article class="card">
          <a href="${url}" aria-label="${name}">
            <img src="${img}" alt="${name}" loading="lazy" />
          </a>
          <div class="card-body">
            <h3><a href="${url}">${name}</a></h3>
            <div class="meta"><span>${cat}</span><span>${st}</span></div>
          </div>
        </article>`;
    }).join('');
  }

  // Initial load
  (async function load() {
    try {
      const res = await fetch('/data/facilities.json', { cache: 'no-store' });
      const data = await res.json();

      // Keep only this area's facilities
      ALL = data.filter(d => (d.area || '').toLowerCase() === areaSlug);

      // Initial render
      render(ALL);

      // Wire chips (by category)
      if (filtersEl) {
        filtersEl.addEventListener('chip:change', (ev) => {
          const val = (ev.detail && ev.detail.value) || 'all';
          if (val.toLowerCase() === 'all') return render(ALL);
          const filtered = ALL.filter(i => (i.category || '').toLowerCase() === val.toLowerCase());
          render(filtered);
        });
      }
    } catch (e) {
      console.error('[Area] Failed to load facilities.json', e);
      grid.innerHTML = '<p style="padding:12px">Could not load facilities data.</p>';
    }
  })();
})();
