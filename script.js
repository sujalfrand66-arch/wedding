/**
 * Wedding Invitation — script.js
 * Master GSAP Timeline + ScrollTrigger Entrance Storytelling
 * Harsh & Harshita Wedding Celebrations
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
     ROYAL WEDDING MUSIC PLAYER (PUNJABI & INSTRUMENTAL)
     Tracks:
       1. Viah (viah.mp3)
       2. Sazan Razi (Sajjan Raazi.mp3)
       3. Romantic Instrumental (assets/wedding-music.mp3)
     Default initial volume: 60% (0.60) maintained across tracks.
  ══════════════════════════════════════════════════════════ */
  const playlist = [
    { id: 'viah', title: 'Viah', src: 'viah.mp3', tag: 'Punjabi Wedding' },
    { id: 'sazan', title: 'Sazan Razi', src: 'Sajjan Raazi.mp3', tag: 'Punjabi Wedding' },
    { id: 'instrumental', title: 'Romantic Instrumental', src: 'assets/wedding-music.mp3', tag: 'Soft Theme' }
  ];

  let currentTrackIndex = 0;
  let currentVolume = 0.60; // Strictly 60% volume requirement
  let isMusicPlaying = false;
  let userManuallyStopped = false;

  const bgMusic = document.getElementById('bg-music');
  const musicPlayer = document.getElementById('wedding-music-player');
  const playBtn = document.getElementById('music-play-btn');
  const trackBtn = document.getElementById('music-track-btn');
  const prevBtn = document.getElementById('music-prev-btn');
  const nextBtn = document.getElementById('music-next-btn');
  const currentTitleEl = document.getElementById('current-track-title');
  const playlistPanel = document.getElementById('music-playlist-panel');
  const playlistCloseBtn = document.getElementById('music-playlist-close');
  const trackItems = qa('.music-track-item');
  const volumeSlider = document.getElementById('music-volume-slider');
  const volumeDisplay = document.getElementById('music-volume-display');

  // Initialize HTML audio element strictly at 60% volume with the first track
  if (bgMusic) {
    bgMusic.volume = currentVolume;
    bgMusic.src = playlist[currentTrackIndex].src;

    // Auto-advance to next track when song finishes
    bgMusic.addEventListener('ended', function () {
      switchTrack((currentTrackIndex + 1) % playlist.length, true);
    });
  }

  function updatePlayerUI(playing) {
    if (!musicPlayer) return;
    const currentTrack = playlist[currentTrackIndex];

    if (currentTitleEl) {
      currentTitleEl.textContent = currentTrack.title;
    }

    const stateTextEl = document.getElementById('music-state-text');
    if (stateTextEl) {
      stateTextEl.textContent = playing ? 'Stop Music' : 'Play Music';
    }

    if (playBtn) {
      playBtn.setAttribute('title', playing ? 'Stop Wedding Music' : 'Play Wedding Music');
      playBtn.setAttribute('aria-label', playing ? 'Stop Wedding Music' : 'Play Wedding Music');
      playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    }

    if (playing) {
      musicPlayer.classList.add('is-playing');
      musicPlayer.classList.remove('is-paused');
    } else {
      musicPlayer.classList.remove('is-playing');
      musicPlayer.classList.add('is-paused');
    }

    // Update active class in playlist popover
    trackItems.forEach(function (item, idx) {
      const isCurrent = idx === currentTrackIndex;
      item.classList.toggle('is-active', isCurrent);
      item.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      const statusEl = item.querySelector('.track-status');
      if (statusEl) {
        statusEl.textContent = isCurrent ? (playing ? 'Playing' : 'Paused') : '';
      }
    });

    if (volumeSlider) {
      volumeSlider.value = Math.round(currentVolume * 100);
    }
    if (volumeDisplay) {
      volumeDisplay.textContent = Math.round(currentVolume * 100) + '%';
    }
  }

  // Attempt autoplay immediately (succeeds if browser allows unmuted audio)
  function attemptAutoplay() {
    if (!bgMusic || userManuallyStopped) return;
    bgMusic.volume = currentVolume; // Guaranteed 0.60

    const promise = bgMusic.play();
    if (promise !== undefined) {
      promise
        .then(function () {
          isMusicPlaying = true;
          updatePlayerUI(true);
        })
        .catch(function () {
          // Normal mobile browser autoplay restriction: will unlock on first user gesture
          isMusicPlaying = false;
          updatePlayerUI(false);
        });
    }
  }

  function playMusic() {
    if (!bgMusic) return;
    userManuallyStopped = false;
    bgMusic.volume = currentVolume; // Guaranteed 0.60

    const promise = bgMusic.play();
    if (promise !== undefined) {
      promise
        .then(function () {
          isMusicPlaying = true;
          updatePlayerUI(true);
        })
        .catch(function () {
          isMusicPlaying = false;
          updatePlayerUI(false);
        });
    }
  }

  function stopMusic() {
    if (!bgMusic) return;
    userManuallyStopped = true;
    bgMusic.pause();
    isMusicPlaying = false;
    bgMusic.volume = currentVolume; // Keep volume locked at 0.60
    updatePlayerUI(false);
  }

  function togglePlayPause() {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      playMusic();
    }
  }

  function switchTrack(newIndex, autoPlay) {
    if (!bgMusic) return;
    currentTrackIndex = (newIndex + playlist.length) % playlist.length;
    const track = playlist[currentTrackIndex];

    const shouldPlay = isMusicPlaying || autoPlay || !userManuallyStopped;

    // Load new audio source and maintain strictly consistent 60% volume
    bgMusic.src = track.src;
    bgMusic.volume = currentVolume;

    updatePlayerUI(shouldPlay);

    if (shouldPlay && !userManuallyStopped) {
      const promise = bgMusic.play();
      if (promise !== undefined) {
        promise
          .then(function () {
            isMusicPlaying = true;
            updatePlayerUI(true);
          })
          .catch(function () {
            isMusicPlaying = false;
            updatePlayerUI(false);
          });
      }
    }
  }

  // Event Listeners for Player Controls
  if (playBtn) {
    playBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePlayPause();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      switchTrack(currentTrackIndex + 1, true);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      switchTrack(currentTrackIndex - 1, true);
    });
  }

  if (trackBtn) {
    trackBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (musicPlayer) {
        musicPlayer.classList.toggle('playlist-open');
        const isOpen = musicPlayer.classList.contains('playlist-open');
        if (playlistPanel) playlistPanel.setAttribute('aria-hidden', !isOpen);
      }
    });
  }

  if (playlistCloseBtn) {
    playlistCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (musicPlayer) {
        musicPlayer.classList.remove('playlist-open');
        if (playlistPanel) playlistPanel.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Clicking an item in the playlist
  trackItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      const idx = parseInt(item.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        userManuallyStopped = false;
        switchTrack(idx, true);
      }
    });
  });

  // Volume slider interaction
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function (e) {
      const val = parseInt(e.target.value, 10);
      currentVolume = Math.max(0, Math.min(1, val / 100));
      if (bgMusic) {
        bgMusic.volume = currentVolume;
      }
      if (volumeDisplay) {
        volumeDisplay.textContent = val + '%';
      }
    });
  }

  // Close playlist popover if clicked outside
  document.addEventListener('click', function (e) {
    if (musicPlayer && musicPlayer.classList.contains('playlist-open')) {
      if (!musicPlayer.contains(e.target)) {
        musicPlayer.classList.remove('playlist-open');
        if (playlistPanel) playlistPanel.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // Handle mobile browser autoplay restriction via first touch/interaction
  function triggerMusicOnFirstInteraction() {
    if (!isMusicPlaying && !userManuallyStopped) {
      attemptAutoplay();
    }
    const interactionEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];
    interactionEvents.forEach(function (evt) {
      window.removeEventListener(evt, triggerMusicOnFirstInteraction);
    });
    const curtain = document.getElementById('curtain-overlay');
    if (curtain) {
      interactionEvents.forEach(function (evt) {
        curtain.removeEventListener(evt, triggerMusicOnFirstInteraction);
      });
    }
  }

  const interactionEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];
  interactionEvents.forEach(function (evt) {
    window.addEventListener(evt, triggerMusicOnFirstInteraction, { passive: true });
  });

  const curtainEl = document.getElementById('curtain-overlay');
  if (curtainEl) {
    interactionEvents.forEach(function (evt) {
      curtainEl.addEventListener(evt, triggerMusicOnFirstInteraction, { passive: true });
    });
  }

  // Attempt initial playback immediately on script load
  attemptAutoplay();

  // Also re-attempt on DOMContentLoaded and window load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptAutoplay);
  }
  window.addEventListener('load', attemptAutoplay);

  // Initialize UI display on load
  updatePlayerUI(false);

  /* ══════════════════════════════════════════════════════════
     CINEMATIC STAGE CURTAIN OPENING INTRO
     Mobile requirement: ~2.5–3.5s smooth duration with clear
     initial visibility, fluid parting, and hero reveal strictly
     after completion.
  ══════════════════════════════════════════════════════════ */
  const curtainOverlay = document.getElementById('curtain-overlay');

  function startCurtainSequence() {
    if (!curtainOverlay) {
      document.body.style.overflow = '';
      playHeroEntrance();
      return;
    }

    // Lock page scrolling during curtain opening
    document.body.style.overflow = 'hidden';

    // Accessible reduced motion behavior: gentle 1.2s fade instead of sudden jarring skip
    if (prefersReducedMotion) {
      gsap.to(curtainOverlay, {
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.5,
        onComplete: function () {
          curtainOverlay.style.display = 'none';
          curtainOverlay.style.pointerEvents = 'none';
          document.body.style.overflow = '';
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
          }
          playHeroEntrance();
        }
      });
      return;
    }

    const isMobile = window.innerWidth <= 768;

    // Mobile duration: ~3.0s total (well within 2.5–3.5s requirement)
    // Desktop duration: ~2.2s total (preserves existing desktop elegance)
    const timing = isMobile
      ? {
          sealHold: 0.85,
          sealFade: 0.55,
          valanceDuration: 1.3,
          curtainDuration: 1.6,
          overlayFade: 0.4,
          ease: 'power2.inOut'
        }
      : {
          sealHold: 0.5,
          sealFade: 0.45,
          valanceDuration: 1.1,
          curtainDuration: 1.3,
          overlayFade: 0.3,
          ease: 'power3.inOut'
        };

    const curtainTl = gsap.timeline({
      onComplete: function () {
        curtainOverlay.style.display = 'none';
        curtainOverlay.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
        // STAGE 2: Reveal hero strictly AFTER curtains have fully parted
        playHeroEntrance();
      }
    });

    curtainTl
      // 1. Curtains & royal center seal clearly displayed
      .to('.curtain-center-seal', {
        autoAlpha: 0,
        scale: 0.92,
        duration: timing.sealFade,
        delay: timing.sealHold,
        ease: 'power2.in'
      })
      // 2. Valance lifts upward smoothly
      .to('.curtain-valance', {
        y: isMobile ? -42 : -35,
        autoAlpha: 0,
        duration: timing.valanceDuration,
        ease: timing.ease
      }, '-=0.15')
      // 3. Side curtains part outward smoothly with royal grace
      .to('.curtain-panel--left', {
        xPercent: -100,
        duration: timing.curtainDuration,
        ease: timing.ease
      }, '<')
      .to('.curtain-panel--right', {
        xPercent: 100,
        duration: timing.curtainDuration,
        ease: timing.ease
      }, '<')
      // 4. Subtle overlay background fade-out as curtains reach edge
      .to(curtainOverlay, {
        autoAlpha: 0,
        duration: timing.overlayFade,
        ease: 'power1.out'
      }, `-=${timing.overlayFade}`);
  }

  // Pre-check curtain images to prevent mobile stutter or skipping before render
  function ensureCurtainAssetsReady(onReady) {
    if (!curtainOverlay) {
      onReady();
      return;
    }

    const imgs = qa('img', curtainOverlay);
    let remaining = imgs.length;
    let completed = false;

    function finish() {
      if (completed) return;
      completed = true;
      // Double requestAnimationFrame ensures browser has painted initial curtain state
      requestAnimationFrame(function () {
        requestAnimationFrame(onReady);
      });
    }

    if (!remaining) {
      finish();
      return;
    }

    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        remaining--;
        if (remaining <= 0) finish();
      } else {
        img.addEventListener('load', function () {
          remaining--;
          if (remaining <= 0) finish();
        });
        img.addEventListener('error', function () {
          remaining--;
          if (remaining <= 0) finish();
        });
      }
    });

    // Safety fallback: maximum 700ms wait so user never hangs
    setTimeout(finish, 700);
  }

  // Initialize once DOM is ready and assets verified
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      ensureCurtainAssetsReady(startCurtainSequence);
    });
  } else {
    ensureCurtainAssetsReady(startCurtainSequence);
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
