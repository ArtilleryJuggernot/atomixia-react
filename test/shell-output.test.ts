import assert from 'node:assert/strict';
import test from 'node:test';
import { decodedHtml, publicHtmlFiles } from './site-output.ts';

test('chaque page publique rend le shell de conversion', async (t) => {
  for (const { route, html } of publicHtmlFiles()) {
    await t.test(route, () => {
      const decoded = decodedHtml(html);
      const headers = decoded.match(/<header\b[^>]*\bid=["']site-header["']/giu) ?? [];
      const violations: string[] = [];

      if (/\sstyle\s*=/iu.test(decoded)) violations.push('attribut style');
      if (/<style\b/iu.test(decoded)) violations.push('balise style');
      if (!/href=["']tel:\+33781223171["']/i.test(decoded)) violations.push('téléphone absent');
      if (!/href=["']mailto:hugo\.jacquel@atomixia\.fr(?:[?'"])/i.test(decoded)) {
        violations.push('e-mail absent');
      }
      if (!/href=["']\/contact["'][^>]*>[\s\S]*?Demander un devis gratuit/iu.test(decoded)) {
        violations.push('lien devis absent');
      }
      if (headers.length !== 1) violations.push(`${headers.length} en-tête(s)`);
      if (!/"contactPoint"\s*:/u.test(decoded)) violations.push('contactPoint JSON-LD absent');
      if (route === '/contact/' && /\bdata-mobile-cta(?:\s|=|>)/iu.test(decoded)) {
        violations.push('barre mobile présente sur contact');
      }
      if (route !== '/contact/' && !/\bdata-mobile-cta(?:\s|=|>)/iu.test(decoded)) {
        violations.push('barre mobile absente');
      }

      assert.deepEqual(violations, [], `${route} viole les contrats du shell.`);
    });
  }
});
