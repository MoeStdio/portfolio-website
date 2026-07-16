import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0,
});

if (document.querySelector('.project-snap-target')) {
        function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const targets = Array.from(document.querySelectorAll('.project-snap-target'));

    let currentIndex = 0;
    let isSnapping = false;
    const LOCK_MS = 1000;

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

    function goToIndex(index) {
    index = Math.max(0, Math.min(targets.length - 1, index));
    if (index === currentIndex && !isSnapping) {}
    currentIndex = index;
    isSnapping = true;

    lenis.scrollTo(targets[currentIndex], {
        offset: 0,
        duration: 0.9,
        lock: true,
        onComplete: () => {
        isSnapping = false;
        }
    });
    }

    window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isSnapping) return;

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

    window.addEventListener('touchend', (e) => {
    if (touchStartY === null || isSnapping) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    const SWIPE_THRESHOLD = 30;

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
        if (delta > 0) {
        goToIndex(currentIndex + 1);
        } else {
        goToIndex(currentIndex - 1);
        }
    }
    touchStartY = null;
    }, { passive: true });
}