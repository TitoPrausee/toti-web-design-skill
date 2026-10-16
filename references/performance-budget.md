# Performance Budget

Performance IS design. A beautiful site that loads slowly is a failed site. Award-winning sites maintain visual richness without sacrificing speed.

## Targets

| Metric | Target | Excellent |
|--------|--------|-----------|
| Lighthouse Performance | 95+ | 100 |
| LCP (Largest Contentful Paint) | < 2.5s | < 1.5s |
| INP (Interaction to Next Paint) | < 100ms | < 50ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0 |
| FCP (First Contentful Paint) | < 1.8s | < 1s |
| TBT (Total Blocking Time) | < 200ms | < 100ms |
| Total JS payload (gzipped) | < 200KB | < 100KB |
| Total page weight | < 1MB | < 500KB |
| Animation frame rate | 60fps | 60fps |

## Core Web Vitals Strategy

### LCP Optimization

The LCP element is usually the hero image or hero text. Optimize it first.

```html
<!-- Preload the hero image -->
<link rel="preload" as="image" href="/img/hero.webp"
      fetchpriority="high" imagesrcset="/img/hero-480.webp 480w, /img/hero-1024.webp 1024w, /img/hero-1920.webp 1920w"
      imagesizes="100vw">

<!-- Use AVIF with WebP fallback -->
<picture>
  <source type="image/avif" srcset="/img/hero-480.avif 480w, /img/hero-1024.avif 1024w, /img/hero-1920.avif 1920w" sizes="100vw">
  <source type="image/webp" srcset="/img/hero-480.webp 480w, /img/hero-1024.webp 1024w, /img/hero-1920.webp 1920w" sizes="100vw">
  <img src="/img/hero-1920.jpg" alt="Hero" width="1920" height="1080" fetchpriority="high">
</picture>
```

### CLS Prevention

```css
/* Reserve space for images and embeds */
img, video, iframe {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;  /* Set explicit ratio */
}

/* Reserve space for dynamic content */
.ad-slot {
  min-height: 250px;
}

/* Font loading without FOUT/FOIT */
@font-face {
  font-family: 'Display';
  src: url('/fonts/display.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%;
  ascent-override: 100%;
  descent-override: 0%;
  line-gap-override: 0%;
}
```

### INP Optimization

```javascript
// Break up long tasks
function yieldToMain() {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

async function processItems(items) {
  for (const item of items) {
    processItem(item);
    // Yield every 5ms to keep UI responsive
    if (performance.now() % 5 < 1) {
      await yieldToMain();
    }
  }
}

// Use scheduler API if available
if ('scheduler' in window) {
  await scheduler.postTask(() => processItem(item), { priority: 'user-visible' });
}
```

## Rendering Optimization

### content-visibility: auto

Skips rendering for off-screen content. Massive initial load gain.

```css
.below-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 600px;  /* Estimate height to prevent scrollbar jump */
}
```

### CSS contain

Isolates component rendering so changes in one component don't trigger layout in others.

```css
.isolated-component {
  contain: layout style paint;
}

/* For frequently-updating components */
.dynamic-component {
  contain: layout style;
  will-change: transform;
}
```

### will-change

```css
/* Set BEFORE animation starts, remove AFTER it ends */
.animated-element {
  /* Don't leave this permanently — it wastes GPU memory */
  will-change: transform, opacity;
}

/* Better: set via JS only during animation */
// element.style.willChange = 'transform, opacity';
// ... after animation ...
// element.style.willChange = 'auto';
```

## Lazy Loading

### Images

```html
<!-- Native lazy loading -->
<img src="image.webp" loading="lazy" decoding="async" width="800" height="600" alt="...">

<!-- Responsive -->
<img
  srcset="image-480.webp 480w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px"
  src="image-800.webp"
  loading="lazy"
  decoding="async"
  width="1200" height="800"
  alt="..."
>
```

### JavaScript Libraries

```javascript
// Dynamic import — loads library only when needed
async function initScrollAnimations() {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  // Initialize animations
}

// Trigger when section enters viewport
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    initScrollAnimations();
    observer.disconnect();
  }
}, { rootMargin: '200px' });

observer.observe(document.querySelector('.animated-section'));
```

### Fonts

```html
<!-- Preload critical fonts -->
<link rel="preload" as="font" href="/fonts/body.woff2" type="font/woff2" crossorigin>

<!-- Use font-display: swap -->
<style>
  @font-face {
    font-family: 'Body';
    src: url('/fonts/body.woff2') format('woff2');
    font-display: swap;
  }
</style>
```

## Image Optimization

```html
<picture>
  <!-- AVIF (smallest, modern browsers) -->
  <source type="image/avif" srcset="img-480.avif 480w, img-800.avif 800w, img-1200.avif 1200w" sizes="(max-width: 600px) 480px, 800px">
  <!-- WebP (good compression, wide support) -->
  <source type="image/webp" srcset="img-480.webp 480w, img-800.webp 800w, img-1200.webp 1200w" sizes="(max-width: 600px) 480px, 800px">
  <!-- JPEG fallback -->
  <img src="img-800.jpg" loading="lazy" decoding="async" width="1200" height="800" alt="Description">
</picture>
```

## Animation Performance

### What to Animate

```css
/* GOOD — composited on GPU */
.animated {
  transition: transform 0.5s ease, opacity 0.5s ease;
  transform: translate3d(0, 0, 0);  /* Force GPU layer */
  opacity: 1;
}

/* BAD — triggers layout/paint */
.bad-animated {
  transition: top 0.5s, left 0.5s, width 0.5s, height 0.5s, margin 0.5s;
}
```

### Reduce Work on Mobile

```javascript
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isLowPower = navigator.hardwareConcurrency <= 4;

// Reduce particle counts
const particleCount = isMobile ? 500 : 5000;

// Disable heavy effects
if (!isReducedMotion && !isLowPower) {
  initParallax();
  initWebGL();
}

// Use simpler animations on mobile
if (isMobile) {
  // CSS-only reveal instead of GSAP
  document.documentElement.classList.add('mobile-animations');
}
```

## Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --collect.url=http://localhost:3000 --collect.numberOfRuns=3
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_TOKEN }}
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```
