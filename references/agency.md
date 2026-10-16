# Agency Category — Award-Winning Site References

## Sites Analyzed

### Locomotive (locomotive.ca)
- Awwwards: Site of the Day, FWA winner
- Colors: #000000 bg, #ffffff text, #ff3c00 accent
- Fonts: Custom display + sans-serif body
- Layout: Horizontal scroll sections, parallax depth
- Animations: Smooth scroll engine, pinned sections, text reveal
- Award factor: Pioneered the smooth-scroll paradigm adopted industry-wide
- Code snippet:
```js
// Lenis smooth scroll integration
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```

### Resn (resn.global)
- Awwwards: Multiple Site of the Day awards
- Colors: #0a0a0a bg, vibrant accent gradients
- Fonts: Oversized display, tight body
- Layout: Fullscreen sections, 3D objects
- Animations: Three.js scenes, physics interactions, audio
- Award factor: Playful interactivity with technical depth
- Code snippet:
```js
// Physics-based 3D object interaction
mesh.userData.rigidBody = world.createBody(mesh.geometry);
container.addEventListener('mousemove', (e) => {
  const force = new CANNON.Vec3(e.movementX * 0.1, e.movementY * 0.1, 0);
  mesh.userData.rigidBody.applyImpulse(force, mesh.userData.rigidBody.position);
});
```

### Active Theory — Carbon (carbon.activetheory.net)
- Awwwards: Site of the Day
- Colors: #000 bg, #fff text, neon green accent
- Fonts: Monospace headers, sans body
- Layout: Immersive scroll, pinned WebGL scenes
- Animations: GPU particle systems, shader transitions
- Award factor: Performance with 1M+ particles at 60fps

### MediaMonks (mediamonks.com)
- Awwwards: Site of the Day
- Colors: #fff bg (light-first variant), #000 text
- Fonts: Custom sans-serif
- Layout: Card-based, modular grid
- Animations: Subtle, purposeful, scroll-triggered
- Award factor: Proved light-mode sites can win awwwards

## Common Agency Patterns

1. Horizontal or pinned scroll sections
2. Large hero with company statement
3. Work showcase grid with hover states
4. Team section with photo reveals
5. Contact form with magnetic submit button
6. Smooth scroll library (Lenis/Locomotive)
7. Page transitions between work items
8. Loading animation with progress

## Token Mapping

| Site Pattern | Token File | Template |
|-------------|-----------|----------|
| Dark immersive | `tokens/dark.css` | `templates/layouts/full-bleed.html` |
| Horizontal scroll | `tokens/base.css` | `templates/gsap/scroll-timeline.html` |
| Work grid | `tokens/dark.css` | `templates/components/scroll-cards.html` |
| Page transition | `tokens/dark.css` | `templates/page-transition/curtain-transition.html` |
| Loader | `tokens/dark.css` | `animations/loader.js` |
