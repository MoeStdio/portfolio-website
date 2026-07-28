import Lenis from 'lenis';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0,
});

if (document.querySelector('.snap-target')) {
  let isTabVisible = true;

  document.addEventListener('visibilitychange', () => {
    isTabVisible = document.visibilityState === 'visible';
  });

  function raf() {
    if (isTabVisible) {
      lenis.raf(performance.now());
    }
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const targets = Array.from(document.querySelectorAll('.snap-target'));
  const scrollIndicator = document.getElementById('scroll-indicator');

  function updateIndicator(index) {
    if (scrollIndicator) {
      scrollIndicator.style.opacity = index >= targets.length - 1 ? '0' : '0.5';
    }
  }

  let currentIndex = 0;
  let isSnapping = false;

  function getClosestIndex() {
    let closest = 0;
    let minDistance = Infinity;
    targets.forEach((target, i) => {
      const distance = Math.abs(target.getBoundingClientRect().top);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    });
    return closest;
  }

  currentIndex = getClosestIndex();
  updateIndicator(currentIndex);

  lenis.scrollTo(targets[currentIndex], {
    offset: 0,
    duration: 0,
    immediate: true,
  });

  document.querySelector('main')?.classList.remove('snap-loading');

  function goToIndex(index) {
    index = Math.max(0, Math.min(targets.length - 1, index));
    currentIndex = index;
    isSnapping = true;
    updateIndicator(currentIndex);

    lenis.scrollTo(targets[currentIndex], {
      offset: 0,
      duration: prefersReducedMotion ? 0 : 0.9,
      lock: true,
      onComplete: () => {
        isSnapping = false;
      }
    });
  }

  window.addEventListener('wheel', (e) => {
    if (isSnapping) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    if (e.deltaY > 0) {
      goToIndex(currentIndex + 1);
    } else if (e.deltaY < 0) {
      goToIndex(currentIndex - 1);
    }
  }, { passive: false });

  let touchStartY = null;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (touchStartY === null || isSnapping) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;

    const SWIPE_THRESHOLD = window.innerHeight * 0.08;

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) {
        goToIndex(currentIndex + 1);
      } else {
        goToIndex(currentIndex - 1);
      }
    }
    touchStartY = null;
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();

      if (e.repeat || isSnapping) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        goToIndex(currentIndex + 1);
      } else {
        goToIndex(currentIndex - 1);
      }
    }
  });

  window.addEventListener('resize', () => {
    if (!isSnapping) {
      currentIndex = getClosestIndex();
      updateIndicator(currentIndex);
    }
  }, { passive: true });
}