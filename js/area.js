
(async function(){
  const grid = document.getElementById('facilityGrid');
  if(!grid) return;
  const areaSlug = grid.getAttribute('data-area');
  let data = [];
  try{
    const res = await fetch('/data/facilities.json');
    data = await res.json();
  }catch(e){console.error('Failed to load data', e)}

  const all = data.filter(d=>d.area===areaSlug);
  const chips = document.querySelectorAll('.chip');

  function render(list){
    grid.innerHTML = list.map(item=>{
      const url = `/facility.html?id=${encodeURIComponent(item.id)}`;
      return `
      <article class="card">
        <img src="${item.photo || '/images/placeholders/card.jpg'}" alt="${item.name}">
        <div class="card-body">
          <h3><a href="${url}">${item.name}</a></h3>
          <div class="meta"><span>${item.category}</span><span>${item.status}</span></div>
        </div>
      </article>`;
    }).join('');
  }

  render(all);

  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      ch.classList.add('active');
      const f = ch.dataset.filter;
      const filtered = (f==='all')? all : all.filter(i=>i.category===f);
      render(filtered);
    })
  })
})();
