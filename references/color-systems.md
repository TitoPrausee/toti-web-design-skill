# Color Systems

## OKLCH: The Modern Color Standard

OKLCH is the defining color advancement in modern CSS. Perceptually uniform. Eliminates the muddy middle that plagues sRGB gradient interpolation. Supported in all major browsers (Chrome 111+, Firefox 113+, Safari 16.2+).

```css
/* Vibrant gradient using OKLCH interpolation */
.gradient {
  background: linear-gradient(in oklch, oklch(70% 0.15 240), oklch(50% 0.15 340));
}

/* Derive colors from a single brand token */
:root { --brand: oklch(65% 0.2 250); }
.lighter { background: oklch(from var(--brand) calc(l + 0.15) c h); }
.muted   { background: oklch(from var(--brand) l calc(c - 0.08) h); }
.darker  { background: oklch(from var(--brand) calc(l - 0.15) c h); }
.complement { background: oklch(from var(--brand) l c calc(h + 180)); }
```

### Why OKLCH Over HSL/HEX

- **Perceptual uniformity**: A 10% lightness change looks the same across all hues
- **Consistent chroma**: No accidental neon greens when adjusting hue
- **Better gradients**: `in oklch` interpolation avoids the muddy gray middle
- **Derived colors**: Generate tints, shades, and complements mathematically from one token

## Dark Mode as Default

Dark mode shifted from trend to baseline. Award-winning implementations never use pure black or pure white.

**Background colors:**
- Rich dark grays: #0A0A0A, #121212, #1E1E1E, #1A1A2E
- Deep navies: #14213D, #0F172A
- Warm dark: #1A1714, #211E1A

**Text colors:**
- Off-whites: #E0E0E0, #EBEBEB, #F5F5F0, #FAFAFA
- Muted: #A0A0A0, #888888, #999999

Never `#000000` background with `#FFFFFF` text. The contrast is harsh and fatiguing.

## Five Color Strategies on Awwwards Winners

### 1. Dark Base + Single Saturated Accent (Most Common)

```css
:root {
  --bg: #0A0A0A;
  --surface: #141414;
  --text: #E8E8E8;
  --text-muted: #888888;
  --accent: oklch(70% 0.2 250);  /* electric blue */
  --accent-glow: oklch(70% 0.2 250 / 0.3);
}
```

### 2. Monochromatic Depth

OKLCH lightness variations of one hue. Creates sophisticated, brand-cohesive palettes.

```css
:root {
  --hue: 250;
  --bg: oklch(15% 0.03 var(--hue));
  --surface: oklch(20% 0.04 var(--hue));
  --surface-elevated: oklch(25% 0.05 var(--hue));
  --text: oklch(90% 0.02 var(--hue));
  --text-muted: oklch(60% 0.03 var(--hue));
  --accent: oklch(65% 0.15 var(--hue));
}
```

### 3. Earthy Muted Pastels (Sustainability Brands)

```css
:root {
  --bg: #F5F0EB;
  --surface: #EDE5DD;
  --text: #2D2A26;
  --accent: #7A9E7E;  /* sage green */
  --accent-2: #C4A882; /* warm sand */
}
```

### 4. Neon Micro-Glow Accents on Dark

```css
:root {
  --bg: #080808;
  --surface: #111111;
  --text: #E0E0E0;
  --neon-cyan: #00F0FF;
  --neon-pink: #FF006E;
  --neon-green: #00FF87;
  --glow-cyan: 0 0 20px oklch(70% 0.2 200 / 0.4);
}
```

### 5. OKLCH-Interpolated Multi-Hue Gradients

Replacing flat sRGB gradients with perceptually smooth transitions.

```css
.hero-bg {
  background: linear-gradient(
    135deg in oklch,
    oklch(25% 0.08 280),
    oklch(35% 0.12 320),
    oklch(20% 0.06 240)
  );
}
```

## Mesh Gradients

Complex multi-point gradients that feel organic:

```css
.mesh-gradient {
  background:
    radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(355,85%,93%,1) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(60,100%,75%,1) 0px, transparent 50%);
}
```

## Animated Gradients

```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

## Glassmorphism / Dark Glassmorphism

Frosted glass panels with backdrop blur. In 2026, "Dark Glassmorphism" — glass over dark backgrounds with ambient gradient color orbs — is a defining UI treatment.

```css
.glass {
  background: oklch(20% 0.02 250 / 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid oklch(100% 0 0 / 0.08);
  box-shadow:
    0 8px 32px oklch(0% 0 0 / 0.3),
    inset 0 1px 0 oklch(100% 0 0 / 0.05);
}
```

## Grain / Texture Overlay

Award-winning dark sites often add a subtle grain overlay to avoid banding and add tactile quality:

```css
.grain::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```
