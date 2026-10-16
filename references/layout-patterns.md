# Layout Patterns

## Bento Grid

Modular asymmetric tiles inspired by Japanese bento boxes. The dominant layout pattern of 2026 for SaaS and product pages.

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: 16px;
  padding: clamp(1rem, 3vw, 2rem);
}

/* Hero card spans 2x2 */
.bento-hero {
  grid-column: span 2;
  grid-row: span 2;
}

/* Wide card */
.bento-wide {
  grid-column: span 2;
}

/* Tall card */
.bento-tall {
  grid-row: span 2;
}

/* Responsive: collapse to 2 columns */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile: single column */
@media (max-width: 480px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-hero,
  .bento-wide,
  .bento-tall {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

### Container Queries for Self-Aware Tiles

```css
.bento-tile {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bento-tile h3 {
  font-size: 1.25rem;
}

@container (min-width: 400px) {
  .bento-tile h3 {
    font-size: 2rem;
  }
  .bento-tile .description {
    display: block;  /* Hidden on small tiles */
  }
}
```

**Note**: Bento has reached saturation. To stand out: use asymmetric sizing, depth layering, interactive tiles, or break the consistent border-radius.

## Broken Grid / Asymmetric

CSS Grid enables faithful reproduction of editorial poster compositions with intentional overlap.

```css
.broken-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 10fr 3fr 3fr 3fr 3fr 3fr 6fr 6fr 3fr;
  gap: clamp(1rem, 2vw, 2rem);
}

.hero-image {
  grid-column: 3 / 9;
  grid-row: 2 / 7;
}

.overlay-text {
  grid-column: 4 / 11;
  grid-row: 4 / 6;
  z-index: 2;
}

.side-note {
  grid-column: 10 / 12;
  grid-row: 3 / 5;
  align-self: end;
}
```

## Full-Bleed with Centered Content (Josh W. Comeau Pattern)

The standard for long-form content with breakout sections.

```css
.wrapper {
  display: grid;
  grid-template-columns: 1fr min(65ch, 100%) 1fr;
  gap: clamp(3rem, 8vw, 12rem);
  padding: clamp(2rem, 5vw, 8rem);
}

.wrapper > * { grid-column: 2; }
.full-bleed { grid-column: 1 / -1; }
.breakout { grid-column: 1 / 3; }
```

## Subgrid

Nested elements inherit parent grid tracks. Essential for card layouts where titles and content must align across cards.

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  display: grid;
  grid-template-rows: subgrid;  /* Inherits parent row tracks */
  grid-row: span 3;
}

/* Fallback for older browsers */
@supports not (grid-template-rows: subgrid) {
  .card {
    grid-template-rows: auto 1fr auto;
  }
}
```

## Section Rhythm

Varying section sizing and spacing creates visual rhythm. A page where every section is the same height looks like a template.

```css
/* Alternate contained and full-bleed sections */
.section-contained {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
}

.section-full-bleed {
  width: 100%;
  padding: var(--space-3xl) 0;
}

.section-narrow {
  max-width: 680px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

/* HTML structure: alternate section types */
/*
<section class="section-contained">...</section>
<section class="section-full-bleed">...</section>
<section class="section-narrow">...</section>
<section class="section-contained">...</section>
*/
```

## CSS :has() for Layout-Aware Styling

```css
/* Style a card differently when it contains an image */
.card:has(img) {
  grid-row: span 2;
}

/* Section that has a full-bleed child gets reduced padding */
section:has(.full-bleed) {
  padding-inline: 0;
}

/* Navigation hides when sidebar is open */
body:has(.sidebar.open) .main-nav {
  transform: translateX(-100%);
}
```

## View Transitions API

Native page transitions without libraries (Chrome 111+, Safari 18+).

```css
@view-transition {
  navigation: auto;
}

/* Named transitions for shared elements */
.product-thumbnail {
  view-transition-name: product-image;
}

.product-hero-image {
  view-transition-name: product-image;
}
```

```javascript
// Programmatic view transitions
document.startViewTransition(() => {
  // DOM update here
  updateContent();
});
```

For multi-page sites without native support, use Barba.js (~7KB) with GSAP:

```javascript
import barba from '@barba/core';
import gsap from 'gsap';

barba.init({
  transitions: [{
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: 'power3.in'
      });
    },
    enter(data) {
      return gsap.from(data.next.container, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: 'power3.out'
      });
    }
  }]
});
```
