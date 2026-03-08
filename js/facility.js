(function () {
  "use strict";

  const qs = (sel, ctx = document) => ctx.querySelector(sel);

  function setTxt(id, v) { 
    const n = qs(`#${id}`); 
    if (n) n.textContent = v || '—'; 
  }
  
  function setHref(id, href, text) { 
    const n = qs(`#${id}`); 
    if (n && href) { 
        n.href = href; 
        if (text) n.textContent = text; 
    } 
  }

  // Area → labels & back link (Removed leading slashes for GitHub compatibility)
  const AREA_META = {
    'oasis':        { primary: 'Abqaiq Main Camp', secondary: 'Oasis Complex',          back: 'areas/oasis.html' },
    'al-saadah':    { primary: 'Abqaiq Main Camp', secondary: 'Al Sa’adah Complex',      back: 'areas/al-saadah.html' },
    'biodiversity': { primary: 'Abqaiq Main Camp', secondary: 'Biodiversity Parks',      back: 'areas/biodiversity.html' },
    'others':       { primary: 'Abqaiq Main Camp', secondary: 'Other Facilities',       back: 'areas/others.html' },
    'al-farhah':    { primary: null,                secondary: 'Al Farhah Bachelor Camp', back: 'areas/al-farhah.html' },
    'beaches':      { primary: null,                secondary: 'Beaches',                back: 'areas/beaches.html' },
    'main-camp':    { primary: 'Abqaiq Main Camp', secondary: '',                        back: 'areas/main-camp.html' }
  };

  // 1. Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return;

  // 2. Load and Render Data
  (async function load() {
    try {
      // Use relative path for GitHub Pages
      const res = await fetch('data/facilities.json', { cache: 'no-store' });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      const f = data.find(x => String(x.id) === String(id));

      if (!f) {
        console.warn('[Facility] Not found:', id);
        setTxt('facilityName', 'Facility not found');
        return;
      }

      // --- Rendering Logic ---
      setTxt('facilityName', f.name);
      setTxt('facilityCategory', f.category);
      setTxt('facilityStatus', f.status);
      setTxt('facilityOpType', f.operation_type);
      setTxt('facilityOpPeriod', f.operation_period);
      setTxt('facilityDays', f.operating_days);
      setTxt('facilityOpen', f.weekdays_open_time || f.open_time);
      setTxt('facilityClose', f.weekdays_close_time || f.close_time);
      setTxt('friOpen', f.fri_open_time);
      setTxt('friClose', f.fri_close_time);
      setTxt('satOpen', f.sat_open_time);
      setTxt('satClose', f.sat_close_time);
      setTxt('facilityPurpose', f.purpose);
      setTxt('facilityPurposeCategory', f.purpose_category);
      setTxt('facilityLongDesc', f.description);
      setTxt('facilityAddress', f.address);
      setTxt('facilityLat', f.lat);
      setTxt('facilityLng', f.lng);

      // Hero & gallery
      const hero = qs('#facilityHero');
      if (hero && f.photos && f.photos.length) {
        hero.src = f.photos[0];
        hero.alt = f.name;
      }
      const gallery = qs('#facilityGallery');
      if (gallery && f.photos) {
        gallery.innerHTML = f.photos.map(src => `<img src="${src}" alt="${f.name}" loading="lazy" />`).join('');
      }

      // Amenities
      const am = qs('#facilityAmenities');
      if (am && Array.isArray(f.amenities)) {
        am.innerHTML = f.amenities.map(a => `<li>${a}</li>`).join('');
      }

      // Map (Fixed the iframe syntax)
      const map = qs('#mapEmbed');
      if (map && f.lat && f.lng) {
        const q = encodeURIComponent(`${f.lat},${f.lng}`);
        map.innerHTML = `<iframe title="Map" width="100%" height="300" style="border:0" loading="lazy" src="https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>`;
      }

      // Breadcrumbs (Fixed the logic error here)
      const meta = AREA_META[(f.area || '').toLowerCase()] || { primary: null, secondary: 'Facilities', back: 'areas.html' };
      const bcPrimary   = qs('#bcPrimary');
      const bcSecondary = qs('#bcSecondary');
      const bcFacility  = qs('#bcFacility');

      if (meta.primary && bcPrimary) {
        bcPrimary.innerHTML = `<a href="areas.html">${meta.primary}</a>`;
      } else if (bcPrimary) {
        bcPrimary.textContent = '';
      }

      if (bcSecondary) {
        bcSecondary.innerHTML = `<a href="${meta.back}">${meta.secondary}</a>`;
      }
      if (bcFacility) bcFacility.textContent = f.name;

      // Back to area button
      setHref('backToArea', meta.back);

    } catch (e) {
      console.error('[Facility] Error:', e);
      setTxt('facilityName', 'Error loading facility data');
    }
  })();
})();
