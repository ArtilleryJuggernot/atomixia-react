import assert from 'node:assert/strict';
import test from 'node:test';
import { mainWordCount, publicHtmlFiles } from './site-output.test.ts';

const h1Targets: Record<string, string> = {
  '/': 'Des agents, des sites, des outils qui tiennent.',
  '/a-propos/': 'Atomixia, à Lyon',
  '/agents/': 'Les agents',
  '/contact/': 'Décrire le processus',
  '/expertises/conseil-systeme-information/':
    'Conseil en systèmes d’information Une architecture qui sert votre stratégie.',
  '/expertises/cybersecurite-pentest/':
    'Cybersécurité et pentest Identifiez les risques avant qu’ils ne deviennent des incidents.',
  '/realisations/': 'Réalisations',
  '/sites/': 'Sites métier et logiciels',
  '/solutions/automatisation-ia/':
    'Agents et automatisations Des processus plus intelligents.',
  '/solutions/saas-logiciels/':
    'Logiciels sur mesure et SaaS Vos idées deviennent des produits.',
  '/usages/': 'Vous avez une tâche répétitive ?',
};

const wordBudgets: Record<string, number> = {
  '/': 450,
  '/a-propos/': 200,
  '/agents/': 180,
  '/contact/': 170,
  '/expertises/conseil-systeme-information/': 350,
  '/expertises/cybersecurite-pentest/': 400,
  '/realisations/': 250,
  '/sites/': 350,
  '/solutions/automatisation-ia/': 450,
  '/solutions/saas-logiciels/': 400,
  '/usages/': 200,
};

function normalizedText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&(?:amp|#38);/gi, '&')
    .replace(/&(?:apos|#39);/gi, "'")
    .replace(/&(?:quot|#34);/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

test('les pages éditoriales utilisent les H1 cibles', () => {
  const pages = new Map(publicHtmlFiles().map((file) => [file.route, file.html]));

  for (const [route, expected] of Object.entries(h1Targets)) {
    const html = pages.get(route);
    assert.ok(html, `Le build doit produire ${route}.`);
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    assert.ok(h1, `${route} doit contenir un H1.`);
    assert.equal(normalizedText(h1[1]), expected, `H1 inattendu pour ${route}.`);
  }
});

test('les contenus principaux respectent leurs budgets à ±10 %', () => {
  const pages = new Map(publicHtmlFiles().map((file) => [file.route, file.html]));

  for (const [route, budget] of Object.entries(wordBudgets)) {
    const html = pages.get(route);
    assert.ok(html, `Le build doit produire ${route}.`);
    const count = mainWordCount(html);
    const tolerance = budget * 0.1;
    assert.ok(
      count >= budget - tolerance && count <= budget + tolerance,
      `${route} contient ${count} mots dans <main> ; attendu ${budget} ±10 %.`,
    );
  }
});

test('la page À propos expose une méthode en quatre étapes', () => {
  const about = publicHtmlFiles().find(({ route }) => route === '/a-propos/');
  assert.ok(about, 'Le build doit produire /a-propos/.');

  const method = about.html.match(
    /<(section|div)\b[^>]*\bid=["']methode["'][^>]*>([\s\S]*?)<\/\1>/i,
  );
  assert.ok(method, '/a-propos/ doit exposer la section #methode.');

  const steps = method[2].match(/<li\b/g) ?? [];
  assert.equal(steps.length, 4, 'La méthode doit comporter exactement quatre étapes.');
});
