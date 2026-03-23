/* ============================================================
   tour.js — Shepherd.js Guided Tour for UniFroza Regz
   100% free, unlimited, runs entirely client-side
   ============================================================ */

function initTour() {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'uf-tour-step',
      scrollTo: { behavior: 'smooth', block: 'center' },
      cancelIcon: { enabled: true },
      modalOverlayOpeningPadding: 8,
      modalOverlayOpeningRadius: 12,
    }
  });

  // Step 1 — Welcome
  tour.addStep({
    id: 'welcome',
    title: '🎮 Welcome to UniFroza Regz!',
    text: 'Your one-stop destination for peak gaming performance. Let me show you around!',
    buttons: [
      { text: 'Skip Tour', action: tour.cancel, classes: 'shepherd-button-secondary' },
      { text: 'Let\'s Go →', action: tour.next }
    ]
  });

  // Step 2 — Hero CTA
  tour.addStep({
    id: 'get-started',
    title: '🚀 Get Started',
    text: 'Click here to create your free account and unlock access to all downloads.',
    attachTo: { element: '.hero__actions .btn--primary', on: 'bottom' },
    buttons: [
      { text: '← Back', action: tour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next →', action: tour.next }
    ]
  });

  // Step 3 — Features
  tour.addStep({
    id: 'features',
    title: '⚡ What We Offer',
    text: 'Optimized emulators, precision registry tweaks, and measurable FPS boosts — all crafted by a low-level systems expert.',
    attachTo: { element: '.features__grid', on: 'top' },
    buttons: [
      { text: '← Back', action: tour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next →', action: tour.next }
    ]
  });

  // Step 4 — Stats
  tour.addStep({
    id: 'stats',
    title: '📊 Proven Results',
    text: '12K+ downloads, 40% average FPS boost, and 5K+ active users trust our optimizations.',
    attachTo: { element: '.stats__grid', on: 'top' },
    buttons: [
      { text: '← Back', action: tour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next →', action: tour.next }
    ]
  });

  // Step 5 — Navigation
  tour.addStep({
    id: 'navigation',
    title: '🧭 Navigation',
    text: 'Use the navbar to access Home, Login, Register, and the Vault (downloads) once you\'re signed in.',
    attachTo: { element: '.navbar', on: 'bottom' },
    buttons: [
      { text: '← Back', action: tour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next →', action: tour.next }
    ]
  });

  // Step 6 — Register CTA
  tour.addStep({
    id: 'register',
    title: '📝 Create an Account',
    text: 'Sign up for free to access the Vault — our exclusive collection of emulators, APKs, and registry tweaks.',
    attachTo: { element: '#nav-register', on: 'bottom' },
    buttons: [
      { text: '← Back', action: tour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next →', action: tour.next }
    ]
  });

  // Step 7 — Music toggle
  tour.addStep({
    id: 'music',
    title: '🎵 Background Music',
    text: 'Toggle the background music on or off anytime with this button.',
    attachTo: { element: '#musicToggle', on: 'left' },
    buttons: [
      { text: '← Back', action: tour.back, classes: 'shepherd-button-secondary' },
      { text: 'Finish ✓', action: tour.next }
    ]
  });

  // Mark tour as completed in localStorage
  tour.on('complete', () => {
    localStorage.setItem('uf_tour_completed', 'true');
  });

  tour.on('cancel', () => {
    localStorage.setItem('uf_tour_completed', 'true');
  });

  return tour;
}

// Auto-start tour for first-time visitors (after a short delay)
(function() {
  const tourCompleted = localStorage.getItem('uf_tour_completed');

  if (!tourCompleted) {
    setTimeout(() => {
      const tour = initTour();
      tour.start();
    }, 1500);
  }

  // Allow manual re-trigger via the Tour button
  const tourBtn = document.getElementById('startTourBtn');
  if (tourBtn) {
    tourBtn.addEventListener('click', () => {
      const tour = initTour();
      tour.start();
    });
  }
})();
