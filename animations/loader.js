/**
 * Loader Animation Module — preloader with progress tracking.
 * Usage: <div data-loader><div data-loader-bar></div><div data-loader-text>0%</div></div>
 */
const Loader = (() => {
  let loader = null, bar = null, text = null, progress = 0, rafId = null, startTime = 0;
  const config = { duration: 1500, minDisplayTime: 600, barSelector: '[data-loader-bar]', textSelector: '[data-loader-text]', exitAnimation: 'slide-up' };
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function updateProgress() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / config.duration, 1);
    const eased = easeOutCubic(t);
    progress = Math.round(eased * 100);
    if (bar) bar.style.transform = `scaleX(${eased})`;
    if (text) text.textContent = `${progress}%`;
    if (t < 1) rafId = requestAnimationFrame(updateProgress); else complete();
  }
  function complete() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(config.minDisplayTime - elapsed, 0);
    setTimeout(() => {
      if (!loader) return;
      const exits = { 'slide-up': { transform: 'translateY(-100%)' }, 'slide-down': { transform: 'translateY(100%)' }, fade: { opacity: '0' }, scale: { transform: 'scale(1.1)', opacity: '0' } };
      loader.style.transition = 'transform 600ms cubic-bezier(0.77, 0, 0.175, 1), opacity 400ms ease';
      Object.assign(loader.style, exits[config.exitAnimation] || exits['slide-up']);
      setTimeout(() => { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); document.body.style.overflow = ''; }, 600);
    }, remaining);
  }
  function init(options = {}) {
    Object.assign(config, options);
    loader = document.querySelector('[data-loader]'); if (!loader) return;
    bar = loader.querySelector(config.barSelector); text = loader.querySelector(config.textSelector);
    if (bar) { bar.style.transformOrigin = 'left'; bar.style.transform = 'scaleX(0)'; bar.style.transition = 'transform 100ms linear'; }
    document.body.style.overflow = 'hidden'; startTime = Date.now(); rafId = requestAnimationFrame(updateProgress);
  }
  function destroy() { if (rafId) cancelAnimationFrame(rafId); if (loader && loader.parentNode) loader.parentNode.removeChild(loader); document.body.style.overflow = ''; }
  return { init, destroy };
})();
if (typeof document !== 'undefined') window.addEventListener('load', () => Loader.init());
if (typeof module !== 'undefined' && module.exports) module.exports = Loader;
