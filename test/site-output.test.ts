import assert from 'node:assert/strict';
import test from 'node:test';
import { decodedHtml, publicHtmlFiles } from './site-output.ts';

const forbiddenPriceText = /€|tarifs?|à partir de|\/\s*mois/giu;
const forbiddenPriceInitials = /\b(?:HT|TTC)\b/gu;

function uniqueMatches(value: string, pattern: RegExp): string[] {
  return [...new Set(value.match(pattern) ?? [])];
}

function forbiddenPrices(html: string): string[] {
  const decoded = decodedHtml(html);
  return [
    ...uniqueMatches(decoded, forbiddenPriceText),
    ...uniqueMatches(decoded, forbiddenPriceInitials),
  ];
}

test('décode les entités et respecte la casse de HT et TTC', () => {
  const html =
    '<script type="application/ld+json">{"price":"&#8364;","offer":"Tarif &agrave; partir des 10&nbsp;/mois","tax":"HT TTC","safe":"https HTML ht ttc"}</script>';

  assert.deepEqual(forbiddenPrices(html), ['€', 'Tarif', 'à partir de', '/mois', 'HT', 'TTC']);
});

test('chaque page publique respecte les contrats de sortie', async (t) => {
  for (const { route, html } of publicHtmlFiles()) {
    await t.test(route, () => {
      const decoded = decodedHtml(html);
      const violations: string[] = [];
      const prices = forbiddenPrices(html);

      if (prices.length > 0) violations.push(`prix interdits : ${prices.join(', ')}`);
      if (/\sstyle\s*=/iu.test(decoded)) violations.push('attribut style');
      if (/(?![©®™])\p{Extended_Pictographic}/u.test(decoded)) violations.push('emoji');
      if (!/href=["']tel:\+33781223171["']/i.test(decoded)) violations.push('téléphone absent');
      if (!/href=["']mailto:hugo\.jacquel@atomixia\.fr(?:[?'"])/i.test(decoded)) {
        violations.push('e-mail absent');
      }

      assert.deepEqual(violations, [], `${route} viole les contrats de sortie.`);
    });
  }
});
