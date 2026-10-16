# Animations

Motion is the deliverable, not polish. The hierarchy of attention is set by what moves, not what is biggest.

## Animation Stack

| Tool | Purpose | Size |
|------|---------|------|
| GSAP + ScrollTrigger | Scroll-bound timelines, complex sequences | ~60KB |
| Lenis | Smooth scroll (lightweight, performant) | ~6KB |
| Motion (formerly Framer Motion) | React component-level interactions | ~30KB |
| SplitType | Text splitting for kinetic typography | ~4KB |
| Barba.js | Multi-page transitions | ~7KB |

## Scroll-Triggered Animations

The foundation of immersive web experiences. Elements animate in response to scroll position.

### Reveal on Enter (Intersection Observer — No Library)

```javascript
// Lightweight, no dependencies
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);  // Animate once
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px'
});

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
[data-reveal-stagger] > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-reveal-stagger].revealed > *:nth-child(1) { transition-delay: 0ms; }
[data-reveal-stagger].revealed > *:nth-child(2) { transition-delay: 80ms; }
[data-reveal-stagger].revealed > *:nth-child(3) { transition-delay: 160ms; }
[data-reveal-stagger].revealed > *:nth-child(4) { transition-delay: 240ms; }
[data-reveal-stagger].revealed > *:nth-child(5) { transition-delay: 320ms; }
```

### Scrubbed Animations (GSAP ScrollTrigger)

Animation progress tied directly to scroll position:

```javascript
gsap.registerPlugin(ScrollTrigger);

// Scrubbed parallax
gsap.to('.parallax-bg', {
  y: -200,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true  // Ties animation to scroll position
  }
});

// Pinned section with internal timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.pinned-section',
    start: 'top top',
    end: '+=2000',
    pin: true,
    scrub: 1
  }
});

tl.to('.pinned-title', { scale: 2, opacity: 0.5, duration: 1 })
  .to('.pinned-card-1', { x: '-100%', opacity: 0, duration: 0.5 })
  .to('.pinned-card-2', { x: '-100%', opacity: 1, duration: 0.5 })
  .to('.pinned-card-3', { scale: 1.5, duration: 0.5 });
```

### Horizontal Scroll Sections

```javascript
gsap.to('.horizontal-track', {
  x: () => -(document.querySelector('.horizontal-track').scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-section',
    start: 'top top',
    end: () => `+=${document.querySelector('.horizontal-track').scrollWidth}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true
  }
});
```

## Easing

Never use `linear` or default `ease`. Custom easing is the difference between amateur and professional animation.

### Award-Winning Easing Curves

```css
:root {
  /* Smooth deceleration — most common */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  /* Soft entrance with slight overshoot */
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  /* Dramatic entrance */
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
  /* Spring-like with overshoot */
  --ease-back: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  /* Smooth with personality */
  --ease-power3: cubic-bezier(0.16, 1, 0.3, 1);
}
```

```javascript
// GSAP equivalents
const eases = {
  outExpo: 'expo.out',
  outQuint: 'power4.out',
  inOutQuint: 'power4.inOut',
  back: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)'
};
```

## Lenis Smooth Scroll

```javascript
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,  // Keep native touch scroll for mobile
});

// Connect to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

## Page Transitions

### View Transitions API (Native, Chrome 111+)

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
  animation-timing-function: var(--ease-out-expo);
}
```

### Barba.js + GSAP (Multi-Page Sites)

```javascript
import barba from '@barba/core';
import gsap from 'gsap';

barba.init({
  transitions: [{
    name: 'fade',
    async leave(data) {
      await gsap.to(data.current.container, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power3.in'
      });
    },
    async enter(data) {
      gsap.from(data.next.container, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power3.out'
      });
    }
  }]
});
```

## Scroll-Driven Animations (CSS Native, 2025+)

New CSS features that tie animation progress to scroll position without JavaScript:

```css
/* Fade in as element enters viewport */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.scroll-reveal {
  animation: fade-in linear forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 50%;
}

/* Progress bar tied to scroll */
@keyframes progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.scroll-progress {
  transform-origin: left;
  animation: progress linear;
  animation-timeline: scroll();
}
```

Browser support: Chrome 115+, Edge 115+. Safari and Firefox: behind flags or coming soon. Use as progressive enhancement with Intersection Observer fallback.

## Performance Rules for Animation

1. **Animate ONLY `transform` and `opacity`** — these are composited on the GPU and never trigger layout/paint
2. **Never animate**: `top`, `left`, `right`, `bottom`, `width`, `height`, `margin`, `padding`, `border`
3. **Use `will-change` sparingly** — set it before animation starts, remove after it ends
4. **`content-visibility: auto`** on below-fold sections skips rendering for off-screen content
5. **Lazy-load animation libraries** — dynamic import GSAP/Three.js only when their section enters viewport
6. **Debounce scroll handlers** — or use `requestAnimationFrame` / `passive: true`
7. **Target 60fps on mid-range devices** — test on a mid-range phone, not just your dev machine

```javascript
// Lazy-load GSAP only when needed
const observer = new IntersectionObserver(async (entries) => {
  if (entries[0].isIntersecting) {
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    // Initialize animations
    observer.disconnect();
  }
}, { rootMargin: '200px' });

observer.observe(document.querySelector('.animated-section'));
```
