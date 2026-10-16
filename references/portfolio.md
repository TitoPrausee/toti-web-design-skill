# Portfolio References — Award-Winning Sites

Sites analyzed from awwwards.com Site of the Day / Site of the Year winners in the Portfolio category.

---

## AW Portfolio
- **URL:** https://wodniack.dev/
- **Award:** SOTD Dec 12, 2024
- **Creator:** Antoine Wodniack
- **Colors:** `#f40c3f` (red), `#160000` (deep black)
- **Fonts:** Custom display sans-serif
- **Layout:** Full-bleed hero, asymmetric grid portfolio grid, scroll-triggered project reveals
- **Animations:** Magnetic cursor on project links, text reveal on headings, image clip-path reveal on scroll, smooth scroll
- **What Makes It Special:** Extreme color restraint — two colors only. The red is used surgically as accent. Oversized typography creates drama without decoration.
- **Techniques to Steal:**
  - Duotone color system (2 colors max)
  - Magnetic cursor on portfolio thumbnails
  - Clip-path image reveal
  - Custom cursor with mix-blend-mode difference

```css
/* Duotone palette from AW Portfolio */
:root {
  --bg: #160000;
  --accent: #f40c3f;
  --text: #ffffff;
}
/* Custom cursor */
.cursor { mix-blend-mode: difference; }
```

---

## Léo Parpeix — Portfolio 2026
- **URL:** https://leoparpeix.com/
- **Award:** SOTD Sep 14, 2026
- **Creator:** Léo Parpeix
- **Colors:** Monochrome dark, single accent
- **Layout:** Horizontal scroll sections, pinned panels
- **Animations:** GSAP ScrollTrigger pinning, horizontal scroll, text marquee, parallax depth layers
- **What Makes It Special:** Horizontal scroll as primary navigation pattern. Content moves sideways instead of down.
- **Techniques to Steal:**
  - Horizontal scroll with GSAP ScrollTrigger
  - Pinned sections with scroll-driven progress
  - Marquee text animation

---

## Gionatan Nese '26
- **URL:** https://gionatan.nese.com/
- **Award:** SOTD Sep 05, 2026
- **Creator:** Gionatan Nese
- **Colors:** Dark-first, neon accent
- **Layout:** Fullscreen sections, immersive transitions
- **Animations:** Page transitions with curtain reveal, magnetic hover, 3D tilt on cards
- **What Makes It Special:** Every section feels like a new page. Transitions are choreographed, not instant.
- **Techniques to Steal:**
  - Curtain page transitions
  - 3D card tilt on mousemove
  - Section-to-section choreographed transitions

---

## L.I.S.A.
- **URL:** https://lisa.studio/
- **Award:** SOTD Sep 16, 2026
- **Creator:** Locomotive
- **Colors:** Light/bright palette with bold accent
- **Layout:** Editorial grid, modular content blocks
- **Animations:** Smooth scroll (Lenis), scroll-driven reveals, staggered text
- **What Makes It Special:** Locomotive's signature smooth scroll. Editorial layout with motion restraint.
- **Techniques to Steal:**
  - Lenis smooth scroll integration
  - Editorial modular grid
  - Staggered text reveal with Intersection Observer
