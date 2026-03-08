(function () {
  "use strict";

  const grid = document.getElementById('facilityGrid');
  if (!grid) return;

  const areaSlug = (grid.getAttribute('data-area') || '').toLowerCase();
  const filtersEl = document.querySelector('.filters');
  let ALL_FACILITIES = [];

  // Function to build the HTML for each card
  function render(list) {
    if (!list || !list.length) {
      grid.innerHTML = '<p style="padding:20px; text-align:center;">No facilities found for this section.</p>';
      return;
    }

    grid.innerHTML = list.map(item => {
      const url = `/facility.html?id=${encodeURIComponent(item.id)}`;
      const img = item.photo || '/images/placeholders/card.jpg';
      const cat = item.category || 'General';
      const status = item.status || 'Available';
      const name = item.name || 'Facility';

      return `
        <article class="card">
          <a href="${url}" aria-label="${name}">
            <img src="${img}" alt="${name}" loading="lazy" />
          </a>
          <div class="card-body">
            <span class="category-tag">${cat}</span>
            <h3><a href="${url}">${name}</a></h3>
            <div class="meta"><span>${status}</span></div>
          </div>
        </article>`;
    }).join('');
  }

  // Load the JSON data
  async function loadData() {
    try {
      // Use './' to ensure it looks in the correct local directory
      const res = await fetch('./data/facilities.json');
      
      if (!res.ok) throw new Error('Could not find facilities.json');
      
      const data = await res.json();

      // Filter data to only show facilities for the current page (area)
      ALL_FACILITIES = data.filter(item => 
        (item.area || '').toLowerCase() === areaSlug
      );

      render(ALL_FACILITIES);

      // Listen for filter chip clicks from main.js
      if (filtersEl) {
        filtersEl.addEventListener('chip:change', (ev) => {
          const val = ev.detail.value.toLowerCase();
          if (val === 'all') {
            render(ALL_FACILITIES);
          } else {
            const filtered = ALL_FACILITIES.filter(i => 
              (i.category || '').toLowerCase() === val
            );
            render(filtered);
          }
        });
      }
    } catch (e) {
      console.error('[Area Error]', e);
      grid.innerHTML = `<div style="background:#fff3cd; padding:20px; border-radius:8px;">
        <strong>Error:</strong> Could not load facilities data. <br>
        <small>Tip: Make sure you are using "Live Server" in VS Code.</small>
      </div>`;
    }
  }

  loadData();
})();
