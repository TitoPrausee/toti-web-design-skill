/**
 * Scroll Reveal — Intersection Observer based reveal patterns
 * Reveals elements on scroll with staggered timing. GPU-accelerated, passive listeners.
 *
 * Usage:
 *   <div data-reveal="up">Content</div>
 *   <div data-reveal="fade">Content</div>
 *   <div data-reveal="scale">Content</div>
 *   <div data-reveal="left">Content</div>
 *   <div data-reveal="right">Content</div>
 *
 * Stagger: add data-reveal-delay="100" (ms)
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealStyles = {
    up: { initial: 'translateY(40px)', visible: 'translateY(0)' },
    down: { initial: 'translateY(-40px)', visible: 'translateY(0)' },
    left: { initial: 'translateX(-40px)', visible: 'translateX(0)' },
    right: { initial: 'translateX(40px)', visible: 'translateX(0)' },
    fade: { initial: 'none', visible: 'none' },
    scale: { initial: 'scale(0.9)', visible: 'scale(1)' }
  };

  // Inject base styles
  const style = document.createElement('style');
  style.textContent = `
    [data-reveal] {
      opacity: 0;
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    [data-reveal].is-visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  // Apply initial transform
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const type = el.getAttribute('data-reveal') || 'up';
    const pattern = revealStyles[type] || revealStyles.up;
    if (pattern.initial !== 'none') {
      el.style.transform = pattern.initial;
    }
    if (prefersReducedMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });

  if (prefersReducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        const type = el.getAttribute('data-reveal') || 'up';
        const pattern = revealStyles[type] || revealStyles.up;

        setTimeout(() => {
          el.classList.add('is-visible');
          if (pattern.visible !== 'none') {
            el.style.transform = pattern.visible;
          }
        }, delay);

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();
