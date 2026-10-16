/**
 * Parallax Effect Module — depth parallax on scroll, transform-only, rAF-throttled.
 * Usage: <div data-parallax="0.3">...</div>  |  <div data-parallax="-0.5">...</div>
 */
const Parallax = (() => {
  let ticking = false; let elements = []; let scrollY = 0;
  const config = { axis: 'y', smooth: true, smoothFactor: 0.1 };
  function update() {
    scrollY = window.scrollY || window.pageYOffset;
    elements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || '0.2');
      const axis = el.dataset.parallaxAxis || config.axis;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
      const offset = (scrollY - (rect.top + scrollY) + window.innerHeight) * speed;
      el.style.transform = axis === 'x' ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  }
  function onScroll() { if (!ticking) { requestAnimationFrame(update); ticking = true; } }
  function init(options = {}) {
    Object.assign(config, options);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    elements = Array.from(document.querySelectorAll('[data-parallax]'));
    elements.forEach((el) => { el.style.willChange = 'transform'; });
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }
  function destroy() { window.removeEventListener('scroll', onScroll); elements.forEach((el) => { el.style.transform = ''; el.style.willChange = ''; }); elements = []; }
  return { init, destroy, update };
})();
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => Parallax.init());
if (typeof module !== 'undefined' && module.exports) module.exports = Parallax;
