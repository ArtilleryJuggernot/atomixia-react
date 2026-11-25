import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

function source(path: string): string {
  const absolute = join(root, path);
  return existsSync(absolute) ? readFileSync(absolute, 'utf8') : '';
}

test('le menu mobile expose son état et gère le focus, Échap et les liens', () => {
  const header = source('src/components/Header.astro');

  assert.match(header, /aria-expanded=["'{]/u);
  assert.match(header, /aria-controls=["']mobile-menu["']/u);
  assert.match(header, /Escape/u);
  assert.match(header, /Tab/u);
  assert.match(header, /querySelectorAll<HTMLElement>/u);
  assert.match(header, /closest\(['"]a['"]\)/u);
});

test('la barre mobile observe le hero, le CTA final et le pied de page et réserve le body', () => {
  const mobileCta = source('src/components/MobileCta.astro');

  assert.match(mobileCta, /\[data-page-hero\]/u);
  assert.match(mobileCta, /\[data-final-cta\]/u);
  assert.match(mobileCta, /footer/u);
  assert.match(mobileCta, /IntersectionObserver/u);
  assert.match(mobileCta, /document\.body\.classList/u);
});

test('les coordonnées restent centralisées dans site.ts', () => {
  const sourceRoot = join(root, 'src');
  const offenders: string[] = [];
  const contactValue = /hugo\.jacquel@atomixia\.fr|(?:\+33|0)[\s.-]*7[\s.-]*81[\s.-]*22[\s.-]*31[\s.-]*71/iu;

  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      if (
        entry.isFile()
        && ['.astro', '.ts', '.tsx'].includes(extname(entry.name))
        && path !== join(sourceRoot, 'lib/site.ts')
        && contactValue.test(readFileSync(path, 'utf8'))
      ) {
        offenders.push(path.slice(root.length));
      }
    }
  };

  visit(sourceRoot);
  assert.deepEqual(offenders, []);
});

test('le shell utilise les coordonnées centralisées dans le contactPoint JSON-LD', () => {
  const base = source('src/layouts/Base.astro');

  assert.match(base, /contactPoint/u);
  assert.match(base, /contactType:\s*['"]sales['"]/u);
  assert.match(base, /telephone:\s*site\.phoneTel/u);
  assert.match(base, /email:\s*site\.email/u);
  assert.match(base, /availableLanguage:\s*['"]fr['"]/u);
  assert.doesNotMatch(base, /priceRange/u);
});

test('les polices utilisent swap et des fallbacks ajustés', () => {
  const fonts = source('src/styles/fonts.css');

  assert.doesNotMatch(fonts, /font-display:\s*optional/u);
  assert.equal((fonts.match(/font-display:\s*swap/gu) ?? []).length, 8);
  assert.match(fonts, /size-adjust:/u);
  assert.match(fonts, /ascent-override:/u);
});

test('navigation, CTA et liens de pied de page ont une cible de 44 px', () => {
  const css = source('src/styles/global.css');

  assert.match(css, /\.nav-link[\s\S]*?min-height:\s*44px/u);
  assert.match(css, /\.mobile-header-action[\s\S]*?width:\s*44px[\s\S]*?height:\s*44px/u);
  assert.match(css, /\.mobile-cta-link[\s\S]*?min-height:\s*56px/u);
  assert.match(css, /\.footer-link[\s\S]*?min-height:\s*44px/u);
});
