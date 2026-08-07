const io=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('on')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

document.getElementById('briefForm').addEventListener('submit',function(e){
 e.preventDefault();
 const v=id=>document.getElementById(id).value.trim();
 const subject='Запрос на оценку проекта — '+v('service');
 const body=[
  'Имя: '+v('name'),
  'Компания: '+v('company'),
  'Телефон: '+v('phone'),
  'Email: '+v('email'),
  'Услуга: '+v('service'),
  '',
  'Описание проекта:',
  v('message')
 ].join('\n');
 window.location.href='mailto:hello@forma-pack.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});
const topbar = document.querySelector('.topbar');
const menuToggle = document.querySelector('.menu-toggle');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

function closeMobileMenu(){
  topbar.classList.remove('menu-open');
  document.body.classList.remove('menu-is-open');

  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}

menuToggle.addEventListener('click', function(){
  const isOpen = topbar.classList.toggle('menu-open');

  document.body.classList.toggle('menu-is-open', isOpen);

  menuToggle.setAttribute(
    'aria-expanded',
    String(isOpen)
  );

  menuToggle.setAttribute(
    'aria-label',
    isOpen ? 'Закрыть меню' : 'Открыть меню'
  );
});

mobileLinks.forEach(function(link){
  link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('resize', function(){
  if(window.innerWidth > 950){
    closeMobileMenu();
  }
});


/* Portfolio: load more + fullscreen gallery */
(function(){
  const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
  const loadMoreButton = document.querySelector('.portfolio-more-btn');
  const modal = document.getElementById('portfolio-modal');
  if(!portfolioItems.length || !loadMoreButton || !modal) return;

  const modalImage = modal.querySelector('.portfolio-modal-image');
  const modalTitle = modal.querySelector('#portfolio-modal-title');
  const modalDescription = modal.querySelector('.portfolio-modal-description');
  const modalClose = modal.querySelector('.portfolio-modal-close');
  const modalBackdrop = modal.querySelector('.portfolio-modal-backdrop');
  const prevButton = modal.querySelector('.portfolio-modal-prev');
  const nextButton = modal.querySelector('.portfolio-modal-next');
  const imageWrap = modal.querySelector('.portfolio-modal-image-wrap');

  const initialVisibleCount = 6;
  const loadMoreCount = 4;
  let visibleCount = initialVisibleCount;
  let currentIndex = 0;
  let lastFocusedItem = null;
  let touchStartX = 0;
  let touchStartY = 0;

  function updatePortfolioVisibility(animateFrom){
    portfolioItems.forEach(function(item,index){
      const shouldShow = index < visibleCount;
      item.classList.toggle('is-visible', shouldShow);

      if(shouldShow && typeof animateFrom === 'number' && index >= animateFrom){
        item.classList.remove('is-entering');
        void item.offsetWidth;
        item.style.animationDelay = ((index - animateFrom) * 70) + 'ms';
        item.classList.add('is-entering');
        item.addEventListener('animationend',function clearEntering(){
          item.classList.remove('is-entering');
          item.style.animationDelay = '';
          item.removeEventListener('animationend',clearEntering);
        });
      }
    });
    loadMoreButton.classList.toggle('is-hidden', visibleCount >= portfolioItems.length);
  }

  function updateModal(index){
    currentIndex = Math.max(0, Math.min(index, portfolioItems.length - 1));
    const item = portfolioItems[currentIndex];
    const image = item.querySelector('img');
    modalImage.classList.add('is-changing');
    const nextSrc = image.currentSrc || image.src;
    window.setTimeout(function(){
      modalImage.src = nextSrc;
      modalImage.alt = image.alt || '';
      requestAnimationFrame(function(){
        modalImage.classList.remove('is-changing');
      });
    },120);
    modalTitle.textContent = item.dataset.title || image.alt || 'Проект FORMA';
    modalDescription.textContent = item.dataset.description || '';
    prevButton.classList.toggle('is-disabled', currentIndex === 0);
    nextButton.classList.toggle('is-disabled', currentIndex === portfolioItems.length - 1);
  }

  function openPortfolioModal(index){
    lastFocusedItem = portfolioItems[index];
    updateModal(index);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('portfolio-modal-open');
    modalClose.focus();
  }

  function closePortfolioModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('portfolio-modal-open');
    if(lastFocusedItem) lastFocusedItem.focus();
  }

  portfolioItems.forEach(function(item,index){
    item.addEventListener('click',function(){ openPortfolioModal(index); });
  });

  loadMoreButton.addEventListener('click',function(){
    const previousVisibleCount = visibleCount;
    visibleCount += loadMoreCount;
    updatePortfolioVisibility(previousVisibleCount);
  });

  modalClose.addEventListener('click',closePortfolioModal);
  modalBackdrop.addEventListener('click',closePortfolioModal);
  prevButton.addEventListener('click',function(){ if(currentIndex > 0) updateModal(currentIndex - 1); });
  nextButton.addEventListener('click',function(){ if(currentIndex < portfolioItems.length - 1) updateModal(currentIndex + 1); });

  document.addEventListener('keydown',function(event){
    if(!modal.classList.contains('is-open')) return;
    if(event.key === 'Escape') closePortfolioModal();
    if(event.key === 'ArrowLeft' && currentIndex > 0) updateModal(currentIndex - 1);
    if(event.key === 'ArrowRight' && currentIndex < portfolioItems.length - 1) updateModal(currentIndex + 1);
  });

  imageWrap.addEventListener('touchstart',function(event){
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  },{passive:true});

  imageWrap.addEventListener('touchend',function(event){
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if(Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if(deltaX < 0 && currentIndex < portfolioItems.length - 1) updateModal(currentIndex + 1);
    if(deltaX > 0 && currentIndex > 0) updateModal(currentIndex - 1);
  },{passive:true});

  updatePortfolioVisibility();
})();

(function(){
  const items=Array.from(document.querySelectorAll('.production-animate'));
  if(!items.length) return;
  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){el.classList.add('production-on');});
    return;
  }
  const observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('production-on');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.18,rootMargin:'0px 0px -8% 0px'});
  items.forEach(function(el){observer.observe(el);});
})();

(function(){
  const hero = document.querySelector('.hero-product');
  if(!hero) return;

  let scheduled = false;

  function updateHero(){
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(1, rect.height * .78);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    hero.style.setProperty('--hero-progress', progress.toFixed(4));
    scheduled = false;
  }

  function scheduleHeroUpdate(){
    if(scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateHero);
  }

  window.addEventListener('scroll', scheduleHeroUpdate, {passive:true});
  window.addEventListener('resize', scheduleHeroUpdate);
  updateHero();
})();
