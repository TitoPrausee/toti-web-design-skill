/**
 * Scroll-Driven Animations (Intersection Observer)
 * Reveals elements as they enter the viewport. GPU-accelerated, passive listener.
 * Usage: <div data-reveal="up">...</div>  | <div data-reveal="fade" data-reveal-delay="100">...</div>
 */
const ScrollReveal = (() => {
  let observer = null;
  const elements = [];
  const config = { threshold: 0.15, rootMargin: '0px 0px -10% 0px', once: true };
  const transitions = {
    up: 'translateY(40px)', down: 'translateY(-40px)', left: 'translateX(40px)',
    right: 'translateX(-40px)', scale: 'scale(0.92)', fade: 'none', blur: 'blur(10px)',
    rotate: 'rotate(-3deg) scale(0.95)',
  };
  function setup(el) {
    const type = el.dataset.reveal || 'up';
    const delay = parseInt(el.dataset.revealDelay || '0', 10);
    const transform = transitions[type] || transitions.up;
    el.style.opacity = '0';
    if (transform !== 'none') el.style.transform = transform;
    if (type === 'blur') el.style.filter = 'blur(10px)';
    el.style.transition = `opacity 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, filter 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;
    el.style.willChange = 'opacity, transform';
  }
  function reveal(el) { el.style.opacity = '1'; el.style.transform = 'none'; el.style.filter = 'none'; }
  function onIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { reveal(entry.target); if (config.once) observer.unobserve(entry.target); }
      else if (!config.once) setup(entry.target);
    });
  }
  function init(options = {}) {
    Object.assign(config, options);
    elements.length = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) { document.querySelectorAll('[data-reveal]').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; }); return; }
    document.querySelectorAll('[data-reveal]').forEach((el) => { setup(el); elements.push(el); });
    observer = new IntersectionObserver(onIntersect, { threshold: config.threshold, rootMargin: config.rootMargin });
    elements.forEach((el) => observer.observe(el));
  }
  function destroy() { if (observer) { observer.disconnect(); observer = null; } elements.forEach((el) => { el.style.opacity = ''; el.style.transform = ''; el.style.filter = ''; el.style.transition = ''; el.style.willChange = ''; }); }
  return { init, destroy };
})();
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => ScrollReveal.init());
if (typeof module !== 'undefined' && module.exports) module.exports = ScrollReveal;
