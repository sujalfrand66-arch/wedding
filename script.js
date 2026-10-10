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
  gsap.set('.reveal', { autoAlpha: 0, y: 35 });
  gsap.set('.reveal-item', { autoAlpha: 0, y: 25 });
  gsap.set('.floral-corner', { autoAlpha: 0, scale: 0.94 });
  gsap.set('.rose-corner', { autoAlpha: 0, scale: 0.94 });
  gsap.set('.lantern', { autoAlpha: 0, y: -25 });
  gsap.set('.mandala-bg', { autoAlpha: 0, scale: 0.8 });
  gsap.set('.ornament', { autoAlpha: 0, scale: 0.9 });
  gsap.set('.ganesha-img', { autoAlpha: 0, scale: 0.85 });

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
        autoAlpha: 1, scale: 1, duration: 1.1, stagger: 0.08
      })
      // 2. Drop lanterns & top mandala motif
      .to(qa('.lantern', s1), {
        autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12
      }, '-=0.8')
      .to(qa('.ornament', s1), {
        autoAlpha: 1, scale: 1, duration: 1.0
      }, '-=0.8')
      // 3. Smooth entrance for main hero card content
      .to(q('.reveal', s1), {
        autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out'
      }, '-=0.6');
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
      // 1. Hold closed curtain seal (0.8s pause)
      .to('.curtain-center-seal', { autoAlpha: 0, scale: 0.85, duration: 0.5, delay: 0.8, ease: 'power2.in' })
      // 2. Animate valance slightly upward while side curtains slide apart
      .to('.curtain-valance', { y: -25, autoAlpha: 0, duration: 1.6, ease: 'power3.inOut' }, '-=0.1')
      // 3. Slide left & right curtain panels outward smoothly
      .to('.curtain-panel--left', { xPercent: -100, duration: 1.8, ease: 'power3.inOut' }, '<')
      .to('.curtain-panel--right', { xPercent: 100, duration: 1.8, ease: 'power3.inOut' }, '<')
      .to(curtainOverlay, { autoAlpha: 0, duration: 0.3 }, '-=0.3');
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
      start: 'top 80%',
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
        autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out', stagger: 0.08
      })
      .to(qa('.mandala-bg', s2), {
        autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power1.out'
      }, '-=0.8')
      .to(q('.ganesha-img', s2), {
        autoAlpha: 1, scale: 1, duration: 1.3, ease: 'back.out(1.2)'
      }, '-=1.0')
      .to(q('.reveal', s2), {
        autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out'
      }, '-=0.8');
  }

  /* ══════════════════════════════════════════════════════════
     SCENE 3 — Our Love Story
  ══════════════════════════════════════════════════════════ */
  const s3 = q('#scene-3');
  if (s3) {
    const s3Tl = gsap.timeline({ scrollTrigger: stDefaults(s3) });
    s3Tl
      .to(qa('.floral-corner, .rose-corner', s3), {
        autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out', stagger: 0.08
      })
      .to(qa('.lantern', s3), {
        autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12
      }, '-=0.8')
      .to(q('.reveal', s3), {
        autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out'
      }, '-=0.8');
  }

  /* ══════════════════════════════════════════════════════════
     SCENE 4 — Ceremonies & Celebrations
  ══════════════════════════════════════════════════════════ */
  const s4 = q('#scene-4');
  if (s4) {
    const s4Tl = gsap.timeline({ scrollTrigger: stDefaults(s4) });
    s4Tl
      .to(qa('.floral-corner, .rose-corner', s4), {
        autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out', stagger: 0.08
      })
      .to(qa('.lantern', s4), {
        autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12
      }, '-=0.8')
      .to(q('.reveal', s4), {
        autoAlpha: 1, y: 0, duration: 1.0, ease: 'power3.out'
      }, '-=0.8')
      .to(qa('.reveal-item', s4), {
        autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.16
      }, '-=0.6');
  }

  /* ══════════════════════════════════════════════════════════
     SCENE 5 — Closing & RSVP
  ══════════════════════════════════════════════════════════ */
  const s5 = q('#scene-5');
  if (s5) {
    const s5Tl = gsap.timeline({ scrollTrigger: stDefaults(s5) });
    s5Tl
      .to(qa('.floral-corner, .rose-corner', s5), {
        autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out', stagger: 0.08
      })
      .to(q('.ganesha-img', s5), {
        autoAlpha: 1, scale: 1, duration: 1.1, ease: 'back.out(1.2)'
      }, '-=0.8')
      .to(q('.reveal', s5), {
        autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out'
      }, '-=0.8');
  }

  /* ── Ambient slow rotation for mandala BGs ──────────────── */
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

    /* ── Gentle lantern sway ────────────────────────────────── */
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
