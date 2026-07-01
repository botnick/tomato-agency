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
  // Min display so entry animations (corePop 1.15s, progress 1.3s) can finish
  const minSplash = 1500;
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
  setTimeout(hideSplash, 3500);
  if (splash) {
    splash.addEventListener('pointerdown', hideSplash, { once: true, passive: true });
  }

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

  /* ---------------- Voices horizontal scroll (mobile) ---------------- */
  const voicesGrid = $('#voices .voices__grid');
  if (voicesGrid && voicesGrid.children.length > 1) {
    const wrap = document.createElement('div');
    wrap.className = 'voices-scroll-wrap';
    voicesGrid.parentNode.insertBefore(wrap, voicesGrid);
    wrap.appendChild(voicesGrid);

    const arrowSVG = dir =>
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="${dir === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'}"/></svg>`;

    const makeArrow = (dir, label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `voices-arrow voices-arrow--${dir}`;
      b.setAttribute('aria-label', label);
      b.innerHTML = arrowSVG(dir);
      return b;
    };
    const prevBtn = makeArrow('prev', 'รีวิวก่อนหน้า');
    const nextBtn = makeArrow('next', 'รีวิวถัดไป');
    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);

    const dots = document.createElement('div');
    dots.className = 'voices-dots';
    dots.setAttribute('aria-hidden', 'true');
    Array.from(voicesGrid.children).forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'voices-dot' + (i === 0 ? ' is-active' : '');
      dots.appendChild(d);
    });
    wrap.parentNode.insertBefore(dots, wrap.nextSibling);

    const stepWidth = () => {
      const first = voicesGrid.children[0];
      return first ? first.getBoundingClientRect().width + 14 : 280;
    };
    const currentIdx = () => Math.round(voicesGrid.scrollLeft / stepWidth());
    const goTo = idx => {
      const clamped = Math.max(0, Math.min(idx, voicesGrid.children.length - 1));
      const target = clamped * stepWidth();
      voicesGrid.scrollTo({
        left: target,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    };
    prevBtn.addEventListener('click', () => goTo(currentIdx() - 1));
    nextBtn.addEventListener('click', () => goTo(currentIdx() + 1));

    const updateDots = () => {
      const sl = voicesGrid.scrollLeft;
      const max = voicesGrid.scrollWidth - voicesGrid.clientWidth;
      prevBtn.disabled = sl < 4;
      nextBtn.disabled = sl > max - 4;
      const idx = Math.min(
        Math.round(sl / stepWidth()),
        voicesGrid.children.length - 1
      );
      Array.from(dots.children).forEach((d, i) =>
        d.classList.toggle('is-active', i === idx)
      );
    };
    voicesGrid.addEventListener('scroll', updateDots, { passive: true });
    window.addEventListener('resize', updateDots, { passive: true });
    updateDots();
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

  /* ---------------- Blog image lightbox ----------------
     Click an in-article image to view it enlarged. Scoped to the
     current post's body only (each page shows its own images), and
     built as a pure overlay — no history push, so the browser back
     button never gets hijacked into "previous image". */
  (() => {
    const imgs = $$('.post__body img');
    if (!imgs.length) return;

    let box, imgEl, capEl, lastFocus;

    const build = () => {
      box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'ดูรูปขนาดใหญ่');
      box.innerHTML =
        '<button class="lightbox__close" type="button" aria-label="ปิด">&times;</button>' +
        '<figure class="lightbox__fig"><img class="lightbox__img" alt=""><figcaption class="lightbox__cap"></figcaption></figure>';
      imgEl = $('.lightbox__img', box);
      capEl = $('.lightbox__cap', box);
      box.addEventListener('click', (e) => {
        if (e.target === box || e.target.closest('.lightbox__close')) close();
      });
      document.body.appendChild(box);
    };

    const open = (src, alt, caption) => {
      if (!box) build();
      imgEl.src = src;
      imgEl.alt = alt || '';
      capEl.textContent = caption || alt || '';
      capEl.style.display = capEl.textContent ? '' : 'none';
      lastFocus = document.activeElement;
      box.classList.add('is-open');
      document.documentElement.style.overflow = 'hidden';
      $('.lightbox__close', box).focus();
    };

    const close = () => {
      if (!box) return;
      box.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    imgs.forEach((img) => {
      img.classList.add('is-zoomable');
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      const cap = img.closest('figure') ? (img.closest('figure').querySelector('figcaption') || {}).textContent : '';
      const go = () => open(img.currentSrc || img.src, img.alt, cap);
      img.addEventListener('click', go);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && box && box.classList.contains('is-open')) close();
    });
  })();
})();
