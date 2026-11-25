import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const outputRoot = join(process.cwd(), 'dist', 'client');
const buildRequiredMessage =
  'Le build Astro est absent : exécutez `npm run build` avant `npm test`.';

export type PublicHtmlFile = {
  path: string;
  route: string;
  html: string;
};

function routeFromPath(path: string): string {
  const outputPath = relative(outputRoot, path).split(sep).join('/');
  const route = outputPath.replace(/(?:^|\/)index\.html$/, '');
  return route ? `/${route}/` : '/';
}

export function publicHtmlFiles(): PublicHtmlFile[] {
  assert.ok(existsSync(outputRoot), buildRequiredMessage);

  const paths: string[] = [];
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      if (entry.isFile() && entry.name === 'index.html') paths.push(path);
    }
  };

  visit(outputRoot);
  assert.ok(paths.length > 0, buildRequiredMessage);

  return paths
    .sort()
    .map((path) => ({ path, route: routeFromPath(path), html: readFileSync(path, 'utf8') }));
}

function visibleText(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&(?:amp|#38);/gi, '&')
    .replace(/&(?:apos|#39);/gi, "'")
    .replace(/&(?:quot|#34);/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function mainWordCount(html: string): number {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  assert.ok(main, 'Le document construit doit contenir un élément <main>.');
  return visibleText(main[1]).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  test('chaque page publique expose les coordonnées de contact', () => {
    for (const { route, html } of publicHtmlFiles()) {
      assert.match(html, /href=["']tel:\+33781223171["']/i, `${route} doit proposer le téléphone.`);
      assert.match(
        html,
        /href=["']mailto:hugo\.jacquel@atomixia\.fr["']/i,
        `${route} doit proposer l’e-mail.`,
      );
    }
  });

  test('le HTML public ne contient aucun prix', () => {
    const forbiddenPrice = /€|(?:\b(?:tarifs?|HT|TTC)\b)|à partir de|\/\s*mois/iu;

    for (const { route, html } of publicHtmlFiles()) {
      assert.doesNotMatch(visibleText(html), forbiddenPrice, `${route} contient une mention de prix.`);
    }
  });

  test('le HTML public ne contient aucun attribut style', () => {
    for (const { route, html } of publicHtmlFiles()) {
      assert.doesNotMatch(html, /\sstyle\s*=/iu, `${route} contient un attribut style.`);
    }
  });

  test('le HTML public ne contient aucun emoji', () => {
    for (const { route, html } of publicHtmlFiles()) {
      assert.doesNotMatch(
        visibleText(html),
        /(?![©®™])\p{Extended_Pictographic}/gu,
        `${route} contient un emoji.`,
      );
    }
  });
}
