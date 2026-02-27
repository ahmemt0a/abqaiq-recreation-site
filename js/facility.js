
(function(){
  function qs(name){
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }
  async function run(){
    const id = qs('id');
    if(!id) return;
    let data=[];
    try{
      const res = await fetch('/data/facilities.json', { cache: 'no-store' });
      data = await res.json();
    }catch(e){ console.error('[Facility] Failed to load data', e); return; }

    const f = data.find(x=>String(x.id)===String(id));
    if(!f){ console.warn('[Facility] Not found id=', id); return; }

    // Title & header
    document.getElementById('facilityName').textContent = f.name || 'Facility';
    document.getElementById('facilityCategory').textContent = f.category || '';

    // Quick facts
    const set = (el, val) => { const n=document.getElementById(el); if(n) n.textContent = val || '—'; };
    set('facilityStatus', f.status);
    set('facilityOpType', f.operation_type);
    set('facilityOpPeriod', f.operation_period);
    set('facilityDays', f.operating_days);
    set('facilityOpen', f.weekdays_open_time || f.open_time);
    set('facilityClose', f.weekdays_close_time || f.close_time);
    set('friOpen', f.fri_open_time);
    set('friClose', f.fri_close_time);
    set('satOpen', f.sat_open_time);
    set('satClose', f.sat_close_time);

    // Description
    set('facilityPurpose', f.purpose);
    set('facilityPurposeCategory', f.purpose_category);
    set('facilityLongDesc', f.description);

    // Location
    set('facilityAddress', f.address);
    set('facilityLat', f.lat);
    set('facilityLng', f.lng);

    // Hero & gallery
    const hero = document.getElementById('facilityHero');
    if(f.photos && f.photos.length){ hero.src = f.photos[0]; hero.alt = f.name; }
    const gallery = document.getElementById('facilityGallery');
    if(gallery && f.photos){ gallery.innerHTML = f.photos.map(src=>`<img src="${src}" alt="${f.name} photo">`).join(''); }

    // Amenities
    const am = document.getElementById('facilityAmenities');
    if(am && f.amenities){ am.innerHTML = f.amenities.map(a=>`<li>${a}</li>`).join(''); }

    // Contact
    const phone = document.getElementById('facilityPhone');
    const email = document.getElementById('facilityEmail');
    const booking = document.getElementById('facilityBooking');
    if(phone && f.phone){ phone.href = `tel:${f.phone}`; phone.textContent = f.phone; }
    if(email && f.email){ email.href = `mailto:${f.email}`; email.textContent = f.email; }
    if(booking && f.booking){ booking.href = f.booking; booking.textContent = 'Book now'; }

    // Map embed
    const map = document.getElementById('mapEmbed');
    if(map && f.lat && f.lng){
      const q = encodeURIComponent(`${f.lat},${f.lng}`);
      map.innerHTML = `<iframe title="Map" width="100%" height="300" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps?q=${q}&output=embed"></iframe>`;
    }
  }
  run();
})();
