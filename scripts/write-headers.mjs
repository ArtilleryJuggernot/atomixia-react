import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const source = 'dist/_experimentalHeaders.json';
const target = 'dist/client/_headers';

if (!existsSync(source) || !existsSync(target)) {
  console.error('En-têtes de build introuvables.');
  process.exit(1);
}

const routes = JSON.parse(readFileSync(source, 'utf8'));
const securityHeaders = [
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'DENY'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()'],
  ['Cross-Origin-Opener-Policy', 'same-origin'],
  ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'],
];

for (const route of routes) {
  for (const [key, value] of securityHeaders) {
    if (!route.headers.some((header) => header.key === key)) {
      route.headers.push({ key, value });
    }
  }
}
writeFileSync(source, JSON.stringify(routes, null, 2));

const policy = routes
  .flatMap((route) => route.headers)
  .find((header) => header.key === 'Content-Security-Policy');

if (!policy) {
  console.error('Politique de contenu absente du build.');
  process.exit(1);
}

const current = readFileSync(target, 'utf8');
if (!current.includes('Content-Security-Policy')) {
  writeFileSync(target, `${current.trimEnd()}\n\n/*\n  Content-Security-Policy: ${policy.value}\n`);
}
