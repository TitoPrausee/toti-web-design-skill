/**
 * Magnetic Cursor — Elements that attract toward cursor on hover
 * Uses spring physics, rAF batching, transform-only for GPU acceleration.
 *
 * Usage:
 *   <button data-magnetic data-magnetic-strength="0.3">Hover me</button>
 *   <div data-magnetic-cursor></div> (custom cursor element, optional)
 *
 * The cursor follows the mouse with a slight delay for a liquid feel.
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // ---- Custom cursor (optional) ----
  const cursorEl = document.querySelector('[data-magnetic-cursor]');
  if (cursorEl) {
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.style.cssText = `
      position: fixed; top: 0; left: 0; width: 24px; height: 24px;
      border-radius: 50%; background: var(--color-accent, #578bfc);
      pointer-events: none; z-index: 9999; mix-blend-mode: difference;
      transform: translate(-50%, -50%); transition: transform 0.15s ease, width 0.3s, height 0.3s;
      will-change: transform;
    `;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      requestAnimationFrame(updateCursor);
      ticking = true;
    }
  }, { passive: true });

  function updateCursor() {
    if (cursorEl) {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursorEl.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    }
    ticking = false;
  }

  // ---- Magnetic elements ----
  const magneticElements = document.querySelectorAll('[data-magnetic]');

  magneticElements.forEach(el => {
    const strength = parseFloat(el.getAttribute('data-magnetic-strength') || '0.3');
    let elTicking = false;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    function animate() {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        requestAnimationFrame(animate);
      } else {
        elTicking = false;
      }
    }

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetX = (e.clientX - centerX) * strength;
      targetY = (e.clientY - centerY) * strength;

      if (!elTicking) {
        requestAnimationFrame(animate);
        elTicking = true;
      }
    });

    el.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!elTicking) {
        requestAnimationFrame(animate);
        elTicking = true;
      }
    });

    // Cursor grow on hover
    if (cursorEl) {
      el.addEventListener('mouseenter', () => {
        cursorEl.style.width = '48px';
        cursorEl.style.height = '48px';
      });
      el.addEventListener('mouseleave', () => {
        cursorEl.style.width = '24px';
        cursorEl.style.height = '24px';
      });
    }
  });
})();
