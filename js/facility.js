/* ==========================================================================
   Abqaiq Recreation — facility.js (Full Rebuild)
   Renders a single facility page from /data/facilities.json.

   Breadcrumb model (Option A — compact):
     - oasis        -> Abqaiq Main Camp → Oasis Complex
     - al-saadah    -> Abqaiq Main Camp → Al Sa’adah Complex
     - biodiversity -> Abqaiq Main Camp → Biodiversity Parks
     - others       -> Abqaiq Main Camp → Other Facilities
     - al-farhah    -> Al Farhah Bachelor Camp (no primary)
     - beaches      -> Beaches (no primary)

   HTML expected IDs (rendered if present):
     #facilityName, #facilityCategory, #facilityStatus,
     #facilityOpType, #facilityOpPeriod, #facilityDays,
     #facilityOpen, #facilityClose, #friOpen, #friClose, #satOpen, #satClose,
     #facilityPurpose, #facilityPurposeCategory, #facilityLongDesc,
     #facilityAddress, #facilityLat, #facilityLng,
     #facilityGallery, #facilityAmenities,
     #facilityPhone, #facilityEmail, #facilityBooking,
     #bcPrimary, #bcSecondary, #bcFacility, #backToArea
     <img id="facilityHero" ...>
     <div id="mapEmbed"></div>
   ========================================================================== */
(function () {
  "use strict";

  const qs  = (sel, ctx = document) => ctx.querySelector(sel);

  function setTxt(id, v) { const n = qs(`#${id}`); if (n) n.textContent = v || '—'; }
  function setHref(id, href, text) { const n = qs(`#${id}`); if (n && href) { n.href = href; if (text) n.textContent = text; } }

  // Area → labels & back link (Option A)
  const AREA_META = {
    'oasis':        { primary: 'Abqaiq Main Camp', secondary: 'Oasis Complex',         back: '/areas/oasis.html' },
    'al-saadah':    { primary: 'Abqaiq Main Camp', secondary: 'Al Sa’adah Complex',     back: '/areas/al-saadah.html' },
    'biodiversity': { primary: 'Abqaiq Main Camp', secondary: 'Biodiversity Parks',     back: '/areas/biodiversity.html' },
    'others':       { primary: 'Abqaiq Main Camp', secondary: 'Other Facilities',       back: '/areas/others.html' },
    'al-farhah':    { primary: null,                secondary: 'Al Farhah Bachelor Camp', back: '/areas/al-farhah.html' },
    'beaches':      { primary: null,                secondary: 'Beaches',               back: '/areas/beaches.html' },
    'main-camp':    { primary: 'Abqaiq Main Camp', secondary: '',                      back: '/areas/main-camp.html' } // fallback
  };

  // Query id
  const url  = new URL(window.location.href);
  const id   = url.searchParams.get('id');
  if (!id) return;

  (async function load() {
    try {
      const res = await fetch('/data/facilities.json', { cache: 'no-store' });
      const data = await res.json();

      const f = data.find(x => String(x.id) === String(id));
      if (!f) {
        console.warn('[Facility] Not found:', id);
        setTxt('facilityName', 'Facility not found');
        return;
      }

      // Title & header
      setTxt('facilityName', f.name);
      setTxt('facilityCategory', f.category);

      // Quick facts
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

      // Description
      setTxt('facilityPurpose', f.purpose);
      setTxt('facilityPurposeCategory', f.purpose_category);
      setTxt('facilityLongDesc', f.description);

      // Location
      setTxt('facilityAddress', f.address);
      setTxt('facilityLat', f.lat);
      setTxt('facilityLng', f.lng);

      // Hero & gallery
      const hero = qs('#facilityHero');
      if (hero && f.photos && f.photos.length) {
        hero.src = f.photos[0];
        hero.alt = f.name || 'Facility photo';
      }
      const gallery = qs('#facilityGallery');
      if (gallery && f.photos && f.photos.length) {
        gallery.innerHTML = f.photos.map(src => `<img src="${src}" alt="${f.name} — photo" loading="lazy" />`).join('');
      }

      // Amenities
      const am = qs('#facilityAmenities');
      if (am && Array.isArray(f.amenities)) {
        am.innerHTML = f.amenities.map(a => `<li>${a}</li>`).join('');
      }

      // Contact
      if (f.phone)   setHref('facilityPhone',  `tel:${f.phone}`,   f.phone);
      if (f.email)   setHref('facilityEmail',  `mailto:${f.email}`, f.email);
      if (f.booking) setHref('facilityBooking', f.booking,         'Book now');

      // Map
      const map = qs('#mapEmbed');
      if (map && f.lat && f.lng) {
        const q = encodeURIComponent(`${f.lat},${f.lng}`);
        map.innerHTML = `<iframe title="Map" width="100%" height="300" style="border:0" loading="= AREA_META[(f.area || '').toLowerCase()] || { primary: null, secondary: '', back: '/areas.html' };
      const bcPrimary   = qs('#bcPrimary');
      const bcSecondary = qs('#bcSecondary');
      const bcFacility  = qs('#bcFacility');

      if (meta.primary && bcPrimary) {
        bcPrimary.innerHTML = `/areas.html${meta.primary}</a>`;
      } else if (bcPrimary) {
        bcPrimary.textContent = ''; // no primary shown (hide first separator via CSS if needed)
        const firstSep = document.querySelector('.breadcrumb .sep');
        if (firstSep) firstSep.style.display = 'none';
      }

      if (bcSecondary) {
        const label = meta.secondary || 'Area';
        bcSecondary.innerHTML = `${meta.back}${label}</a>`;
      }
      if (bcFacility) bcFacility.textContent = f.name || 'Facility';

      // Back to area
      setHref('backToArea', meta.back);

    } catch (e) {
      console.error('[Facility] Failed to load facilities.json', e);
      setTxt('facilityName', 'Error loading facility');
    }
  })();
})();