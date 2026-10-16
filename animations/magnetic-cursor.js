/**
 * Magnetic Cursor Module — elements attract cursor on hover, transform-only, rAF-batched.
 * Usage: <button data-magnetic>...</button>  |  <a data-magnetic data-magnetic-strength="0.4">...</a>
 */
const MagneticCursor = (() => {
  let elements = []; let cursor = null; let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0; let ticking = false;
  const config = { strength: 0.3, radius: 80, cursorLerp: 0.15 };
  function onPointerMove(e) {
    mouseX = e.clientX; mouseY = e.clientY;
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const dx = mouseX - cx, dy = mouseY - cy, dist = Math.sqrt(dx * dx + dy * dy);
      const radius = parseFloat(el.dataset.magneticRadius || config.radius);
      const strength = parseFloat(el.dataset.magneticStrength || config.strength);
      if (dist < radius) { const pull = (1 - dist / radius) * strength; el._magneticX = dx * pull; el._magneticY = dy * pull; el._isHovering = true; }
      else { el._magneticX = 0; el._magneticY = 0; el._isHovering = false; }
    });
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }
  function update() {
    elements.forEach((el) => { el.style.transform = `translate3d(${el._magneticX || 0}px, ${el._magneticY || 0}px, 0)`; });
    if (cursor) { cursorX += (mouseX - cursorX) * config.cursorLerp; cursorY += (mouseY - cursorY) * config.cursorLerp; cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`; }
    const stillMoving = cursor && (Math.abs(mouseX - cursorX) > 0.5 || Math.abs(mouseY - cursorY) > 0.5);
    const stillMagnetic = elements.some((el) => el._isHovering && (Math.abs(el._magneticX) > 0.1 || Math.abs(el._magneticY) > 0.1));
    if (stillMoving || stillMagnetic) requestAnimationFrame(update); else ticking = false;
  }
  function init(options = {}) {
    Object.assign(config, options);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    elements = Array.from(document.querySelectorAll('[data-magnetic]'));
    elements.forEach((el) => { el.style.willChange = 'transform'; el.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'; el._magneticX = 0; el._magneticY = 0; el._isHovering = false; });
    cursor = document.querySelector('[data-cursor]');
    if (cursor) { cursor.style.position = 'fixed'; cursor.style.top = '0'; cursor.style.left = '0'; cursor.style.pointerEvents = 'none'; cursor.style.zIndex = '9999'; cursor.style.willChange = 'transform'; cursor.style.mixBlendMode = 'difference'; if (cursor.dataset.cursorHidden) document.body.style.cursor = 'none'; }
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }
  function destroy() { window.removeEventListener('pointermove', onPointerMove); elements.forEach((el) => { el.style.transform = ''; el.style.willChange = ''; el.style.transition = ''; }); elements = []; if (cursor) { cursor.style.transform = ''; cursor.style.willChange = ''; } cursor = null; }
  return { init, destroy };
})();
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => MagneticCursor.init());
if (typeof module !== 'undefined' && module.exports) module.exports = MagneticCursor;
