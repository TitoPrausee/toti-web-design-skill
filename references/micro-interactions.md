# Micro-Interactions

The details that separate good from award-winning. Each interaction provides feedback, guides attention, or creates emotional resonance.

## Magnetic Cursor

A custom cursor that tracks the user's pointer with spring-like easing, then releases back to resting position when the cursor leaves. Awards' most recognizable interaction pattern.

### CSS-Only Magnetic Hover (Simple)

```css
.magnetic-btn {
  transition: transform 0.3s var(--ease-out-expo);
}

.magnetic-btn:hover {
  transform: translate(8px, -4px);
}
```

### JavaScript Magnetic Cursor (Full)

```javascript
class MagneticCursor {
  constructor() {
    this.cursor = document.querySelector('[data-cursor]');
    this.hoverables = document.querySelectorAll('a, button, [data-magnetic]');
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.init();
  }

  init() {
    // Hide on touch devices
    if ('ontouchstart' in window) {
      this.cursor.style.display = 'none';
      return;
    }

    window.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    });

    // Hover state
    this.hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('cursor--hover');
        this.magnetize(el);
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('cursor--hover');
        this.unmagnetize(el);
      });
    });

    this.animate();
  }

  magnetize(el) {
    el.addEventListener('mousemove', this.magnetMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.3;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
  }

  unmagnetize(el) {
    el.removeEventListener('mousemove', this.magnetMove);
    el.style.transform = '';
  }

  animate() {
    // Spring lerp
    this.x += (this.targetX - this.x) * 0.15;
    this.y += (this.targetY - this.y) * 0.15;
    this.cursor.style.transform = `translate(${this.x}px, ${this.y}px)`;
    requestAnimationFrame(() => this.animate());
  }
}

new MagneticCursor();
```

```css
[data-cursor] {
  position: fixed;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent);
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 9999;
  transition: width 0.3s var(--ease-out-expo),
              height 0.3s var(--ease-out-expo);
  will-change: transform;
  margin: -12px 0 0 -12px;  /* Center on pointer */
}

[data-cursor].cursor--hover {
  width: 56px;
  height: 56px;
  margin: -28px 0 0 -28px;
  background: transparent;
  border: 2px solid var(--accent);
}

/* Hide native cursor on devices with custom cursor */
@media (hover: hover) and (pointer: fine) {
  * { cursor: none; }
}

/* Accessibility: respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  [data-cursor] { display: none; }
  * { cursor: auto; }
}
```

## Hover States

### Button with Liquid Fill

```css
.btn-liquid {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-liquid::before {
  content: '';
  position: absolute;
  bottom: -100%;
  left: 50%;
  width: 150%;
  height: 100%;
  background: var(--accent);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: bottom 0.5s var(--ease-out-expo);
  z-index: -1;
}

.btn-liquid:hover::before {
  bottom: -50%;
}
```

### Image Reveal on Hover

```css
.card-image {
  position: relative;
  overflow: hidden;
}

.card-image img {
  transition: transform 0.8s var(--ease-out-expo),
              filter 0.8s var(--ease-out-expo);
}

.card-image:hover img {
  transform: scale(1.08);
  filter: brightness(0.7);
}

.card-image .overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  background: linear-gradient(to top, oklch(0% 0 0 / 0.8), transparent);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s var(--ease-out-expo),
              transform 0.5s var(--ease-out-expo);
}

.card-image:hover .overlay {
  opacity: 1;
  transform: translateY(0);
}
```

### Link Underline Animation

```css
.link-underline {
  position: relative;
  text-decoration: none;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s var(--ease-out-expo);
}

.link-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

## Text Reveal

### Split Text + Staggered Character Reveal

```javascript
import SplitType from 'split-type';
import gsap from 'gsap';

// Hero title — character by character
const heroTitle = new SplitType('[data-split-chars]', { types: 'chars' });

gsap.from(heroTitle.chars, {
  opacity: 0,
  y: 60,
  rotateZ: 10,
  stagger: 0.02,
  duration: 0.8,
  ease: 'back.out(1.7)',
  delay: 0.3  // Wait for loader
});

// Subtitle — word by word
const subtitle = new SplitType('[data-split-words]', { types: 'words' });

gsap.from(subtitle.words, {
  opacity: 0,
  y: 30,
  filter: 'blur(8px)',
  stagger: 0.06,
  duration: 0.6,
  ease: 'power3.out',
  delay: 0.8
});
```

### Scroll-Triggered Line Reveal

```javascript
const lines = new SplitType('[data-split-lines]', { types: 'lines' });

gsap.from(lines.lines, {
  opacity: 0,
  y: '100%',
  stagger: 0.15,
  duration: 1,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '[data-split-lines]',
    start: 'top 75%'
  }
});
```

### CSS-Only Text Reveal (No Library)

```css
[data-reveal-text] {
  overflow: hidden;
}

[data-reveal-text] > * {
  display: inline-block;
  transform: translateY(100%);
  transition: transform 0.8s var(--ease-out-expo);
}

[data-reveal-text].revealed > * {
  transform: translateY(0);
}

/* Stagger multiple lines */
[data-reveal-text] > *:nth-child(2) { transition-delay: 0.1s; }
[data-reveal-text] > *:nth-child(3) { transition-delay: 0.2s; }
[data-reveal-text] > *:nth-child(4) { transition-delay: 0.3s; }
```

## Image Reveal

### Clip-Path Wipe

```css
.image-reveal-clip {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1s var(--ease-out-expo);
}

.image-reveal-clip.revealed {
  clip-path: inset(0 0 0 0);
}
```

### Scale + Mask Reveal

```css
.image-reveal-scale {
  transform: scale(1.3);
  clip-path: inset(0 0 100% 0);
  transition: transform 1.2s var(--ease-out-expo),
              clip-path 1.2s var(--ease-out-expo);
}

.image-reveal-scale.revealed {
  transform: scale(1);
  clip-path: inset(0 0 0 0);
}
```

### Directional Wipe (GSAP)

```javascript
gsap.utils.toArray('[data-wipe]').forEach((el, i) => {
  const dir = el.dataset.wipe;  // 'left', 'right', 'top', 'bottom'
  const from = {
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    top: 'inset(0 0 100% 0)',
    bottom: 'inset(100% 0 0 0)'
  }[dir];

  gsap.fromTo(el,
    { clipPath: from },
    {
      clipPath: 'inset(0 0 0 0)',
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%'
      }
    }
  );
});
```

## Loader Animations

### Progress Bar Loader

```html
<div class="loader" data-loader>
  <div class="loader__bar">
    <div class="loader__progress" data-loader-progress></div>
  </div>
  <span class="loader__text" data-loader-text>0%</span>
</div>
```

```css
.loader {
  position: fixed;
  inset: 0;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  z-index: 10000;
  transition: opacity 0.6s var(--ease-out-expo),
              visibility 0.6s;
}

.loader.done {
  opacity: 0;
  visibility: hidden;
}

.loader__bar {
  width: clamp(200px, 30vw, 400px);
  height: 2px;
  background: oklch(100% 0 0 / 0.1);
  overflow: hidden;
}

.loader__progress {
  height: 100%;
  background: var(--accent);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.3s ease-out;
}

.loader__text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-muted);
}
```

```javascript
const progress = document.querySelector('[data-loader-progress]');
const text = document.querySelector('[data-loader-text]');
const loader = document.querySelector('[data-loader]');

let current = 0;
const interval = setInterval(() => {
  current += Math.random() * 15;
  if (current >= 100) {
    current = 100;
    clearInterval(interval);
    setTimeout(() => {
      loader.classList.add('done');
      // Trigger entrance animations
      document.body.classList.add('loaded');
    }, 300);
  }
  progress.style.transform = `scaleX(${current / 100})`;
  text.textContent = `${Math.round(current)}%`;
}, 150);
```

## Marquee

```css
.marquee {
  display: flex;
  overflow: hidden;
  user-select: none;
}

.marquee__track {
  display: flex;
  flex-shrink: 0;
  gap: 2rem;
  animation: marquee var(--marquee-duration, 20s) linear infinite;
}

.marquee:hover .marquee__track {
  animation-play-state: paused;
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

/* Duplicate content for seamless loop */
/* In HTML: render the track content twice */
```
