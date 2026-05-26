/* =====================================================
   tomato agency — landing page interactions
   ===================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Splash ---------------- */
  const splash = $('#splash');
  let splashHidden = false;
  const hideSplash = () => {
    if (!splash || splashHidden) return;
    splashHidden = true;
    splash.classList.add('is-hidden');
    setTimeout(() => { try { splash.remove(); } catch {} }, 1100);
  };
  // Show splash for ~1.4s minimum so the animation can play, then hide.
  const minSplash = 1400;
  const startedAt = performance.now();
  const scheduleHide = () => {
    const elapsed = performance.now() - startedAt;
    setTimeout(hideSplash, Math.max(minSplash - elapsed, 200));
  };
  if (document.readyState === 'complete') {
    scheduleHide();
  } else {
    window.addEventListener('load', scheduleHide, { once: true });
  }
  // Safety: always hide after 3s no matter what
  setTimeout(hideSplash, 3000);

  /* ---------------- Year ---------------- */
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------------- FAB visibility ---------------- */
  const fab = $('.fab');
  const fabVisibility = () => {
    if (!fab) return;
    fab.classList.toggle('is-visible', window.scrollY > 480);
  };

  /* ---------------- Sticky header shadow ---------------- */
  const header = $('#header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    fabVisibility();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = $('#navToggle');
  const nav = $('#nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', e => {
      if (e.target.matches('a')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    matchMedia('(min-width: 1024px)').addEventListener('change', e => {
      if (e.matches) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  const revealTargets = [
    '.about__card', '.service-card', '.process__step',
    '.talent__card', '.voice', '.faq__item',
    '.section-head', '.stats__item', '.hero__content > *', '.hero__visual'
  ];
  const candidates = $$(revealTargets.join(','));
  candidates.forEach((el, i) => {
    el.classList.add('reveal');
    el.setAttribute('data-delay', String(Math.min(i % 4, 4)));
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.01 });
    candidates.forEach(el => io.observe(el));
    // Safety: reveal any element still hidden after 2.5s (e.g. observer never fired)
    setTimeout(() => candidates.forEach(el => el.classList.add('is-in')), 2500);
  } else {
    candidates.forEach(el => el.classList.add('is-in'));
  }

  /* ---------------- Stat counters ---------------- */
  const counters = $$('.stats__num');
  if ('IntersectionObserver' in window && counters.length && !prefersReducedMotion) {
    const tween = (el, to, dur = 1400) => {
      const start = performance.now();
      const step = now => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * to).toString();
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = String(to);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const to = Number(e.target.dataset.count || 0);
          tween(e.target, to);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.dataset.count; });
  }

  /* ---------------- FAQ single-open (optional) ---------------- */
  const faqItems = $$('.faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  /* ---------------- Smooth scroll fallback ---------------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
    history.pushState(null, '', href);
  });

  /* ---------------- Tilt on hover (light) ---------------- */
  if (matchMedia('(hover: hover) and (min-width: 1024px)').matches && !prefersReducedMotion) {
    $$('.about__card, .service-card, .talent__card').forEach(card => {
      const max = 6;
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
})();
