
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
      const res = await fetch('/data/facilities.json');
      data = await res.json();
    }catch(e){console.error(e)}
    const f = data.find(x=>String(x.id)===String(id));
    if(!f) return;

    document.getElementById('facilityName').textContent = f.name;
    document.getElementById('facilityCategory').textContent = f.category;
    document.getElementById('facilityStatus').textContent = f.status;
    document.getElementById('facilityDays').textContent = f.operating_days || '—';
    document.getElementById('facilityOpen').textContent = f.open_time || '—';
    document.getElementById('facilityClose').textContent = f.close_time || '—';
    document.getElementById('facilityPurpose').textContent = f.purpose || '—';
    document.getElementById('facilityPurposeCategory').textContent = f.purpose_category || '—';
    document.getElementById('facilityLongDesc').textContent = f.description || '';
    document.getElementById('facilityAddress').textContent = f.address || '—';
    document.getElementById('facilityLat').textContent = f.lat || '—';
    document.getElementById('facilityLng').textContent = f.lng || '—';

    const hero = document.getElementById('facilityHero');
    if(f.photos && f.photos.length){ hero.src = f.photos[0]; hero.alt = f.name; }

    // Gallery
    const gallery = document.getElementById('facilityGallery');
    if(f.photos){
      gallery.innerHTML = f.photos.map(src=>`<img src="${src}" alt="${f.name} photo">`).join('');
    }

    // Amenities
    const am = document.getElementById('facilityAmenities');
    if(f.amenities){
      am.innerHTML = f.amenities.map(a=>`<li>${a}</li>`).join('');
    }

    // Contact
    const phone = document.getElementById('facilityPhone');
    const email = document.getElementById('facilityEmail');
    const booking = document.getElementById('facilityBooking');
    if(f.phone){ phone.href = `tel:${f.phone}`; phone.textContent = f.phone; }
    if(f.email){ email.href = `mailto:${f.email}`; email.textContent = f.email; }
    if(f.booking){ booking.href = f.booking; booking.textContent = 'Book now'; }

    // Map embed (no API key required – static iframe)
    const map = document.getElementById('mapEmbed');
    if(f.lat && f.lng){
      const q = encodeURIComponent(`${f.lat},${f.lng}`);
      map.innerHTML = `<iframe title="Map" width="100%" height="300" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps?q=${q}&output=embed"></iframe>`;
    }
  }
  run();
})();
