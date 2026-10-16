/**
 * Image Reveal Module — reveals images with clip-path / mask / scale entrance.
 * Usage: <div data-image-reveal="clip"><img src="..." alt="..."></div>
 */
const ImageReveal = (() => {
  let observer = null; let elements = [];
  const config = { threshold: 0.2, rootMargin: '0px 0px -5% 0px', once: true, duration: 1000 };
  const revealTypes = {
    clip: { setup: (el, img, d, delay) => { el.style.clipPath = 'inset(0 0 100% 0)'; el.style.transition = `clip-path ${d}ms cubic-bezier(0.77, 0, 0.175, 1) ${delay}ms`; if (img) { img.style.transform = 'scale(1.3)'; img.style.transition = `transform ${d * 1.5}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`; } }, reveal: (el, img) => { el.style.clipPath = 'inset(0 0 0 0)'; if (img) img.style.transform = 'scale(1)'; } },
    scale: { setup: (el, img, d, delay) => { if (img) { img.style.transform = 'scale(1.25)'; img.style.opacity = '0'; img.style.transition = `transform ${d * 1.5}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity ${d}ms ease ${delay}ms`; } }, reveal: (el, img) => { if (img) { img.style.transform = 'scale(1)'; img.style.opacity = '1'; } } },
    mask: { setup: (el, img, d, delay) => { el.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)'; el.style.transition = `clip-path ${d}ms cubic-bezier(0.77, 0, 0.175, 1) ${delay}ms`; if (img) { img.style.transform = 'scale(1.2)'; img.style.transition = `transform ${d * 1.5}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`; } }, reveal: (el, img) => { el.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'; if (img) img.style.transform = 'scale(1)'; } },
    fade: { setup: (el, img, d, delay) => { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = `opacity ${d}ms ease ${delay}ms, transform ${d}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`; }, reveal: (el, img) => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; } },
  };
  function setup(el) { const type = el.dataset.imageReveal || 'clip'; const delay = parseInt(el.dataset.revealDelay || '0', 10); const duration = parseInt(el.dataset.revealDuration || config.duration, 10); const img = el.querySelector('img'); el.style.overflow = 'hidden'; el.style.willChange = 'clip-path, opacity, transform'; (revealTypes[type] || revealTypes.clip).setup(el, img, duration, delay); }
  function reveal(el) { const type = el.dataset.imageReveal || 'clip'; const img = el.querySelector('img'); (revealTypes[type] || revealTypes.clip).reveal(el, img); }
  function onIntersect(entries) { entries.forEach((entry) => { if (entry.isIntersecting) { reveal(entry.target); if (config.once) observer.unobserve(entry.target); } }); }
  function init(options = {}) {
    Object.assign(config, options); elements = [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('[data-image-reveal]').forEach((el) => { setup(el); elements.push(el); });
    if (elements.length === 0) return;
    observer = new IntersectionObserver(onIntersect, { threshold: config.threshold, rootMargin: config.rootMargin });
    elements.forEach((el) => observer.observe(el));
  }
  function destroy() { if (observer) { observer.disconnect(); observer = null; } elements.forEach((el) => { el.style.clipPath = ''; el.style.opacity = ''; el.style.transform = ''; el.style.transition = ''; el.style.willChange = ''; const img = el.querySelector('img'); if (img) { img.style.transform = ''; img.style.opacity = ''; img.style.transition = ''; } }); elements = []; }
  return { init, destroy };
})();
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => ImageReveal.init());
if (typeof module !== 'undefined' && module.exports) module.exports = ImageReveal;
