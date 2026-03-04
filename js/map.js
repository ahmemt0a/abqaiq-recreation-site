(function(){
  const zones = document.querySelectorAll('.zone');
  zones.forEach(z=>{
    z.addEventListener('mouseenter', ()=> z.classList.add('hover'));
    z.addEventListener('mouseleave', ()=> z.classList.remove('hover'));
  });
})();
