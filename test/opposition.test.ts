import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { emailFromSearch, hasOpposition, normalizeEmail, oppositionLink, recordOpposition } from '../src/lib/opposition.ts';
import { site } from '../src/lib/site.ts';

async function tempFile(): Promise<{ dir: string; file: string }> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'atomixia-opposition-'));
  return { dir, file: path.join(dir, 'nested', 'oppositions.jsonl') };
}

test('normalise une adresse professionnelle', () => {
  assert.equal(normalizeEmail('  Ada@Exemple.FR '), 'ada@exemple.fr');
  assert.equal(normalizeEmail('pas-une-adresse'), null);
  assert.equal(normalizeEmail('a@b'), null);
  assert.equal(normalizeEmail('<script>alert(1)</script>@exemple.fr'), null);
  assert.equal(normalizeEmail('ada..veille@exemple.fr'), null);
  assert.equal(normalizeEmail(`${'a'.repeat(110)}@exemple.fr`), null);
});

test('lit le paramètre email ou mail, y compris le signe plus', () => {
  assert.deepEqual(emailFromSearch('?email=Ada%40Exemple.fr'), { present: true, email: 'ada@exemple.fr' });
  assert.deepEqual(emailFromSearch('mail=ada%2Bveille%40exemple.fr'), { present: true, email: 'ada+veille@exemple.fr' });
  assert.deepEqual(emailFromSearch('?email=ada+veille@exemple.fr'), { present: true, email: 'ada+veille@exemple.fr' });
  assert.deepEqual(emailFromSearch('?sujet=bonjour&email=ada@exemple.fr'), { present: true, email: 'ada@exemple.fr' });
  assert.deepEqual(emailFromSearch('?email='), { present: true, email: null });
  assert.deepEqual(emailFromSearch(''), { present: false, email: null });
  assert.deepEqual(emailFromSearch('?email=%'), { present: true, email: null });
});

test('construit un lien qui se relit', () => {
  const link = oppositionLink('Ada+Veille@Exemple.fr');
  assert.equal(link, `${site.url}/desinscription?email=ada%2Bveille%40exemple.fr`);
  assert.equal(emailFromSearch(new URL(link ?? '').search).email, 'ada+veille@exemple.fr');
  assert.equal(oppositionLink('invalide'), null);
});

test('enregistre une opposition une seule fois', async () => {
  const { dir, file } = await tempFile();
  try {
    const first = await recordOpposition('Ada@Exemple.fr', file);
    const second = await recordOpposition('ada@exemple.fr', file);
    assert.deepEqual(first, { email: 'ada@exemple.fr', created: true });
    assert.deepEqual(second, { email: 'ada@exemple.fr', created: false });
    assert.equal(await hasOpposition('ADA@exemple.fr', file), true);
    assert.equal(await hasOpposition('autre@exemple.fr', file), false);

    const lines = (await readFile(file, 'utf8')).trim().split('\n');
    assert.equal(lines.length, 1);
    const stored = JSON.parse(lines[0]) as { email: string; at: string; source: string };
    assert.equal(stored.email, 'ada@exemple.fr');
    assert.equal(stored.source, 'lien');
    assert.match(stored.at, /^\d{4}-\d{2}-\d{2}T/);
    assert.deepEqual(Object.keys(stored).sort(), ['at', 'email', 'source']);
    assert.equal((await stat(file)).mode & 0o777, 0o600);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('deux clics simultanés ne créent pas de doublon', async () => {
  const { dir, file } = await tempFile();
  try {
    const results = await Promise.all([
      recordOpposition('a@exemple.fr', file),
      recordOpposition('a@exemple.fr', file),
    ]);
    assert.equal(results.filter((result) => result.created).length, 1);
    const lines = (await readFile(file, 'utf8')).trim().split('\n');
    assert.equal(lines.length, 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('une ligne illisible n’empêche pas l’enregistrement', async () => {
  const { dir, file } = await tempFile();
  try {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, 'ceci n’est pas du json\n{"email":"deja@exemple.fr"}', 'utf8');
    const result = await recordOpposition('nouveau@exemple.fr', file);
    assert.equal(result.created, true);
    assert.equal(await hasOpposition('deja@exemple.fr', file), true);
    assert.equal(await hasOpposition('nouveau@exemple.fr', file), true);
    const raw = await readFile(file, 'utf8');
    assert.match(raw, /nouveau@exemple\.fr/);
    assert.match(raw, /\n$/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('refuse d’enregistrer une adresse invalide', async () => {
  const { dir, file } = await tempFile();
  try {
    await assert.rejects(() => recordOpposition('pas-un-email', file));
    assert.equal(await hasOpposition('pas-un-email', file), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
