# Typography

Typography is 90% of design. Get it wrong and nothing else matters.

## Fluid Type Scale with clamp()

Award-winning sites use fluid typography that scales smoothly between mobile and desktop without media query breakpoints.

```css
:root {
  /* Fluid type scale — based on 1.250 (major third) ratio */
  --text-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg:   clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-xl:   clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-2xl:  clamp(2rem, 1.7rem + 1.5vw, 2.75rem);
  --text-3xl:  clamp(2.5rem, 2rem + 2.5vw, 4rem);
  --text-4xl:  clamp(3.5rem, 2.5rem + 5vw, 6rem);
  --text-5xl:  clamp(4rem, 2.5rem + 8vw, 10rem);

  /* Hero — extreme sizes for impact */
  --text-hero: clamp(3rem, 1rem + 12vw, 16rem);

  /* Line heights */
  --leading-tight: 1.1;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;

  /* Letter spacing */
  --tracking-tight: -0.04em;
  --tracking-snug: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-wider: 0.1em;
}
```

### Fluid Spacing Scale

```css
:root {
  --space-xs:  clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --space-sm:  clamp(0.75rem, 0.6rem + 0.75vw, 1rem);
  --space-md:  clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --space-lg:  clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
  --space-xl:  clamp(2rem, 1.5rem + 2.5vw, 4rem);
  --space-2xl: clamp(3rem, 2rem + 5vw, 6rem);
  --space-3xl: clamp(5rem, 3rem + 10vw, 10rem);
}
```

## Font Pairings by Archetype

### Minimalist
- **Display**: Suisse Int'l, Neue Haas Grotesk, Söhne
- **Body**: Same family, lighter weight
- **Mono**: IBM Plex Mono (for code/data)

### Agency / Portfolio
- **Display**: Neue Machina, Monument Extended, PP Mori, Clash Display, Satoshi
- **Body**: Inter, General Sans, Plus Jakarta Sans

### Editorial
- **Display**: Tiempos, GT Sectra, Recoleta, Fraunces
- **Body**: Inter, GT America, Söhne

### Brutalist
- **Primary**: JetBrains Mono, IBM Plex Mono, Courier
- **No secondary** — monospace everything

### E-Commerce
- **Display**: Satoshi, General Sans, Plus Jakarta Sans
- **Body**: Same family, regular weight

### Immersive
- **Display**: Variable font with extreme weight range (e.g., Roboto Flex, Inter Variable)
- **Body**: Inter, GT America

## Variable Fonts

Variable fonts allow smooth animation of weight, width, and slant — essential for kinetic typography.

```css
.hero-title {
  font-family: "Inter Variable", sans-serif;
  font-weight: 100;  /* Start thin */
  font-variation-settings: "wght" 100, "wdth" 100;
  transition: font-variation-settings 0.8s ease;
}

.hero-title.active {
  font-variation-settings: "wght" 900, "wdth" 120;
}
```

### Free Variable Fonts
- Inter Variable (body, UI)
- Roboto Flex (display, extreme range)
- Recursive (mono + sans hybrid)
- Decovar (decorative, extreme variation)
- Fraunces (serif display)

## Kinetic Typography

Text as a design element, not just content. Individual characters, words, and lines become animatable units.

### Character-by-Character Reveal

```javascript
// Using SplitType (free) + GSAP
import SplitType from 'split-type';

const text = new SplitType('.hero-title', { types: 'chars, words' });

gsap.from(text.chars, {
  opacity: 0,
  y: 50,
  rotateX: -90,
  stagger: 0.02,
  duration: 0.8,
  ease: "back.out(1.7)"
});
```

### Word Stagger

```javascript
const words = new SplitType('.subtitle', { types: 'words' });

gsap.from(words.words, {
  opacity: 0,
  y: 20,
  filter: 'blur(10px)',
  stagger: 0.08,
  duration: 0.6,
  ease: "power3.out"
});
```

### Line-by-Line Reveal

```javascript
const lines = new SplitType('.paragraph', { types: 'lines' });

gsap.from(lines.lines, {
  opacity: 0,
  y: '100%',
  stagger: 0.15,
  duration: 0.8,
  ease: "power4.out",
  scrollTrigger: {
    trigger: '.paragraph',
    start: 'top 80%'
  }
});
```

### Scramble / Decode Effect

```javascript
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';
const el = document.querySelector('.scramble-text');
const finalText = el.textContent;

function scramble(el, finalText, duration = 2000) {
  const startTime = Date.now();
  const interval = setInterval(() => {
    const progress = (Date.now() - startTime) / duration;
    let display = '';
    for (let i = 0; i < finalText.length; i++) {
      if (progress * finalText.length > i) {
        display += finalText[i];
      } else {
        display += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.textContent = display;
    if (progress >= 1) {
      clearInterval(interval);
      el.textContent = finalText;
    }
  }, 50);
}
```

## Text Splitting Libraries

| Library | Size | Notes |
|---------|------|-------|
| SplitType | ~4KB | Free, GSAP-compatible, recommended |
| Splitting.js | ~6KB | Lightweight, CSS-driven |
| GSAP SplitText | Premium | Most powerful, requires GSAP membership |

## Typography for Impact

- **Hero text at 15-25vw** creates immediate visual dominance
- **Mixed weights within a single headline** — light + bold, thin + heavy
- **Tight tracking on display** — `-0.04em` to `-0.06em` for large headlines
- **Loose tracking on small caps** — `0.1em` to `0.15em` for labels
- **Variable font animation** — animate weight from 100 to 900 on scroll or hover
- **Extreme size contrast** — 120px headline next to 14px caption

## Accessibility for Split Text

When splitting text into characters/words/lines for animation, the screen reader loses the original text. Always add:

```html
<h1 aria-label="The actual headline text" class="hero-title">
  <!-- SplitType inserts spans here -->
  The actual headline text
</h1>
```

```javascript
// SplitType preserves the original text in aria-label
new SplitType('.hero-title', { types: 'chars', aria: true });
```
