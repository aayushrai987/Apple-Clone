// script.js - handles mobile menu, header scroll effects, and small UI behaviour
(function () {
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.getElementById('site-header');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function toggleMobileMenu(forceState) {
    const isOpen = mobileMenu.classList.contains('block');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

    if (shouldOpen) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('block');
      mobileBtn.setAttribute('aria-expanded', 'true');
      mobileBtn.setAttribute('aria-label', 'Close menu');
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('block');
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileBtn.setAttribute('aria-label', 'Open menu');
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => toggleMobileMenu());
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMobileMenu(false);
  });

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!mobileMenu || !mobileBtn) return;
    if (!mobileMenu.contains(target) && !mobileBtn.contains(target) && mobileMenu.classList.contains('block')) {
      toggleMobileMenu(false);
    }
  });

  const SCROLL_THRESHOLD = 40;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (y > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sections = document.querySelectorAll('main section');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.12 });
    sections.forEach(s => io.observe(s));
  } else {
    sections.forEach(s => s.classList.add('in-view'));
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#' || href === '') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mobileMenu && mobileMenu.classList.contains('block')) toggleMobileMenu(false);
    }
  });

  function preferReducedMotion() {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) document.documentElement.style.scrollBehavior = 'auto';
  }
  preferReducedMotion();
})();
