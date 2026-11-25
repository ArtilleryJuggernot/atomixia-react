import assert from 'node:assert/strict';
import test from 'node:test';
import { mainWordCount, normalizedText, publicHtmlFiles } from './site-output.ts';

const h1Targets: Record<string, string> = {
  '/': 'Gagnez du temps. Gardez la main.',
  '/a-propos/': 'Un studio à taille humaine.',
  '/agents/': 'Les agents',
  '/contact/': 'Demandez votre devis gratuit.',
  '/expertises/conseil-systeme-information/': "Y voir clair avant d'investir.",
  '/expertises/cybersecurite-pentest/': 'Trouvez vos failles avant les attaquants.',
  '/realisations/': 'Réalisations',
  '/sites/': 'Un site qui vous ressemble et qui fait venir les demandes.',
  '/solutions/automatisation-ia/': 'Vos tâches répétitives, préparées par un agent.',
  '/solutions/saas-logiciels/': 'Le logiciel qui manque à votre métier.',
  '/usages/': 'Une tâche répétitive ? Confiez-la à un agent.',
};

const wordBudgets: Record<string, number> = {
  '/': 450,
  '/a-propos/': 170,
  '/agents/': 120,
  '/agents/commercial/': 130,
  '/agents/connaissance/': 130,
  '/agents/facturation/': 130,
  '/agents/messagerie/': 130,
  '/agents/quotidien/': 130,
  '/agents/sur-mesure/': 130,
  '/contact/': 60,
  '/expertises/conseil-systeme-information/': 220,
  '/expertises/cybersecurite-pentest/': 250,
  '/realisations/': 300,
  '/sites/': 220,
  '/solutions/automatisation-ia/': 220,
  '/solutions/saas-logiciels/': 220,
  '/usages/': 180,
};

test('les pages éditoriales utilisent les H1 cibles', async (t) => {
  const pages = new Map(publicHtmlFiles().map((file) => [file.route, file.html]));

  for (const [route, expected] of Object.entries(h1Targets)) {
    await t.test(route, () => {
      const html = pages.get(route);
      assert.ok(html, `Le build doit produire ${route}.`);
      const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
      assert.ok(h1, `${route} doit contenir un H1.`);
      assert.equal(normalizedText(h1[1]), expected, `H1 inattendu pour ${route}.`);
    });
  }
});

test('les contenus principaux respectent leurs budgets à ±10 %', async (t) => {
  const pages = new Map(publicHtmlFiles().map((file) => [file.route, file.html]));

  for (const [route, budget] of Object.entries(wordBudgets)) {
    await t.test(route, () => {
      const html = pages.get(route);
      assert.ok(html, `Le build doit produire ${route}.`);
      const count = mainWordCount(html);
      const tolerance = budget * 0.1;
      assert.ok(
        count >= budget - tolerance && count <= budget + tolerance,
        `${route} contient ${count} mots dans <main> ; attendu ${budget} ±10 %.`,
      );
    });
  }
});

test('la méthode comporte quatre étapes partout', async (t) => {
  const pages = new Map(publicHtmlFiles().map((file) => [file.route, file.html]));

  for (const route of ['/', '/a-propos/']) {
    await t.test(route, () => {
      const html = pages.get(route);
      assert.ok(html, `Le build doit produire ${route}.`);
      assert.match(html, /\bid=["']methode["']/i, `${route} doit exposer la section #methode.`);
      const steps = html.match(/\bdata-method-step(?:\s|=|>)/gi) ?? [];
      assert.equal(steps.length, 4, `${route} doit comporter exactement quatre étapes de méthode.`);
    });
  }
});
