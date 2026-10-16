# toti-web-design-skill

Award-winning web design skill, inspired by awwwards.com Site of the Day winners.

## What This Is

A reusable skill repository that captures the design patterns, code templates, and workflows used by awwwards-winning websites. Usable as a Hermes Skill, Paperclip Skill, or standalone reference.

## Structure

```
toti-web-design-skill/
├── SKILL.md                         # Main skill — YAML frontmatter + workflow
├── references/                      # Deep-dive docs on each design domain
│   ├── design-archetypes.md          # 8 site archetypes and their signatures
│   ├── color-systems.md             # OKLCH, palettes, gradient recipes, dark mode
│   ├── typography.md                 # Fluid type scales, font pairings, kinetic text
│   ├── layout-patterns.md           # Bento, broken grid, full-bleed, subgrid
│   ├── animations.md                 # Scroll-driven, parallax, page transitions
│   ├── micro-interactions.md         # Magnetic cursor, hover states, reveals
│   ├── webgl-3d.md                   # Three.js, R3F, shaders, performance budgets
│   ├── navigation-patterns.md       # Overlay menus, fullscreen takeovers, hidden nav
│   ├── performance-budget.md        # Lighthouse 95+, Core Web Vitals, lazy loading
│   ├── accessibility.md              # Reduced motion, ARIA, focus states, keyboard nav
│   └── awwwards-criteria.md         # Judging rubric, scoring, what actually wins
├── templates/                        # Production-ready code templates
│   ├── tokens/
│   │   ├── design-tokens.css        # Complete CSS custom properties system
│   │   ├── themes.css                # 5 themes: dark, light, neon, mono, duotone
│   │   └── fluid-typography.css     # clamp()-based fluid type + spacing scales
│   ├── animations/
│   │   ├── scroll-reveal.js          # Intersection Observer reveal patterns
│   │   ├── magnetic-cursor.js       # Magnetic cursor with spring physics
│   │   ├── text-reveal.js            # Split text + staggered character reveals
│   │   ├── image-reveal.css         # clip-path / mask / scale image reveals
│   │   ├── parallax.js              # Multi-layer parallax without libraries
│   │   └── page-transition.css     # View Transitions API + Barba.js fallback
│   ├── components/
│   │   ├── hero-immersive.html      # Full-screen immersive hero
│   │   ├── bento-grid.html          # Asymmetric bento grid layout
│   │   ├── overlay-menu.html        # Fullscreen overlay navigation
│   │   └── loader.html              # Preloader with progress
│   └── boilerplate/
│       └── index.html               # Award-winning starting boilerplate
├── .github/workflows/
│   └── ci.yml                        # Lint + Lighthouse CI + build verification
└── LICENSE                           # MIT
```

## Usage

### As a Hermes / Paperclip Skill

Copy or symlink this repo into your skills directory. The `SKILL.md` file contains the trigger and workflow instructions. Load it when working on any web design, UI, or frontend task.

### Standalone

Read `SKILL.md` for the complete workflow. Use `references/` for deep dives. Copy from `templates/` for production code.

## License

MIT
