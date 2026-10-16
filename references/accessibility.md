# Accessibility

Accessibility coexists with beauty. An inaccessible site cannot win Awwwards. All patterns in this skill must respect accessibility.

## prefers-reduced-motion

The most critical accessibility consideration for animation-heavy sites.

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable smooth scroll */
  html { scroll-behavior: auto; }

  /* Reduce transitions to instant */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Hide custom cursor */
  [data-cursor] { display: none !important; }
  * { cursor: auto !important; }

  /* Hide decorative animations */
  .marquee, .parallax, .webgl-canvas { display: none !important; }
}
```

```javascript
// Check in JavaScript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  initSmoothScroll();
  initGSAPAnimations();
  if (!isMobile) initCustomCursor();
}

// Respect in WebGL
if (!prefersReducedMotion) {
  initParticles();
} else {
  // Show static image instead
  showFallbackImage();
}
```

## Custom Cursor Accessibility

```html
<!-- Custom cursor must be aria-hidden -->
<div data-cursor aria-hidden="true"></div>

<!-- Ensure native cursor is restored for keyboard users -->
```

```css
/* Only hide native cursor on devices that support hover */
@media (hover: hover) and (pointer: fine) {
  * { cursor: none; }
}

/* Always restore cursor when reduced motion is preferred */
@media (prefers-reduced-motion: reduce) {
  [data-cursor] { display: none; }
  * { cursor: auto; }
}
```

## Split Text Accessibility

When splitting text into characters/words/lines for animation, screen readers lose the original text. Always preserve it.

```html
<h1 aria-label="We build award-winning websites" class="hero-title">
  We build award-winning websites
</h1>
```

```javascript
import SplitType from 'split-type';

// SplitType preserves aria-label automatically
const text = new SplitType('.hero-title', {
  types: 'chars, words',
  aria: true  // Sets aria-hidden on created spans
});
```

```css
/* Hide the split spans from screen readers */
.hero-title [class*="char"],
.hero-title [class*="word"] {
  aria-hidden: true;  /* Set via JS, not CSS */
}
```

## Focus States

Never remove focus outlines. Style them to match your design.

```css
/* Remove default but replace with custom */
*:focus { outline: none; }

*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: 2px;
}

/* For elements that need different focus styling */
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: 1rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  text-decoration: none;
  z-index: 10000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}
```

## Keyboard Navigation

```html
<!-- All interactive elements must be keyboard accessible -->
<button>Clickable</button>  <!-- Native: works by default -->
<a href="#">Link</a>  <!-- Native: works by default -->

<!-- Custom interactive elements need tabindex and role -->
<div
  role="button"
  tabindex="0"
  data-custom-interactive
  aria-label="Open gallery"
>
  Click me
</div>
```

```javascript
// Handle keyboard activation for custom elements
document.querySelectorAll('[role="button"]').forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });
});

// Trap focus in overlay menus (see navigation-patterns.md)
// Escape key closes overlays (see navigation-patterns.md)
```

## ARIA

```html
<!-- Live regions for dynamic content -->
<div aria-live="polite" class="sr-only" id="status"></div>

<!-- Loading state -->
<button aria-busy="true">Loading...</button>

<!-- Expandable sections -->
<button aria-expanded="false" aria-controls="content" data-toggle>
  Toggle
</button>
<div id="content" aria-hidden="true">
  Content
</div>
```

```javascript
const toggle = document.querySelector('[data-toggle]');
const content = document.getElementById('content');

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', !isOpen);
  content.setAttribute('aria-hidden', isOpen);
});
```

## Screen Reader Only Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: inherit;
}
```

## Color Contrast

WCAG AA minimum:
- Normal text: 4.5:1 contrast ratio
- Large text (18px+ or 14px+ bold): 3:1
- UI components and graphics: 3:1

```css
/* Dark theme — ensure sufficient contrast */
:root {
  --bg: #0A0A0A;       /* Contrast with text: 15.5:1 */
  --text: #E8E8E8;
  --text-muted: #A0A0A0; /* Contrast with bg: 7.5:1 */
  --accent: #578bfc;    /* Contrast with bg: 5.2:1 */
}

/* Never use low-contrast decorative text as content */
.bad { color: #555; background: #0A0A0A; }  /* Only 2.3:1 — fails */
```

## Semantic HTML

Creative layouts must not sacrifice semantics. The visual order can differ from the DOM order, but the DOM must be logical.

```html
<!-- BAD: div soup -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>

<!-- GOOD: semantic -->
<header>
  <nav aria-label="Main">
    <a href="/">Home</a>
  </nav>
</header>
```

## Reduced Data

```css
@media (prefers-reduced-data: reduce) {
  /* Disable images, use solid colors */
  img { display: none; }
  .hero-image { background: var(--surface); }

  /* Disable fonts, use system fonts */
  @font-face { font-display: optional; }
}
```
