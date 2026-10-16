# Build Guide — How to Build an Awwwards-Level Website

Step-by-step from concept to production. Based on patterns from 100+ awwwards.com winners.

## Phase 1: Concept

### 1.1 Define the Single Idea
Every award-winning site has one clear idea. Not a feature list — a concept.

| Site | Single Idea |
|------|------------|
| Breaking | Plastic degradation as immersive story |
| Lando Norris | Speed as personal brand |
| Iventions | Events choreography translated to web |
| Cartier 365 | Annual report as magazine browsing |

**Action:** Write your concept in one sentence. If you can't, the concept isn't clear enough.

### 1.2 Define the Audience
- Who is this for?
- What device do they primarily use?
- What is the one action they should take?

### 1.3 Define Constraints
- Performance budget (Lighthouse 95+)
- Browser support (evergreen + Safari)
- Accessibility (WCAG 2.1 AA minimum)
- Timeline

## Phase 2: Design

### 2.1 Choose Your Color System
Pick a color pattern from the analysis:

| Pattern | Colors | Mood |
|---------|--------|------|
| Dark-first duotone | #0a0a0a + one accent | Premium, focused |
| Monochrome | #070707 + #EAEAEA | Editorial, stark |
| Neon dark | #050505 + electric accent | Experimental, bold |
| Light editorial | #F8F8F8 + one accent | Clean, accessible |

**Rule:** Maximum 3 colors. One neutral, one accent, one CTA. The accent appears on conversion controls and active states only.

### 2.2 Choose Your Typography
- One typeface family (two at most)
- Variable font preferred (single file, weight interpolation)
- Set up a 1.25 ratio fluid type scale with `clamp()`
- 6-8 sizes, not 3-4

Recommended: Inter Tight (display + body), JetBrains Mono (code).

### 2.3 Choose Your Layout Pattern
- **Asymmetric** — for portfolios, agencies
- **Broken grid** — for experimental, creative
- **Bento** — for products, dashboards
- **Full-bleed** — for immersive, cinematic

### 2.4 Choose Your Animation Vocabulary
Pick 3-4 animation types. Not more.

Recommended starter set:
1. Scroll reveal (Intersection Observer)
2. Text reveal (split + stagger)
3. Magnetic cursor
4. Image reveal (clip-path)

### 2.5 Design in Figma (or code)
- Start with mobile layout
- Use real content, not lorem ipsum
- Design all states: default, hover, active, loading, empty, error
- Include dark mode from the start

## Phase 3: Implementation

### 3.1 Tech Stack
Based on awwwards winner analysis:

| Layer | Recommended | Why |
|-------|-------------|-----|
| Framework | Next.js / Astro | SSR + hydration |
| Animation | GSAP + ScrollTrigger | Timeline control, industry standard |
| 3D/WebGL | Three.js / OGL | Proven, large ecosystem |
| Styling | CSS Custom Properties | No runtime, theme switching |
| Fonts | Variable fonts | Single file, weight range |
| Build | Vite | Fast HMR, tree-shaking |
| Smooth scroll | Lenis | Buttery smooth, awwwards standard |

### 3.2 Setup Design Tokens
```html
<link rel="stylesheet" href="tokens/base.css">
<link rel="stylesheet" href="tokens/dark.css" data-theme="active">
```

Or import in CSS:
```css
@import 'tokens/base.css';
@import 'tokens/dark.css';
```

### 3.3 Build the Skeleton
1. Container with max-width and fluid padding
2. Grid system (12 columns, fluid gap)
3. Typography classes using fluid scale
4. Color tokens applied via CSS custom properties

### 3.4 Add Components
From `templates/components/`:
- Magnetic buttons
- Text reveal headings
- Image reveal galleries
- Navigation overlays

### 3.5 Layer Animations
From `animations/`:
1. Start with scroll-driven reveals (most impactful, simplest)
2. Add text reveal for headings
3. Add magnetic cursor for interactive elements
4. Add image reveal for media
5. Add parallax for depth
6. Add page transitions last (most complex)

### 3.6 Add WebGL (Optional)
If the concept calls for 3D or shader effects:
- Use Three.js templates from `templates/threejs/`
- Keep WebGL progressive — content must work without it
- Hybrid approach: HTML/CSS for content, WebGL as enhancement layer
- Target 60fps on mid-range hardware

### 3.7 Tools
- **Figma** — design, prototyping
- **Blender** — 3D model creation for Three.js assets
- **Three.js** — WebGL rendering
- **GSAP** — animation timelines
- **Lenis** — smooth scroll
- **Spline** — 3D design to web

## Phase 4: Optimization

### 4.1 Performance Budget
| Metric | Target | Method |
|--------|--------|--------|
| LCP | < 1.8s | SSR, preload hero image, optimized fonts |
| CLS | < 0.1 | Reserve aspect ratios, no layout shift |
| INP | < 100ms | Debounce, rAF batching, passive listeners |
| Lighthouse | 95+ | All of the above + bundle optimization |

### 4.2 Font Optimization
- Use variable fonts (single file, all weights)
- `font-display: swap` to prevent FOIT
- Subset to needed character sets
- Preload critical font files

### 4.3 Image Optimization
- Use `srcset` and `sizes` for responsive images
- AVIF/WebP format with fallback
- Lazy load below-the-fold images
- Reserve aspect ratio to prevent CLS

### 4.4 JavaScript Optimization
- Code-split animation modules (load on demand)
- Tree-shake unused GSAP plugins
- Defer non-critical JavaScript
- Use `requestAnimationFrame` for all animations
- Use `will-change` sparingly (only on animating elements)

### 4.5 WebGL Optimization
- Cap DPR at 2 (`Math.min(window.devicePixelRatio, 2)`)
- Reduce particle counts on mobile
- Pause rendering when tab is hidden
- Use `powerPreference: 'high-performance'` on the context

## Phase 5: Launch

### 5.1 Accessibility Checklist
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus visible (focus ring using `--focus-ring` token)
- [ ] `prefers-reduced-motion` respected (animations disabled)
- [ ] `prefers-color-scheme` respected (theme auto-switches)
- [ ] Color contrast meets WCAG AA (4.5:1 for body text)
- [ ] All images have `alt` text
- [ ] Semantic HTML (heading hierarchy, landmarks)
- [ ] ARIA labels where needed

### 5.2 Cross-Browser Testing
- Chrome/Edge (evergreen)
- Firefox
- Safari (including iOS Safari)
- Check WebGL fallbacks

### 5.3 Performance Audit
- Run Lighthouse CI (in this repo's GitHub Actions)
- Test on mid-range hardware (not just your M2 Pro)
- Test on mobile (real device, not just emulation)
- Verify Core Web Vitals in the field

### 5.4 Submit to Awwwards
- Design: 40% — visual hierarchy, typography, color, originality
- Usability: 30% — navigation, responsiveness, accessibility
- Creativity: 20% — concept originality, interaction design
- Content: 10% — copywriting, media curation

Score 7.0+ for SOTD. Score 8.0+ for SOTY.
