# WebGL / 3D

Use WebGL ONLY when the brand IS the experience. For SaaS/product sites, skip it — the performance cost is too high.

## When to Use WebGL

| Use WebGL | Skip WebGL |
|-----------|-----------|
| Creative agencies | SaaS dashboards |
| Fashion / luxury brands | E-commerce (unless product configurator) |
| Automotive | Blogs / editorial |
| Art portfolios | Documentation |
| Gaming / entertainment | Corporate websites |
| Music releases | Landing pages (unless hero-only) |

A single Spline scene loads 800KB to 2MB of JavaScript before the user sees anything. Lighthouse scores collapse. Core Web Vitals fail. Mobile users on 4G drop the page before the WebGL loads.

## Framework Selection

| Framework | When | Size |
|-----------|------|------|
| Three.js | Maximum control, non-React projects | ~150KB |
| React Three Fiber | React apps, rapid prototyping with Drei | ~30KB over Three.js |
| OGL | Bundle size critical, custom shaders | 29KB total |
| Curtains.js | Lightweight image-on-plane distortion | ~30KB |

## Setup Patterns

### Lazy-Load Three.js (Critical)

Never block initial render with WebGL. Load the context only when its section enters viewport.

```javascript
// Only load Three.js when the WebGL section is near
const observer = new IntersectionObserver(async (entries) => {
  if (entries[0].isIntersecting) {
    const { default: THREE } = await import('three');
    initScene(THREE);
    observer.disconnect();
  }
}, { rootMargin: '200px' });

observer.observe(document.querySelector('[data-webgl]'));
```

### Provide 2D Fallback

```javascript
if (!window.WebGLRenderingContext) {
  // Fallback: use CSS animations or static image
  document.querySelector('[data-webgl]').classList.add('webgl-fallback');
}
```

```css
.webgl-fallback canvas {
  display: none;
}

.webgl-fallback .fallback-image {
  display: block;
}

[data-webgl] .fallback-image {
  display: none;
}
```

## Common Award-Winning WebGL Effects

### 1. Image Hover Distortion (Vertex Displacement Shader)

```glsl
// Vertex shader
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Distort vertices based on mouse proximity
  float dist = distance(uv, uMouse);
  float wave = sin(dist * 10.0 - uTime * 2.0) * 0.1 * (1.0 - dist);
  pos.z += wave;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

```glsl
// Fragment shader
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = color;
}
```

### 2. Particle System with Custom GLSL

```javascript
import * as THREE from 'three';

const particleCount = 5000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i]     = (Math.random() - 0.5) * 20;
  positions[i + 1] = (Math.random() - 0.5) * 20;
  positions[i + 2] = (Math.random() - 0.5) * 20;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3() }
  },
  vertexShader: `
    uniform float uTime;
    uniform vec3 uMouse;
    varying float vDistance;

    void main() {
      vec3 pos = position;
      // Gentle floating motion
      pos.y += sin(uTime + position.x * 0.5) * 0.3;
      pos.x += cos(uTime + position.z * 0.5) * 0.3;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vDistance = distance(pos, uMouse);
      gl_PointSize = 3.0 * (300.0 / -mvPosition.z) * (1.0 - vDistance * 0.1);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying float vDistance;
    void main() {
      float alpha = 1.0 - vDistance * 0.05;
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `,
  transparent: true,
  depthWrite: false
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);
```

### 3. Post-Processing Chain (Bloom, Vignette, Color Grading)

```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8,  // strength
  0.4,  // radius
  0.85  // threshold
);
composer.addPass(bloomPass);

// Render with composer instead of renderer
function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
```

### 4. Shader-Based Image-to-Image Transition

```glsl
// Fragment shader for image transition
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
varying vec2 vUv;

void main() {
  vec4 color1 = texture2D(uTexture1, vUv);
  vec4 color2 = texture2D(uTexture2, vUv);

  // Noise-based transition
  float noise = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
  float threshold = uProgress;
  float mixValue = smoothstep(threshold - 0.1, threshold + 0.1, noise);

  gl_FragColor = mix(color1, color2, mixValue);
}
```

## WebGPU

WebGPU replaces WebGL for high-performance 3D. Three.js support is production-ready since r171+ (September 2025), with automatic WebGL fallback.

```javascript
// Three.js WebGPU (r171+)
import * as THREE from 'three/webgpu';

// Automatically uses WebGPU if available, falls back to WebGL
const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init();
```

Three Shading Language (TSL) lets you write shader logic in JavaScript/TypeScript, compiled to WGSL. Safari 26 added support. Cross-browser availability is now complete.

## Performance Budgets for WebGL

| Metric | Target |
|--------|--------|
| Initial JS payload (Three.js) | < 150KB gzipped |
| Total page weight with WebGL | < 2MB |
| Frame rate | 60fps desktop, 30fps mobile |
| WebGL context init (lazy) | < 1s after section enters viewport |
| GPU memory | < 100MB |

**Techniques:**
- Lazy-load: dynamic import Three.js only when section enters viewport
- Reduce particle counts on mobile (check `navigator.hardwareConcurrency`)
- Use `powerPreference: 'high-performance'` on the renderer
- Dispose geometries, materials, and textures when leaving the section
- Pause render loop when section is off-screen (`IntersectionObserver`)
- Use compressed textures (KTX2/Basis)
- Limit post-processing passes on mobile (skip bloom, keep only tone mapping)

```javascript
// Pause rendering when off-screen
let isVisible = true;
const observer = new IntersectionObserver(([entry]) => {
  isVisible = entry.isIntersecting;
});
observer.observe(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  if (!isVisible) return;  // Skip render when off-screen
  renderer.render(scene, camera);
}
```
