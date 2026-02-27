
(function(){
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if(toggle && menu){
    toggle.addEventListener('click', ()=>{
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
})();
