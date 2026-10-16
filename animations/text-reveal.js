/**
 * Text Reveal Module — splits text into words/chars, staggers reveal on scroll.
 * Usage: <h1 data-text-reveal="words">Heading</h1>  |  <p data-text-reveal="chars" data-text-stagger="30">Text</p>
 */
const TextReveal = (() => {
  let observer = null; let elements = [];
  const config = { threshold: 0.3, rootMargin: '0px 0px -5% 0px', once: true, defaultStagger: 50, defaultDuration: 800 };
  function splitText(el) {
    const type = el.dataset.textReveal || 'words';
    const text = el.textContent;
    const stagger = parseInt(el.dataset.textStagger || config.defaultStagger, 10);
    const duration = parseInt(el.dataset.textDuration || config.defaultDuration, 10);
    el.dataset.originalText = text;
    let parts = [];
    if (type === 'chars') parts = text.split('');
    else if (type === 'words') parts = text.split(/(\s+)/);
    else if (type === 'lines') parts = text.split('\n').filter((l) => l.trim());
    el.innerHTML = '';
    let charIndex = 0;
    parts.forEach((part) => {
      if (part.trim() === '') { el.appendChild(document.createTextNode(part)); return; }
      const span = document.createElement('span');
      const inner = document.createElement('span');
      if (type === 'chars') {
        span.style.display = 'inline-block'; span.style.opacity = '0';
        span.style.transform = 'translateY(20px) rotateZ(5deg)';
        span.style.transition = `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charIndex * stagger}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charIndex * stagger}ms`;
        span.textContent = part; el.appendChild(span);
      } else {
        span.style.display = type === 'lines' ? 'block' : 'inline-block';
        span.style.overflow = 'hidden'; span.style.verticalAlign = 'top';
        inner.style.display = 'inline-block'; inner.style.transform = 'translateY(110%)';
        inner.style.transition = `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charIndex * stagger}ms`;
        inner.textContent = part; span.appendChild(inner); el.appendChild(span);
      }
      charIndex++;
    });
    el._splitParts = Array.from(el.querySelectorAll('span > span, span'));
    el._isSplit = true;
  }
  function reveal(el) {
    if (!el._isSplit) return;
    el._splitParts.forEach((part) => {
      if (part.tagName === 'SPAN' && part.children.length > 0) { const inner = part.querySelector('span') || part; inner.style.transform = 'translateY(0)'; inner.style.opacity = '1'; }
      else { part.style.transform = 'translateY(0) rotateZ(0)'; part.style.opacity = '1'; }
    });
  }
  function onIntersect(entries) { entries.forEach((entry) => { if (entry.isIntersecting) { reveal(entry.target); if (config.once) observer.unobserve(entry.target); } }); }
  function init(options = {}) {
    Object.assign(config, options); elements = [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-text-reveal]').forEach((el) => { if (prefersReducedMotion) return; splitText(el); elements.push(el); });
    if (prefersReducedMotion || elements.length === 0) return;
    observer = new IntersectionObserver(onIntersect, { threshold: config.threshold, rootMargin: config.rootMargin });
    elements.forEach((el) => observer.observe(el));
  }
  function destroy() { if (observer) { observer.disconnect(); observer = null; } elements.forEach((el) => { if (el.dataset.originalText) el.textContent = el.dataset.originalText; delete el._isSplit; delete el._splitParts; }); elements = []; }
  return { init, destroy };
})();
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => TextReveal.init());
if (typeof module !== 'undefined' && module.exports) module.exports = TextReveal;
