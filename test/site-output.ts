import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';
import { decodeHTML } from 'entities';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const outputRoot = join(repositoryRoot, 'dist', 'client');
const buildRequiredMessage =
  'Le build Astro est absent : exécutez `npm run build` avant `npm test`.';

export type PublicHtmlFile = {
  path: string;
  route: string;
  html: string;
};

function routeFromPath(path: string): string {
  const outputPath = relative(outputRoot, path).split(sep).join('/');
  if (outputPath === 'index.html') return '/';
  if (!outputPath.endsWith('/index.html')) return `/${outputPath.replace(/\.html$/, '')}`;
  const route = outputPath.replace(/(?:^|\/)index\.html$/, '');
  return `/${route}/`;
}

export function publicHtmlFiles(): PublicHtmlFile[] {
  assert.ok(existsSync(outputRoot), buildRequiredMessage);

  const paths: string[] = [];
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      if (entry.isFile() && entry.name.endsWith('.html')) paths.push(path);
    }
  };

  visit(outputRoot);
  assert.ok(paths.length > 0, buildRequiredMessage);

  return paths
    .sort()
    .map((path) => ({ path, route: routeFromPath(path), html: readFileSync(path, 'utf8') }));
}

export function decodedHtml(html: string): string {
  return decodeHTML(html);
}

export function visibleText(html: string): string {
  return decodedHtml(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

export function mainWordCount(html: string): number {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  assert.ok(main, 'Le document construit doit contenir un élément <main>.');
  return visibleText(main[1]).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export function normalizedText(html: string): string {
  return visibleText(html);
}
