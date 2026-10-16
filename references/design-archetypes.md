# Design Archetypes

Award-winning sites cluster into recognizable archetypes. Each demands different typography, color, layout, and animation strategies. Misidentifying the archetype is the first failure mode.

## 1. Minimalist

Extreme whitespace. Two to three colors maximum. Every element justifies its existence.

- **Typography**: Inter, Suisse Int'l, Neue Haas Grotesk, or Söhne at 48-120px headlines, light weights for elegance
- **Color**: Warm neutrals (#FAFAF5, #E8E4DF, #2D2D2D) or cool neutrals (#F5F5F0, #0F172A) with a single accent
- **Animation**: Restraint — fade-ins (opacity 0 to 1, translateY 20px to 0, 0.6-0.8s), Lenis smooth scroll, GSAP Flip for transitions
- **Use case**: SaaS, luxury brands, architecture studios, high-end portfolios

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

## 2. Immersive / Cinematic

Full-screen video heroes. WebGL 3D environments. Dark backgrounds that make colors carry. Scroll-controlled video playback scrubs frames against scroll position.

- **Background**: #0A0A0A to #1A1A2E
- **Tech**: Three.js for 3D, GSAP ScrollTrigger for pinned sections, Web Audio API for spatialized audio
- **Effects**: Glow via radial gradients, bloom, lens-flare shaders, dramatic lighting
- **Use case**: Automotive, luxury, entertainment, gaming, museums

## 3. Editorial / Magazine

Typography-led. Long-form content. Multi-column layouts. Reading-first.

- **Typography**: Serif display (Tiempos, GT Sectra, Recoleta) + sans body
- **Layout**: CSS multi-column, CSS Grid with subgrid, drop caps, pull quotes
- **Animation**: Subtle — line-by-line reveals, image parallax, reading progress indicator
- **Use case**: Publications, blogs, thought leadership, documentation

## 4. Bento / Card-Based

Modular asymmetric tiles. Inspired by Japanese bento boxes, popularized by Apple keynotes.

- **Grid**: 12-20px border-radius, equal gutter widths (12-24px), large hero cards (2x2 spans)
- **Tech**: Container queries for self-aware tiles, CSS Grid with named areas
- **Animation**: Staggered entrance, hover lift, content reflow
- **Use case**: SaaS, product launches, feature comparison pages
- **Note**: Archetype is reaching saturation. Needs a twist (asymmetric sizing, depth layering, or interactive tiles) to stand out in 2026.

## 5. Brutalist / Anti-Grid

Deliberately broken layouts. Raw HTML aesthetics. Brutalist typography. Monospace everything.

- **Typography**: Monospace (JetBrains Mono, IBM Plex Mono, Courier) at extreme sizes
- **Color**: High contrast, often raw black on white or inverted, with jarring accents
- **Layout**: No grid. Intentional misalignment. Overlapping elements.
- **Animation**: Minimal or jarring — hard cuts, instant states, no easing
- **Use case**: Indie SaaS, developer tools, creative portfolios making a statement
- **Note**: Counter-movement to bento. When everyone looks like Apple, looking different becomes the differentiator.

## 6. Agency / Portfolio

Showcase-driven. Project galleries. Heavy on interaction and visual impact.

- **Typography**: Display fonts with character (Neue Machina, Monument Extended, PP Mori, Clash Display, Satoshi)
- **Layout**: Asymmetric, full-bleed project images, horizontal scroll sections
- **Animation**: Magnetic cursor, image reveal on scroll, hover-following previews, custom loaders
- **Use case**: Creative agencies, design studios, freelancer portfolios

## 7. E-Commerce / Product

Conversion-focused but visually rich. Product showcases with interaction.

- **Typography**: Clean sans (Satoshi, General Sans, Plus Jakarta Sans) with occasional display accents
- **Layout**: Product grid with filter sidebar, full-bleed product detail, quick-view modals
- **Animation**: Image zoom on hover, 360-degree product views, add-to-cart micro-interactions, smooth filter transitions
- **Use case**: Fashion, tech products, furniture, lifestyle brands

## 8. Experimental / Art

Boundary-pushing. WebGL-heavy. Non-standard interaction models.

- **Tech**: Three.js, custom GLSL shaders, WebGPU, Canvas 2D, Web Audio API
- **Layout**: Non-linear, scroll-driven 3D camera paths, physics-based interaction
- **Animation**: Everything is animated. Particle systems, shader transitions, generative visuals
- **Use case**: Art installations, music releases, experimental studios, award submissions
- **Warning**: Highest performance cost. Must provide 2D fallback and respect reduced-motion.

## Choosing Your Archetype

| Question | Answer Points To |
|----------|-----------------|
| Is the brand the experience? | Immersive / Experimental |
| Is content king? | Editorial |
| Are there many features to show? | Bento |
| Is it a creative showcase? | Agency / Portfolio |
| Is conversion the goal? | E-Commerce |
| Is restraint the brand? | Minimalist |
| Is differentiation the brand? | Brutalist |

A site can blend archetypes (e.g., Bento layout with Immersive hero), but commit to one as the foundation.
