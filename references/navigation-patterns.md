# Navigation Patterns

Award-winning navigation is not just a menu — it is a designed experience. The navigation sets the tone for the entire site.

## Full-Screen Overlay Menu

The dominant navigation pattern for award-winning sites. The overlay itself becomes an editorial experience.

```html
<button class="menu-toggle" data-menu-toggle aria-label="Open menu">
  <span></span>
  <span></span>
</button>

<nav class="overlay-menu" data-overlay-menu aria-hidden="true">
  <div class="overlay-menu__bg" data-menu-bg></div>
  <div class="overlay-menu__content">
    <ul class="overlay-menu__list">
      <li><a href="/" data-menu-item>Home</a></li>
      <li><a href="/work" data-menu-item>Work</a></li>
      <li><a href="/about" data-menu-item>About</a></li>
      <li><a href="/contact" data-menu-item>Contact</a></li>
    </ul>
    <div class="overlay-menu__footer">
      <a href="mailto:hello@example.com">hello@example.com</a>
      <div class="social-links">
        <a href="#">Instagram</a>
        <a href="#">Twitter</a>
        <a href="#">GitHub</a>
      </div>
    </div>
  </div>
</nav>
```

```css
.overlay-menu {
  position: fixed;
  inset: 0;
  z-index: 9000;
  pointer-events: none;
}

.overlay-menu__bg {
  position: absolute;
  inset: 0;
  background: var(--bg);
  clip-path: inset(0 0 100% 0);
  transition: clip-path 0.8s var(--ease-out-expo);
}

.overlay-menu.is-open .overlay-menu__bg {
  clip-path: inset(0 0 0 0);
}

.overlay-menu__content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4rem);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.overlay-menu.is-open .overlay-menu__content {
  opacity: 1;
  transition-delay: 0.3s;
  pointer-events: auto;
}

.overlay-menu__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 2vw, 1.5rem);
}

.overlay-menu__list a {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 300;
  text-decoration: none;
  color: var(--text);
  display: inline-block;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.6s var(--ease-out-expo),
              opacity 0.6s var(--ease-out-expo),
              color 0.3s;
}

.overlay-menu.is-open .overlay-menu__list a {
  transform: translateY(0);
  opacity: 1;
}

/* Stagger each item */
.overlay-menu.is-open .overlay-menu__list li:nth-child(1) a { transition-delay: 0.4s; }
.overlay-menu.is-open .overlay-menu__list li:nth-child(2) a { transition-delay: 0.5s; }
.overlay-menu.is-open .overlay-menu__list li:nth-child(3) a { transition-delay: 0.6s; }
.overlay-menu.is-open .overlay-menu__list li:nth-child(4) a { transition-delay: 0.7s; }

.overlay-menu__list a:hover {
  color: var(--accent);
  transform: translateX(20px);
}
```

```javascript
const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-overlay-menu]');

toggle.addEventListener('click', () => {
  const isOpen = menu.classList.contains('is-open');
  menu.classList.toggle('is-open');
  toggle.classList.toggle('is-active');
  menu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

// Close on link click
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-active');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-active');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
});
```

## Menu Toggle Animation

```css
.menu-toggle {
  position: fixed;
  top: clamp(1.5rem, 3vw, 2.5rem);
  right: clamp(1.5rem, 3vw, 2.5rem);
  z-index: 9500;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.menu-toggle span {
  display: block;
  width: 32px;
  height: 2px;
  background: var(--text);
  transition: transform 0.4s var(--ease-out-expo),
              opacity 0.3s;
}

.menu-toggle.is-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle.is-active span:nth-child(2) {
  transform: translateY(-8px) rotate(-45deg);
}
```

## Hover-Preview Navigation

Mouse-following images that preview page content when hovering over navigation links.

```javascript
const menuLinks = document.querySelectorAll('[data-menu-item]');
const preview = document.querySelector('[data-menu-preview]');
const previewImg = preview.querySelector('img');

let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

const previews = {
  '/': '/img/home-preview.jpg',
  '/work': '/img/work-preview.jpg',
  '/about': '/img/about-preview.jpg',
  '/contact': '/img/contact-preview.jpg'
};

menuLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    previewImg.src = previews[link.getAttribute('href')] || '';
    preview.classList.add('is-visible');
  });
  link.addEventListener('mouseleave', () => {
    preview.classList.remove('is-visible');
  });
});

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animatePreview() {
  currentX += (mouseX - currentX) * 0.1;
  currentY += (mouseY - currentY) * 0.1;
  preview.style.transform = `translate(${currentX}px, ${currentY}px)`;
  requestAnimationFrame(animatePreview);
}
animatePreview();
```

## Hidden Nav on Scroll

Navigation appears on scroll up, hides on scroll down.

```javascript
let lastScroll = 0;
const nav = document.querySelector('[data-auto-hide-nav]');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 100) {
    if (currentScroll > lastScroll) {
      // Scrolling down — hide
      nav.classList.add('nav--hidden');
    } else {
      // Scrolling up — show
      nav.classList.remove('nav--hidden');
    }
  } else {
    // At top — always show
    nav.classList.remove('nav--hidden');
  }

  lastScroll = currentScroll;
}, { passive: true });
```

```css
[data-auto-hide-nav] {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 8000;
  transform: translateY(0);
  transition: transform 0.4s var(--ease-out-expo);
}

[data-auto-hide-nav].nav--hidden {
  transform: translateY(-100%);
}
```

## Mega Menu

For sites with 20+ pages. Multi-column layouts with descriptive text, embedded search, featured content.

```css
.mega-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: clamp(2rem, 4vw, 3rem);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
}

.mega-menu.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mega-menu__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.mega-menu__column h4 {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.mega-menu__column a {
  display: block;
  padding: 0.4rem 0;
  color: var(--text);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color 0.2s, transform 0.2s;
}

.mega-menu__column a:hover {
  color: var(--accent);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .mega-menu__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Accessibility for Navigation

```html
<!-- Hamburger button needs aria attributes -->
<button
  class="menu-toggle"
  data-menu-toggle
  aria-label="Open menu"
  aria-expanded="false"
  aria-controls="overlay-menu"
>
  <span></span>
  <span></span>
</button>

<!-- Overlay menu needs to be hidden from screen readers when closed -->
<nav class="overlay-menu" data-overlay-menu aria-hidden="true" id="overlay-menu">
  ...
</nav>
```

```javascript
toggle.addEventListener('click', () => {
  const isOpen = menu.classList.contains('is-open');
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  menu.setAttribute('aria-hidden', !isOpen);
});

// Trap focus inside open menu
document.addEventListener('keydown', (e) => {
  if (!menu.classList.contains('is-open')) return;
  if (e.key === 'Tab') {
    const focusable = menu.querySelectorAll('a, button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
```
