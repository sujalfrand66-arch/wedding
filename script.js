/**
 * Wedding Invitation — script.js
 * Master GSAP Timeline + ScrollTrigger Entrance Storytelling
 * Harsh & Harishta Wedding Celebrations
 */

(function () {
  'use strict';

  /* ── Guard: check if GSAP is available ─────────────────── */
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded — falling back to CSS visible states.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Helper utilities ──────────────────────────────────── */
  function q(selector, context) {
    return (context || document).querySelector(selector);
  }
  function qa(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Set initial hidden states across scenes ───────────── */
  gsap.set('.reveal', { autoAlpha: 0, y: 30 });
  gsap.set('.reveal-item', { autoAlpha: 0, y: 20 });
  gsap.set('.floral-corner', { autoAlpha: 0, scale: 0.95 });
  gsap.set('.rose-corner', { autoAlpha: 0, scale: 0.95 });
  gsap.set('.lantern', { autoAlpha: 0, y: -20 });
  gsap.set('.mandala-bg', { autoAlpha: 0, scale: 0.85 });
  gsap.set('.ornament', { autoAlpha: 0, scale: 0.92 });
  gsap.set('.ganesha-img', { autoAlpha: 0, scale: 0.88 });

  /* ══════════════════════════════════════════════════════════
     HERO ENTRANCE ANIMATION (SCENE 1)
     Triggered strictly AFTER curtains finish opening.
  ══════════════════════════════════════════════════════════ */
  let heroEntranceTriggered = false;

  function playHeroEntrance() {
    if (heroEntranceTriggered) return;
    heroEntranceTriggered = true;

    const s1 = q('#scene-1');
    if (!s1) return;

    if (prefersReducedMotion) {
      gsap.to(qa('.reveal, .floral-corner, .rose-corner, .lantern, .ornament', s1), {
        autoAlpha: 1, y: 0, scale: 1, duration: 0.1
      });
      return;
    }

    const heroTl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    heroTl
      // 1. Reveal corner florals gently
      .to(qa('.floral-corner, .rose-corner', s1), {
        autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.06
      })
      // 2. Drop lanterns & top mandala motif
      .to(qa('.lantern', s1), {
        autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1
      }, '-=0.6')
      .to(qa('.ornament', s1), {
        autoAlpha: 1, scale: 1, duration: 0.7
      }, '-=0.6')
      // 3. Smooth entrance for main hero card content
      .to(q('.reveal', s1), {
        autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out'
      }, '-=0.5');
  }

  /* ══════════════════════════════════════════════════════════
     CINEMATIC STAGE CURTAIN OPENING INTRO
  ══════════════════════════════════════════════════════════ */
  const curtainOverlay = document.getElementById('curtain-overlay');

  if (curtainOverlay && !prefersReducedMotion) {
    document.body.style.overflow = 'hidden';

    const curtainTl = gsap.timeline({
      onComplete: function () {
        curtainOverlay.style.display = 'none';
        document.body.style.overflow = '';
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
        // STAGE 2: Reveal hero only AFTER curtains are completely open
        playHeroEntrance();
      }
    });

    curtainTl
      // 1. Brief pause to display royal center seal
      .to('.curtain-center-seal', { autoAlpha: 0, scale: 0.9, duration: 0.4, delay: 0.35, ease: 'power2.in' })
      // 2. Animate valance upward while side curtains slide apart
      .to('.curtain-valance', { y: -30, autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' }, '-=0.1')
      // 3. Slide left & right curtain panels outward smoothly
      .to('.curtain-panel--left', { xPercent: -100, duration: 1.2, ease: 'power3.inOut' }, '<')
      .to('.curtain-panel--right', { xPercent: 100, duration: 1.2, ease: 'power3.inOut' }, '<')
      .to(curtainOverlay, { autoAlpha: 0, duration: 0.25 }, '-=0.25');
  } else {
    // If no curtain overlay or reduced motion preferred, unveil hero immediately
    if (curtainOverlay) curtainOverlay.style.display = 'none';
    document.body.style.overflow = '';
    playHeroEntrance();
  }

  /* ── Reusable ScrollTrigger defaults ─────────────────────── */
  function stDefaults(el, extra) {
    return Object.assign({
      trigger: el,
      start: 'top 82%',
      toggleActions: 'play none none none',
    }, extra || {});
  }

  /* ══════════════════════════════════════════════════════════
     SCENE 2 — Ganesha Invocation
  ══════════════════════════════════════════════════════════ */
  const s2 = q('#scene-2');
  if (s2) {
    const s2Tl = gsap.timeline({ scrollTrigger: stDefaults(s2) });
    s2Tl
      .to(qa('.floral-corner, .rose-corner', s2), {
        autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out', stagger: 0.06
      })
      .to(qa('.mandala-bg', s2), {
        autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power1.out'
      }, '-=0.6')
      .to(q('.ganesha-img', s2), {
        autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.2)'
      }, '-=0.8')
      .to(q('.reveal', s2), {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.6');
  }

  /* ══════════════════════════════════════════════════════════
     SCENE 3 — Our Love Story
  ══════════════════════════════════════════════════════════ */
  const s3 = q('#scene-3');
  if (s3) {
    const s3Tl = gsap.timeline({ scrollTrigger: stDefaults(s3) });
    s3Tl
      .to(qa('.floral-corner, .rose-corner', s3), {
        autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out', stagger: 0.06
      })
      .to(qa('.lantern', s3), {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1
      }, '-=0.6')
      .to(q('.reveal', s3), {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.6');
  }

  /* ══════════════════════════════════════════════════════════
     SCENE 4 — Ceremonies & Celebrations
  ══════════════════════════════════════════════════════════ */
  const s4 = q('#scene-4');
  if (s4) {
    const s4Tl = gsap.timeline({ scrollTrigger: stDefaults(s4) });
    s4Tl
      .to(qa('.floral-corner, .rose-corner', s4), {
        autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out', stagger: 0.06
      })
      .to(qa('.lantern', s4), {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1
      }, '-=0.6')
      .to(q('.reveal', s4), {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out'
      }, '-=0.6')
      .to(qa('.reveal-item', s4), {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12
      }, '-=0.5');
  }

  /* ══════════════════════════════════════════════════════════
     SCENE 5 — Closing & RSVP
  ══════════════════════════════════════════════════════════ */
  const s5 = q('#scene-5');
  if (s5) {
    const s5Tl = gsap.timeline({ scrollTrigger: stDefaults(s5) });
    s5Tl
      .to(qa('.floral-corner, .rose-corner', s5), {
        autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out', stagger: 0.06
      })
      .to(q('.ganesha-img', s5), {
        autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.2)'
      }, '-=0.6')
      .to(q('.reveal', s5), {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.6');
  }

  /* ── Ambient slow rotation for mandala BGs & Lantern sway ─ */
  if (!prefersReducedMotion) {
    qa('.mandala-bg').forEach(function (el, i) {
      gsap.to(el, {
        rotation: i % 2 === 0 ? 360 : -360,
        duration: 85 + i * 15,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });
    });

    qa('.lantern--left').forEach(function (el) {
      gsap.to(el, {
        rotation: 3.5,
        duration: 4.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: '50% 0%',
      });
    });

    qa('.lantern--right').forEach(function (el) {
      gsap.to(el, {
        rotation: -3.5,
        duration: 4.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: '50% 0%',
      });
    });
  }

})();
