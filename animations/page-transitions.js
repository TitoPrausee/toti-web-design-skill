/**
 * Page Transitions Module — orchestrated page-to-page transitions.
 * Uses View Transitions API where available, falls back to CSS.
 * Usage: <a href="/about" data-transition="slide">About</a>  |  PageTransitions.navigate('/about', 'fade');
 */
const PageTransitions = (() => {
  const transitions = {
    fade: { out: { opacity: '0' }, in: { opacity: '0' }, inEnd: { opacity: '1' }, duration: 400 },
    slide: { out: { transform: 'translateX(-100%)', opacity: '0' }, in: { transform: 'translateX(100%)', opacity: '0' }, inEnd: { transform: 'translateX(0)', opacity: '1' }, duration: 500 },
    curtain: { out: { clipPath: 'inset(0 0 0 0)', opacity: '1' }, in: { clipPath: 'inset(0 0 100% 0)', opacity: '0' }, inEnd: { clipPath: 'inset(0 0 0 0)', opacity: '1' }, duration: 600 },
    scale: { out: { transform: 'scale(0.95)', opacity: '0' }, in: { transform: 'scale(1.05)', opacity: '0' }, inEnd: { transform: 'scale(1)', opacity: '1' }, duration: 500 },
  };
  function supportsVT() { return typeof document !== 'undefined' && 'startViewTransition' in document; }
  function animateEl(el, props, duration) {
    return new Promise((resolve) => {
      const t = Object.keys(props).map((k) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()} ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`).join(', ');
      el.style.transition = t; Object.assign(el.style, props); setTimeout(resolve, duration);
    });
  }
  function navigate(url, type = 'fade') {
    const tr = transitions[type] || transitions.fade;
    const main = document.querySelector('main') || document.body;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { window.location.href = url; return; }
    if (!supportsVT()) { animateEl(main, tr.out, tr.duration).then(() => { window.location.href = url; }); return; }
    document.startViewTransition(() => {});
    setTimeout(() => { window.location.href = url; }, tr.duration);
  }
  function handleClick(e) {
    const link = e.target.closest('[data-transition]'); if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); navigate(href, link.dataset.transition || 'fade');
  }
  function init() {
    if (typeof document === 'undefined') return;
    document.addEventListener('click', handleClick);
    const inType = document.body.dataset.pageTransitionIn;
    if (inType) { const tr = transitions[inType] || transitions.fade; const main = document.querySelector('main') || document.body; Object.assign(main.style, tr.in); requestAnimationFrame(() => { animateEl(main, tr.inEnd, tr.duration); }); }
  }
  function destroy() { if (typeof document !== 'undefined') document.removeEventListener('click', handleClick); }
  return { init, destroy, navigate };
})();
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => PageTransitions.init());
if (typeof module !== 'undefined' && module.exports) module.exports = PageTransitions;
