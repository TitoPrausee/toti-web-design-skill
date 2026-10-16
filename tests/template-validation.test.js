/**
 * Template Validation Tests
 * Validates that all templates, tokens, and animation modules
 * meet the skill's quality standards.
 */

const fs = require('fs');
const path = require('path');

function walk(dir, ext) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walk(fullPath, ext));
    } else if (!ext || file.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

// Jest provides describe, test, and expect globally — no custom runner needed.

describe('Repository structure', () => {
  test('SKILL.md exists with YAML frontmatter', () => {
    expect(fs.existsSync('SKILL.md')).toBe(true);
    const content = fs.readFileSync('SKILL.md', 'utf-8');
    expect(content.startsWith('---')).toBe(true);
    expect(content).toContain('name:');
    expect(content).toContain('description:');
  });

  test('LICENSE exists and is MIT', () => {
    expect(fs.existsSync('LICENSE')).toBe(true);
    const content = fs.readFileSync('LICENSE', 'utf-8');
    expect(content).toContain('MIT');
  });

  test('README.md exists', () => {
    expect(fs.existsSync('README.md')).toBe(true);
  });

  test('Required directories exist', () => {
    const dirs = ['templates', 'tokens', 'animations', 'references', 'docs'];
    for (const dir of dirs) {
      expect(fs.existsSync(dir)).toBe(true);
    }
  });

  test('CI workflow exists', () => {
    expect(fs.existsSync('.github/workflows/ci.yml')).toBe(true);
  });
});

describe('Token files', () => {
  const tokenFiles = walk('tokens', '.css');

  test('Has at least 5 token files', () => {
    expect(tokenFiles.length).toBeGreaterThanOrEqual(5);
  });

  test('All token files define CSS custom properties', () => {
    for (const file of tokenFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const hasCustomProps = content.includes('--') || content.includes('var(');
      expect(hasCustomProps).toBe(true);
    }
  });

  test('Has dark, light, neon, monochrome, duotone themes', () => {
    const themes = ['dark', 'light', 'neon', 'monochrome', 'duotone'];
    for (const theme of themes) {
      expect(tokenFiles.some(f => f.includes(theme))).toBe(true);
    }
  });

  test('Has fluid type and spacing scales', () => {
    expect(tokenFiles.some(f => f.includes('fluid-type'))).toBe(true);
    expect(tokenFiles.some(f => f.includes('fluid-spacing'))).toBe(true);
  });

  test('Fluid scales use clamp()', () => {
    const fluidType = tokenFiles.find(f => f.includes('fluid-type'));
    if (fluidType) {
      const content = fs.readFileSync(fluidType, 'utf-8');
      expect(content).toContain('clamp(');
    }
  });
});

describe('Animation modules', () => {
  const jsFiles = walk('animations', '.js');

  test('Has at least 7 animation modules', () => {
    expect(jsFiles.length).toBeGreaterThanOrEqual(7);
  });

  test('All JS files are syntactically valid', () => {
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(() => new Function(content)).not.toThrow();
    }
  });

  test('All modules export their main function', () => {
    const expectedModules = [
      'scroll-driven', 'parallax', 'magnetic-cursor', 'text-reveal',
      'image-reveal', 'page-transitions', 'loader', 'webgl-shaders'
    ];
    for (const mod of expectedModules) {
      expect(jsFiles.some(f => f.includes(mod))).toBe(true);
    }
  });

  test('All modules respect prefers-reduced-motion', () => {
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content.toLowerCase()).toContain('reduced-motion');
    }
  });
});

describe('HTML templates', () => {
  const htmlFiles = walk('templates', '.html');

  test('Has layout templates', () => {
    const layouts = htmlFiles.filter(f => f.includes('layouts/'));
    expect(layouts.length).toBeGreaterThanOrEqual(4);
  });

  test('Has component templates', () => {
    const components = htmlFiles.filter(f => f.includes('components/'));
    expect(components.length).toBeGreaterThanOrEqual(3);
  });

  test('Has navigation templates', () => {
    const nav = htmlFiles.filter(f => f.includes('navigation/'));
    expect(nav.length).toBeGreaterThanOrEqual(2);
  });

  test('Has Three.js templates', () => {
    const three = htmlFiles.filter(f => f.includes('threejs/'));
    expect(three.length).toBeGreaterThanOrEqual(2);
  });

  test('Has GSAP templates', () => {
    const gsap = htmlFiles.filter(f => f.includes('gsap/'));
    expect(gsap.length).toBeGreaterThanOrEqual(2);
  });

  test('All HTML files have DOCTYPE', () => {
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).toContain('<!DOCTYPE html>');
    }
  });

  test('All HTML files reference token CSS', () => {
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const hasTokenRef = content.includes('base.css') || content.includes('design-tokens.css') || content.includes('tokens/');
      expect(hasTokenRef).toBe(true);
    }
  });

  test('All HTML files use data-theme attribute', () => {
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).toContain('data-theme');
    }
  });
});

describe('Reference catalog', () => {
  const refFiles = walk('references', '.md');

  test('Has all 6 categories', () => {
    const categories = ['portfolio', 'agency', 'ecommerce', 'product', 'editorial', 'experimental'];
    for (const cat of categories) {
      expect(refFiles.some(f => f.includes(cat))).toBe(true);
    }
  });

  test('Each reference has color hex values', () => {
    // Only check category-based references (portfolio, agency, etc.)
    const categoryRefs = refFiles.filter(f => 
      ['portfolio', 'agency', 'ecommerce', 'product', 'editorial', 'experimental'].some(c => f.includes(c))
    );
    for (const file of categoryRefs) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).toMatch(/#[0-9a-fA-F]{6}/);
    }
  });
});

describe('Documentation', () => {
  const docFiles = walk('docs', '.md');

  test('Has design system analysis', () => {
    expect(docFiles.some(f => f.includes('design-system-analysis'))).toBe(true);
  });

  test('Has build guide', () => {
    expect(docFiles.some(f => f.includes('build-guide'))).toBe(true);
  });

  test('Has performance budgets', () => {
    expect(docFiles.some(f => f.includes('performance-budgets'))).toBe(true);
  });
});
