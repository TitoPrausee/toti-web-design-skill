# Performance Budgets & Optimization

Detailed performance targets and optimization strategies based on awwwards.com winner analysis.

## Core Web Vitals Targets

| Metric | Target | Awwwards Winner Average | Measurement |
|--------|--------|------------------------|-------------|
| LCP (Largest Contentful Paint) | < 1.8s | 1.6s | Field + Lab |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.02 | Field + Lab |
| INP (Interaction to Next Paint) | < 100ms | 45ms | Field |
| FCP (First Contentful Paint) | < 1.2s | 1.0s | Lab |
| TTFB (Time to First Byte) | < 600ms | 400ms | Field |

## Lighthouse Scores

| Category | Target | Winner Average |
|----------|--------|---------------|
| Performance | 95+ | 96 |
| Accessibility | 95+ | 97 |
| Best Practices | 95+ | 98 |
| SEO | 95+ | 96 |

## Resource Budgets

### JavaScript
| Resource | Budget | Strategy |
|----------|--------|----------|
| Initial JS bundle | < 150KB gzipped | Code-split, tree-shake |
| GSAP core | ~30KB gzipped | Import only needed plugins |
| Three.js | ~150KB gzipped | Lazy load, use import maps |
| Animation modules | < 5KB each | Load on demand per page |

### CSS
| Resource | Budget | Strategy |
|----------|--------|----------|
| Critical CSS | < 14KB | Inline above-the-fold |
| Full CSS | < 30KB | Async load non-critical |

### Images
| Resource | Budget | Strategy |
|----------|--------|----------|
| Initial image payload | < 500KB | AVIF/WebP, responsive srcset |
| Hero image | < 200KB | Preload, optimized format |
| Gallery images | Lazy loaded | Intersection Observer, blur-up placeholder |

### Fonts
| Resource | Budget | Strategy |
|----------|--------|----------|
| Variable font | < 100KB | Subset, woff2 |
| Font families | 1-2 max | Variable font covers all weights |

## Optimization Strategies

### Rendering Performance

1. **GPU-accelerated properties only**
   - Use `transform` and `opacity` for animations
   - Never animate `width`, `height`, `top`, `left`
   - Use `will-change` on animating elements (sparingly)

2. **requestAnimationFrame batching**
   - Batch all scroll-driven updates in a single rAF callback
   - Never use `setTimeout` for animation
   - Use passive event listeners for scroll/touch

3. **Intersection Observer over scroll events**
   - IO is more performant than scroll listeners
   - Use `rootMargin` to pre-trigger reveals
   - `unobserve` after reveal if `once: true`

### Loading Performance

1. **Server-side rendering**
   - SSR the initial paint for instant LCP
   - Hydrate client-side for interactivity
   - Use streaming SSR where available

2. **Resource hints**
   ```html
   <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preload" href="/hero.jpg" as="image">
   <link rel="prefetch" href="/next-page-data.json">
   ```

3. **Font loading**
   ```css
   @font-face {
     font-family: 'Inter Tight';
     src: url('/fonts/inter-tight-var.woff2') format('woff2-variations');
     font-weight: 100 900;
     font-display: swap;
   }
   ```

4. **Image loading**
   ```html
   <img src="/hero.avif"
        srcset="/hero-480.avif 480w, /hero-800.avif 800w, /hero-1200.avif 1200w"
        sizes="(max-width: 768px) 100vw, 50vw"
        width="1200" height="800"
        alt="Hero"
        fetchpriority="high">
   ```

### WebGL Performance

1. **DPR capping**
   ```js
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   ```

2. **Pause when hidden**
   ```js
   document.addEventListener('visibilitychange', () => {
     if (document.hidden) cancelAnimationFrame(rafId);
     else rafId = requestAnimationFrame(animate);
   });
   ```

3. **Mobile detection**
   ```js
   const isMobile = window.matchMedia('(max-width: 768px)').matches;
   const particleCount = isMobile ? 500 : 2000;
   ```

4. **Context attributes**
   ```js
   const gl = canvas.getContext('webgl', {
     powerPreference: 'high-performance',
     antialias: window.devicePixelRatio < 2,
   });
   ```

### Bundle Optimization

1. **Code-split animation modules**
   ```js
   // Load animations only when needed
   if (document.querySelector('[data-text-reveal]')) {
     import('./animations/text-reveal.js');
   }
   ```

2. **Tree-shake GSAP**
   ```js
   // Only import what you use
   import { gsap } from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';
   gsap.registerPlugin(ScrollTrigger);
   ```

3. **CSS optimization**
   - Use CSS Custom Properties (zero runtime cost)
   - Purge unused CSS
   - Inline critical CSS

### Progressive Enhancement

1. **Content first**
   - All content in HTML (accessible without JS)
   - WebGL is an enhancement layer, not the content
   - Cartier 365 pattern: HTML content + progressive WebGL

2. **Feature detection**
   ```js
   if ('IntersectionObserver' in window) {
     // Use scroll-driven animations
   } else {
     // Fallback: show everything
   }
   ```

3. **Reduced motion**
   ```js
   if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
     // Skip all animations, show content immediately
   }
   ```

## Monitoring

### Field Data (RUM)
- Core Web Vitals via Chrome UX Report or custom RUM
- Real device performance (not just lab)
- Track 75th percentile, not average

### Lab Data
- Lighthouse CI in GitHub Actions (this repo)
- WebPageTest for waterfall analysis
- Chrome DevTools Performance tab for frame analysis

### Continuous Monitoring
- Lighthouse CI runs on every PR
- Performance regression detection
- Bundle size monitoring
