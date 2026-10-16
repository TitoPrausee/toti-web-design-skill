/**
 * Parallax — Multi-layer parallax without libraries
 * Uses scroll + requestAnimationFrame, transform-only, passive listener.
 *
 * Usage:
 *   <div data-parallax data-parallax-speed="0.3">Background layer</div>
 *   <div data-parallax data-parallax-speed="0.1">Slowest layer</div>
 *
 * Negative speed moves up, positive moves down relative to scroll.
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const elements = document.querySelectorAll('[data-parallax]');
  if (elements.length === 0) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;

    elements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.3');
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Only apply parallax when element is near viewport
      if (rect.bottom > -200 && rect.top < viewportHeight + 200) {
        const offset = (scrollY - elementTop + viewportHeight) * speed;
        const clampedOffset = Math.max(-elementHeight, Math.min(elementHeight, offset));
        el.style.transform = `translate3d(0, ${clampedOffset}px, 0)`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();
