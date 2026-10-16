---
name: toti-web-design-skill
description: "Use when building, designing, or reviewing award-winning websites. Awwwards-level design system, typography, color, layout, motion, and code templates."
version: 1.0.0
author: TitoPrausee
license: MIT
tags: [web-design, frontend, awwwards, design-system, animations, css, gsap, webgl]
---

# Award-Winning Web Design Skill

## When to Use

- Building a new website that aims for award-level quality
- Redesigning an existing site to awwwards standards
- Reviewing or auditing a frontend for design quality
- Creating design systems, component libraries, or animation frameworks
- Any task involving modern CSS, GSAP, Three.js, or immersive web experiences

## Philosophy: What Makes a Site Unforgettable

Award-winning sites share traits that separate them from millions of forgettable pages:

1. **Intentional Storytelling** — Every scroll, click, and hover tells part of a story. Content reveals progressively, creating anticipation and reward.
2. **Choreographed Motion** — Animations are communication, not decoration. Each movement has purpose: guiding attention, providing feedback, creating continuity.
3. **Sensory Richness** — Custom cursors create tactile feedback. Textures, gradients, and lighting effects create atmosphere. The experience feels physical.
4. **Technical Craftsmanship** — 60fps animations. Fast load despite rich visuals. Graceful degradation on slower devices. The engineering is invisible but essential.
5. **Breaking Conventions Intentionally** — Unconventional layouts, unexpected interactions, rule-breaking typography — always in service of the experience, never random.

## Workflow: Building an Award-Winning Site

### Phase 1 — Art Direction (Before Code)

Define before writing a single line of CSS:

- **Emotion**: What should the visitor feel in the first 3 seconds?
- **Archetype**: Which of the 8 archetypes fits? (see `references/design-archetypes.md`)
- **Industry context**: Agency, product, editorial, e-commerce, portfolio?
- **Signature interaction**: What ONE moment will visitors remember?
- **Color strategy**: Dark base + accent? Monochromatic depth? Neon glow? (see `references/color-systems.md`)
- **Typography voice**: Display font + body font pairing. Fluid scale. (see `references/typography.md`)

A generic, template-looking UI is a failure. The visitor must feel the product is one-of-a-kind on first load.

### Phase 2 — Design System Foundation

Start from `templates/tokens/`. Define:

1. **Color tokens** using OKLCH for perceptual uniformity (see `references/color-systems.md`)
2. **Typography scale** using `clamp()` for fluid responsiveness (see `references/typography.md`)
3. **Spacing scale** using `clamp()` — never fixed pixels for responsive layouts
4. **Shadow system** — layered shadows for depth, not single flat shadows
5. **Border radius** — consistent across components, scale with element size
6. **Themes** — dark mode as first-class citizen, minimum 2 themes (see `templates/tokens/themes.css`)

Never use pure black (#000000) or pure white (#FFFFFF). Use rich dark grays (#0A0A0A, #121212, #1E1E1E) and off-whites (#F5F5F0, #FAFAFA, #E0E0E0).

### Phase 3 — Layout Architecture

Choose layout strategy based on content type (see `references/layout-patterns.md`):

- **Bento grid** for SaaS/product pages with multiple features
- **Broken grid** for editorial/portfolio sites that need visual tension
- **Full-bleed immersive** for cinematic/automotive/luxury brands
- **Centered content with full-bleed escape hatches** for long-form editorial

Use CSS Grid as the foundation. The Josh W. Comeau full-bleed pattern for long-form:

```css
.wrapper {
  display: grid;
  grid-template-columns: 1fr min(65ch, 100%) 1fr;
  gap: clamp(3rem, 8vw, 12rem);
  padding: clamp(2rem, 5vw, 8rem);
}
.wrapper > * { grid-column: 2; }
.full-bleed { grid-column: 1 / -1; }
```

Vary section rhythm — alternate contained/full-bleed, vary spacing, break the template look.

### Phase 4 — Motion Design (see `references/animations.md`)

Motion is the deliverable, not polish. The hierarchy of attention is set by what moves, not what is biggest.

**Animation Stack:**
- **Primary**: GSAP + ScrollTrigger (industry standard for scroll-bound timelines)
- **Smooth scroll**: Lenis (lightweight, performant)
- **React**: Motion (formerly Framer Motion) for component-level interactions
- **3D**: Three.js or React Three Fiber (see `references/webgl-3d.md`)

**Required animation patterns for award-level quality:**

1. **Scroll-triggered reveals** with staggered timing (see `templates/animations/scroll-reveal.js`)
2. **Smooth scroll** via Lenis or equivalent
3. **Custom easing** on ALL animations — never default linear/ease
4. **Page/section transitions** via View Transitions API or Barba.js (see `templates/animations/page-transition.css`)
5. **Hover states** on all interactive elements (see `references/micro-interactions.md`)
6. **Loading animation/sequence** (see `templates/components/loader.html`)
7. **Magnetic cursor** if appropriate to brand (see `templates/animations/magnetic-cursor.js`)
8. **Text reveal** — split text, staggered character/word/line animation (see `templates/animations/text-reveal.js`)
9. **Image reveal** — clip-path, mask, or scale on scroll (see `templates/animations/image-reveal.css`)

**Performance rules:**
- Animate ONLY `transform` and `opacity` — never animate `top`, `left`, `width`, `height`
- Use `will-change` sparingly and remove after animation completes
- `content-visibility: auto` on below-fold sections
- Lazy-load heavy libraries (Three.js, GSAP) via dynamic import when their section enters viewport
- Target 60fps on mid-range devices, not just dev machines

### Phase 5 — Navigation (see `references/navigation-patterns.md`)

Award-winning navigation patterns:

- **Full-screen overlay menus** where the overlay itself becomes an editorial experience
- **Staggered GSAP reveals** on menu items (50-100ms per item)
- **Hover previews** — mouse-following images that preview page content
- **clip-path transition reveals** for menu open/close
- **Hidden nav** that appears on scroll up, hides on scroll down
- **Mega menus** for sites with 20+ pages (multi-column, descriptive text, embedded search)

The hamburger menu works on desktop only when the overlay itself becomes a designed experience.

### Phase 6 — WebGL / 3D (see `references/webgl-3d.md`)

Use WebGL ONLY when the brand IS the experience (creative agencies, fashion, automotive, art portfolios). For SaaS/product sites, skip it — the performance cost is too high.

When using WebGL:
- **Three.js** for maximum control (~150KB)
- **React Three Fiber** for React apps with Drei helpers (~30KB over Three.js)
- **OGL** when bundle size is critical (29KB total)
- **Curtains.js** for lightweight image-on-plane distortion
- Lazy-load the WebGL context — never block initial render
- Provide meaningful 2D fallback for low-powered devices
- Use WebGPU where available (Three.js r171+, September 2025), with WebGL fallback

Common award-winning WebGL effects: image hover distortion via vertex displacement shaders, particle systems with custom GLSL, shader-based image-to-image transitions, post-processing chains (bloom, color grading, vignette).

### Phase 7 — Accessibility (see `references/accessibility.md`)

Accessibility coexists with beauty. Non-negotiable:

- `prefers-reduced-motion` — detect and disable smooth scroll, reduce particle counts, simplify transitions
- Custom cursors require `aria-hidden="true"`
- Animated text split into characters needs `aria-label` on the parent with the full text
- Skip links, `:focus-visible` styling, semantic HTML beneath creative layouts
- ARIA live regions for dynamic content
- Keyboard navigation for all interactive elements
- Color contrast WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)

### Phase 8 — Performance (see `references/performance-budget.md`)

Performance IS design. A beautiful site that loads slowly is a failed site.

**Targets:**
- Lighthouse 95+ on all metrics
- LCP < 2.5s
- FID/INP < 100ms
- CLS < 0.1
- Total JS payload < 200KB gzipped (excluding WebGL, which lazy-loads)
- 60fps animation on mid-range devices

**Techniques:**
- `content-visibility: auto` on below-fold sections
- Intersection Observer for lazy loading images and animation initialization
- Dynamic imports for heavy libraries (Three.js, GSAP plugins)
- Preload critical fonts, `font-display: swap` for non-critical
- Image optimization: WebP/AVIF, responsive `srcset`, `loading="lazy"`
- CSS `contain: layout style paint` on isolated components

### Phase 9 — Self-Review Checklist

Before considering a site "award-worthy":

**Animation:**
- [ ] Scroll-triggered reveals with staggered timing
- [ ] Smooth scroll (Lenis or equivalent)
- [ ] Custom easing on all animations
- [ ] Page/section transitions
- [ ] Hover states on all interactive elements
- [ ] Loading animation/sequence

**Visual:**
- [ ] Distinctive typography (not Inter/Roboto as primary display font)
- [ ] Custom cursor (if appropriate to brand)
- [ ] Texture/grain overlay (if dark theme)
- [ ] Considered color palette with intention
- [ ] Atmospheric backgrounds (gradients, effects)
- [ ] Consistent visual language throughout
- [ ] No pure black or pure white

**Technical:**
- [ ] 60fps animation performance
- [ ] Mobile responsive with adapted interactions (not just resized)
- [ ] Reduced motion support
- [ ] Fast initial load (< 3s on 4G)
- [ ] No layout shift during load
- [ ] Lighthouse 95+
- [ ] Semantic HTML
- [ ] Keyboard navigable

**Awwwards Criteria Check (see `references/awwwards-criteria.md`):**
- [ ] Design 8.5+ — Visual aesthetics, composition, color, typography
- [ ] Usability 8.5+ — Navigation, accessibility, responsiveness, intuitive UX
- [ ] Creativity 8.5+ — Innovation, uniqueness, memorable moments
- [ ] Content 8.5+ — Quality, storytelling, relevance, engagement

## Anti-Patterns (What Kills Award Potential)

- Generic chatbot widgets loading on page render
- Static gradients as primary design element
- Experimental navigation that requires discovery (kills usability scores)
- Scroll-based animations that pause, making users think they reached the end
- Heavy parallax scrolling as primary effect (performance drag in 2026)
- Bento grid without hierarchy (reached oversaturation — needs a twist)
- WebGL on every site regardless of brand fit
- Kinetic typography everywhere instead of hero-only
- Glassmorphism on everything instead of navigation/modals only
- Treating motion as decoration instead of communication

## Template Usage

All templates in `templates/` are production-ready. Copy them into your project and customize the design tokens.

1. Start with `templates/tokens/design-tokens.css` — defines your color, spacing, shadow, radius system
2. Add `templates/tokens/themes.css` — defines your theme variants
3. Add `templates/tokens/fluid-typography.css` — defines your fluid type scale
4. Pick animation templates from `templates/animations/` based on your needs
5. Use component templates from `templates/components/` as starting points
6. Start new pages from `templates/boilerplate/index.html`

## References

Load these for deep dives on specific topics:

| File | Topic |
|------|-------|
| `references/design-archetypes.md` | 8 site archetypes, when to use each, their signatures |
| `references/color-systems.md` | OKLCH, palettes by archetype, gradient recipes, dark mode |
| `references/typography.md` | Fluid scales, font pairings, kinetic text animation |
| `references/layout-patterns.md` | Bento, broken grid, full-bleed, subgrid, section rhythm |
| `references/animations.md` | GSAP patterns, scroll reveals, page transitions, easing |
| `references/micro-interactions.md` | Magnetic cursor, hover states, text/image reveals |
| `references/webgl-3d.md` | Three.js, R3F, shaders, particles, performance budgets |
| `references/navigation-patterns.md` | Overlay menus, fullscreen takeovers, hidden nav, mega menus |
| `references/performance-budget.md` | Lighthouse 95+, Core Web Vitals, lazy loading, rendering |
| `references/accessibility.md` | Reduced motion, ARIA, focus states, keyboard nav |
| `references/awwwards-criteria.md` | Judging rubric, scoring, what actually wins SOTD |
