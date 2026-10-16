/**
 * WebGL Shader Effects Module — shader-based background effects, DPR-aware.
 * Usage: <canvas data-webgl-shader="gradient"></canvas>
 *   <canvas data-webgl-shader="noise" data-shader-speed="0.5"></canvas>
 *   <canvas data-webgl-shader="plasma" data-shader-color1="#578bfc" data-shader-color2="#00fe40"></canvas>
 */
const WebGLShaders = (() => {
  let canvases = [], programs = [], rafId = null, startTime = 0;
  const config = {
    vertexShader: 'attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }',
    fragmentShaders: {
      gradient: 'precision mediump float; uniform vec2 u_resolution; uniform float u_time; uniform vec3 u_color1; uniform vec3 u_color2; void main() { vec2 uv = gl_FragCoord.xy / u_resolution.xy; float t = sin(u_time * 0.3) * 0.5 + 0.5; vec3 color = mix(u_color1, u_color2, uv.y * t); gl_FragColor = vec4(color, 1.0); }',
      noise: 'precision mediump float; uniform vec2 u_resolution; uniform float u_time; uniform float u_speed; float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); } float noise(vec2 st) { vec2 i = floor(st); vec2 f = fract(st); float a = random(i); float b = random(i + vec2(1.0, 0.0)); float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y; } void main() { vec2 st = gl_FragCoord.xy / u_resolution.xy; st *= 3.0; float n = noise(st + u_time * u_speed * 0.1); n += noise(st * 2.0 + u_time * u_speed * 0.15) * 0.5; n += noise(st * 4.0 + u_time * u_speed * 0.2) * 0.25; n /= 1.75; gl_FragColor = vec4(vec3(n * 0.15), 1.0); }',
      plasma: 'precision mediump float; uniform vec2 u_resolution; uniform float u_time; uniform vec3 u_color1; uniform vec3 u_color2; void main() { vec2 uv = gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0; float t = u_time * 0.5; float v = sin(uv.x * 3.0 + t); v += sin(uv.y * 4.0 + t * 1.3); v += sin((uv.x + uv.y) * 2.5 + t * 0.8); v += sin(length(uv) * 6.0 - t * 1.5); v *= 0.25; vec3 color = mix(u_color1, u_color2, v * 0.5 + 0.5); gl_FragColor = vec4(color, 1.0); }',
    },
  };
  function hexToRgb(hex) { const r = parseInt(hex.slice(1, 3), 16) / 255; const g = parseInt(hex.slice(3, 5), 16) / 255; const b = parseInt(hex.slice(5, 7), 16) / 255; return [r, g, b]; }
  function createShader(gl, type, source) { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; } return shader; }
  function createProgram(gl, vs, fs) { const v = createShader(gl, gl.VERTEX_SHADER, vs); const f = createShader(gl, gl.FRAGMENT_SHADER, fs); if (!v || !f) return null; const p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p); return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null; }
  function setupCanvas(canvas) {
    const type = canvas.dataset.webglShader || 'gradient';
    const fsSource = config.fragmentShaders[type]; if (!fsSource) return null;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'); if (!gl) return null;
    const program = createProgram(gl, config.vertexShader, fsSource); if (!program) return null;
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position'); gl.enableVertexAttribArray(posLoc); gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    return { canvas, gl, program, uniforms: { resolution: gl.getUniformLocation(program, 'u_resolution'), time: gl.getUniformLocation(program, 'u_time'), speed: gl.getUniformLocation(program, 'u_speed'), color1: gl.getUniformLocation(program, 'u_color1'), color2: gl.getUniformLocation(program, 'u_color2') }, type };
  }
  function resize(canvas) { const dpr = Math.min(window.devicePixelRatio || 1, 2); const rect = canvas.getBoundingClientRect(); const w = Math.max(rect.width, 1), h = Math.max(rect.height, 1); if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; } }
  function render() {
    const time = (Date.now() - startTime) / 1000;
    programs.forEach(({ canvas, gl, program, uniforms }) => {
      resize(canvas); gl.viewport(0, 0, canvas.width, canvas.height); gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height); gl.uniform1f(uniforms.time, time);
      if (uniforms.speed) gl.uniform1f(uniforms.speed, parseFloat(canvas.dataset.shaderSpeed || '1'));
      if (uniforms.color1) { const c = hexToRgb(canvas.dataset.shaderColor1 || '#578bfc'); gl.uniform3f(uniforms.color1, c[0], c[1], c[2]); }
      if (uniforms.color2) { const c = hexToRgb(canvas.dataset.shaderColor2 || '#00fe40'); gl.uniform3f(uniforms.color2, c[0], c[1], c[2]); }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });
    rafId = requestAnimationFrame(render);
  }
  function init(options = {}) {
    Object.assign(config, options);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    canvases = Array.from(document.querySelectorAll('[data-webgl-shader]'));
    programs = canvases.map(setupCanvas).filter(Boolean);
    if (programs.length === 0) return;
    startTime = Date.now(); render();
  }
  function destroy() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } programs.forEach(({ gl }) => { const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }); programs = []; canvases = []; }
  return { init, destroy };
})();
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => WebGLShaders.init());
if (typeof module !== 'undefined' && module.exports) module.exports = WebGLShaders;
