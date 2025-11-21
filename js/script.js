(function(){
  const container = document.querySelector('.slider-container');
  if(!container) return;
  const slides = Array.from(container.querySelectorAll('.slide'));
  const prev = container.querySelector('.slider-prev');
  const next = container.querySelector('.slider-next');
  let index = 0;
  let timer;

  function show(i){
    slides.forEach((s,idx)=>{
      s.classList.toggle('active', idx===i);
    });
  }
  function go(delta){
    index = (index + delta + slides.length) % slides.length;
    show(index);
    restart();
  }
  function restart(){
    clearInterval(timer);
    timer = setInterval(()=>go(1), 6000);
  }

  prev && prev.addEventListener('click', ()=>go(-1));
  next && next.addEventListener('click', ()=>go(1));

  show(index);
  restart();
})();

// Sticky header after 20% scroll
(function(){
  const header = document.querySelector('.header');
  if(!header) return;
  function onScroll(){
    const threshold = window.innerHeight * 0.2;
    if(window.scrollY > threshold){
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Font size controls
(function(){
  const root = document.documentElement;
  const dec = document.getElementById('font-dec');
  const inc = document.getElementById('font-inc');
  const rst = document.getElementById('font-reset');
  if(!dec || !inc || !rst) return;

  const MIN = 0.85, MAX = 1.25, STEP = 0.05, DEF = 1;
  function getScale(){
    const v = parseFloat(localStorage.getItem('user-font-scale'));
    return isNaN(v) ? DEF : v;
  }
  function setScale(val){
    const clamped = Math.min(MAX, Math.max(MIN, parseFloat(val)));
    root.style.setProperty('--user-font-scale', clamped);
    localStorage.setItem('user-font-scale', clamped);
  }
  // init
  setScale(getScale());

  dec.addEventListener('click', ()=> setScale(getScale() - STEP));
  inc.addEventListener('click', ()=> setScale(getScale() + STEP));
  rst.addEventListener('click', ()=> setScale(DEF));
})();

// Reveal animations on scroll for headings, text blocks, and media
(function(){
  const headingSel = [
    '.about-heading',
    '.feature-card .feature-title',
    '.footer-section h6',
    'section h1','section h2','section h3','section h4'
  ];
  const textSel = ['section p','section li','.about-text','.action-panel'];
  const mediaSel = ['img','.feature-card','.feature-image img'];
  const explicitSel = ['.text-blur-in','.media-fade-in','.reveal-up'];

  const targets = Array.from(document.querySelectorAll([
    ...headingSel,
    ...textSel,
    ...mediaSel,
    ...explicitSel
  ].join(',')));
  if (targets.length === 0) return;

  // If IntersectionObserver not available, show immediately
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => {
      if (el.classList.contains('text-blur-in') || el.classList.contains('media-fade-in') || el.classList.contains('reveal-up')) {
        el.classList.add('in');
      }
    });
    return;
  }

  targets.forEach((el, idx)=>{
    // Skip if already initialized
    if (el.classList.contains('in')) return;

    // Media elements: images and cards
    if (el.tagName === 'IMG' || el.matches('.feature-card, .feature-image img, .media-fade-in')) {
      el.classList.add('media-fade-in');
    } else if (el.classList.contains('text-blur-in')) {
      // keep as-is
    } else if (el.matches(headingSel.join(','))) {
      // Headings get reveal-up by default
      el.classList.add('reveal-up');
    } else if (el.matches(textSel.join(','))) {
      // Text blocks get reveal-up
      el.classList.add('reveal-up');
    }

    // Simple stagger on non-media
    if (el.classList.contains('reveal-up')) {
      if (idx % 3 === 1) el.classList.add('reveal-delay-1');
      else if (idx % 3 === 2) el.classList.add('reveal-delay-2');
    }
  });

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      } else {
        // Remove to allow re-trigger when it enters again
        entry.target.classList.remove('in');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  targets.forEach(el => io.observe(el));
})();
