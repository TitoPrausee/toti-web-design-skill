/**
 * Text Reveal — Split text into words/chars and reveal with stagger
 * Intersection Observer triggered, CSS transitions, GPU-accelerated.
 *
 * Usage:
 *   <h1 data-text-reveal="words">Hello World</h1>
 *   <p data-text-reveal="chars">Character level</p>
 *   <div data-text-reveal="lines">Line level</div>
 *
 * Accessibility: aria-label on parent with full text, aria-hidden on split spans.
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    [data-text-reveal] .tr-word {
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
    }
    [data-text-reveal] .tr-word > span {
      display: inline-block;
      transform: translateY(110%);
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-text-reveal].is-visible .tr-word > span {
      transform: translateY(0);
    }
    [data-text-reveal] .tr-char {
      display: inline-block;
      opacity: 0;
      transform: translateY(0.3em) rotate(5deg);
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-text-reveal].is-visible .tr-char {
      opacity: 1;
      transform: translateY(0) rotate(0);
    }
    [data-text-reveal] .tr-line {
      display: block;
      overflow: hidden;
    }
    [data-text-reveal] .tr-line > span {
      display: block;
      transform: translateY(100%);
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-text-reveal].is-visible .tr-line > span {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const elements = document.querySelectorAll('[data-text-reveal]');

  elements.forEach(el => {
    const mode = el.getAttribute('data-text-reveal') || 'words';
    const originalText = el.textContent.trim();

    // Preserve aria-label for accessibility
    el.setAttribute('aria-label', originalText);

    if (mode === 'words') {
      const words = originalText.split(/\s+/);
      el.innerHTML = words.map((word, i) =>
        `<span class="tr-word" aria-hidden="true"><span style="transition-delay: ${i * 50}ms">${word}</span></span>`
      ).join(' ');
    } else if (mode === 'chars') {
      const chars = originalText.split('');
      el.innerHTML = chars.map((char, i) =>
        char === ' ' ? ' ' :
        `<span class="tr-char" aria-hidden="true" style="transition-delay: ${i * 20}ms">${char}</span>`
      ).join('');
    } else if (mode === 'lines') {
      // Wrap text in a span, then split by explicit line breaks or fixed width
      const lines = wrapLines(el);
      el.innerHTML = lines.map((line, i) =>
        `<span class="tr-line" aria-hidden="true"><span style="transition-delay: ${i * 100}ms">${line}</span></span>`
      ).join('');
    }

    if (prefersReducedMotion) {
      el.classList.add('is-visible');
    }
  });

  function wrapLines(el) {
    // Simple approach: split by <br> or natural line breaks
    const text = el.textContent.trim();
    const brs = el.querySelectorAll('br');
    if (brs.length > 0) {
      return text.split('\n').map(l => l.trim()).filter(Boolean);
    }
    // Fallback: treat entire text as one line
    return [text];
  }

  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -15% 0px'
  });

  elements.forEach(el => observer.observe(el));
})();
