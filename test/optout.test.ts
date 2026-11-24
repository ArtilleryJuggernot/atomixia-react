import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  collapseOptouts,
  emptyOptout,
  findOppositions,
  getOptout,
  hasOptoutErrors,
  isOptoutHoneypot,
  linkTokenValid,
  normalizeEmail,
  optoutFromRecord,
  phoneKey,
  postOptout,
  readOptouts,
  rememberOptout,
  resetOptoutLimits,
  signOptout,
  validateOptout,
  type OptOutRecord,
} from '../src/lib/optout.ts';

const SECRET = 'secret-de-test';
const TOKEN = 'cle-de-lecture';

function person(over: Partial<OptOutRecord> = {}): OptOutRecord {
  return {
    id: 'id-1',
    at: '2026-11-24T10:00:00.000Z',
    email: 'ada@exemple.fr',
    phone: '',
    name: '',
    company: '',
    source: 'formulaire',
    ...over,
  };
}

test('normalise l’e-mail et le téléphone', () => {
  assert.equal(normalizeEmail('  Ada@Exemple.FR '), 'ada@exemple.fr');
  assert.equal(phoneKey('06 12 34 56 78'), '0612345678');
  assert.equal(phoneKey('+33 6 12 34 56 78'), '0612345678');
  assert.equal(phoneKey('+33 (0)6 12 34 56 78'), '0612345678');
  assert.equal(phoneKey('0033 6 12 34 56 78'), '0612345678');
});

test('exige une adresse valide et accepte un téléphone vide', () => {
  const missing = validateOptout(emptyOptout());
  assert.equal(missing.email, 'Indiquez l’adresse e-mail à retirer.');
  const invalid = validateOptout({ ...emptyOptout(), email: 'pas-un-email', phone: '12' });
  assert.equal(invalid.email, 'Indiquez une adresse e-mail valide.');
  assert.equal(invalid.phone, 'Ce numéro ne semble pas complet.');
  const ok = validateOptout({ ...emptyOptout(), email: 'ada@exemple.fr', phone: '06 12 34 56 78' });
  assert.equal(hasOptoutErrors(ok), false);
});

test('le champ invisible n’est pas une erreur', () => {
  const fields = { ...emptyOptout(), email: 'ada@exemple.fr', website: 'https://spam.example' };
  assert.equal(hasOptoutErrors(validateOptout(fields)), false);
  assert.equal(isOptoutHoneypot(fields), true);
});

test('le jeton ne vaut que pour l’adresse signée', () => {
  const token = signOptout('ada@exemple.fr', SECRET);
  assert.equal(linkTokenValid('Ada@Exemple.fr', token, SECRET), true);
  assert.equal(linkTokenValid('autre@exemple.fr', token, SECRET), false);
  assert.equal(linkTokenValid('ada@exemple.fr', token, ''), false);
  assert.equal(linkTokenValid('ada@exemple.fr', '', SECRET), false);
});

test('relit le formulaire et ignore une ligne illisible', async () => {
  const fields = optoutFromRecord({
    email: 'ada@exemple.fr',
    telephone: '06 12 34 56 78',
    fax_number: '',
    jeton: 'abc',
  });
  assert.equal(fields.phone, '06 12 34 56 78');
  assert.equal(fields.token, 'abc');

  const dir = await mkdtemp(path.join(tmpdir(), 'optout-'));
  const file = path.join(dir, 'desinscriptions.jsonl');
  await writeFile(file, `pas du json\n${JSON.stringify(person())}\n{"email":""}\n`, 'utf8');
  const records = await readOptouts(file);
  assert.equal(records.length, 1);
  assert.equal(records[0].email, 'ada@exemple.fr');
});

test('enregistre une fois, puis complète le téléphone', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'optout-'));
  const file = path.join(dir, 'desinscriptions.jsonl');
  const first = await rememberOptout(file, {
    email: 'Ada@Exemple.fr',
    phone: '',
    name: '',
    company: '',
    source: 'formulaire',
    now: new Date('2026-11-01T00:00:00.000Z'),
    id: 'premier',
  });
  assert.equal(first.created, true);
  const again = await rememberOptout(file, {
    email: 'ada@exemple.fr',
    phone: '',
    name: '',
    company: '',
    source: 'formulaire',
  });
  assert.equal(again.created, false);
  assert.equal(again.record.id, 'premier');

  const withPhone = await rememberOptout(file, {
    email: 'ada@exemple.fr',
    phone: '+33 6 12 34 56 78',
    name: 'Ada',
    company: 'Atelier',
    source: 'lien',
    now: new Date('2026-11-02T00:00:00.000Z'),
    id: 'second',
  });
  assert.equal(withPhone.created, true);
  assert.equal(withPhone.record.phone.includes('06') || withPhone.record.phone.includes('+33'), true);
  assert.equal(withPhone.record.name, 'Ada');
  assert.equal(withPhone.record.at, '2026-11-01T00:00:00.000Z');

  const raw = await readOptouts(file);
  const found = findOppositions(raw, { phone: '06 12 34 56 78' });
  assert.equal(found.length, 1);
  assert.equal(found[0].email, 'ada@exemple.fr');
  assert.equal(findOppositions(raw, { email: 'inconnu@exemple.fr' }).length, 0);

  const people = collapseOptouts(raw);
  assert.equal(people.length, 1);
  assert.equal(people[0].source, 'formulaire');
});

test('endpoint de désinscription', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'optout-api-'));
  const file = path.join(dir, 'desinscriptions.jsonl');
  const previous = {
    path: process.env.DESINSCRIPTIONS_PATH,
    token: process.env.DESINSCRIPTION_TOKEN,
    secret: process.env.DESINSCRIPTION_SECRET,
  };
  process.env.DESINSCRIPTIONS_PATH = file;
  process.env.DESINSCRIPTION_TOKEN = TOKEN;
  process.env.DESINSCRIPTION_SECRET = SECRET;
  resetOptoutLimits();

  const origin = 'http://localhost';

  async function call(method: 'GET' | 'POST', url: string, init: { ip?: string; headers?: Record<string, string>; body?: string } = {}) {
    const headers = new Headers(init.headers);
    if (init.ip) headers.set('x-forwarded-for', init.ip);
    const request = new Request(url, { method, headers, body: method === 'POST' ? init.body : undefined });
    const response = method === 'POST' ? await postOptout(request, '127.0.0.1') : await getOptout(request, '127.0.0.1');
    const text = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = {};
    }
    return { status: response.status, data, text };
  }

  try {
    const denied = await call('GET', 'http://localhost/api/desinscription', {
      ip: '203.0.113.1',
      headers: { accept: 'application/json' },
    });
    assert.equal(denied.status, 401);

    const wrong = await call('GET', 'http://localhost/api/desinscription', {
      ip: '203.0.113.1',
      headers: { accept: 'application/json', authorization: 'Bearer autre' },
    });
    assert.equal(wrong.status, 401);

    const empty = await call('GET', 'http://localhost/api/desinscription', {
      ip: '203.0.113.1',
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    });
    assert.equal(empty.status, 200);
    assert.equal(empty.data.total, 0);

    const foreign = await call('POST', 'http://localhost/api/desinscription', {
      ip: '203.0.113.2',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email: 'ada@exemple.fr' }),
    });
    assert.equal(foreign.status, 403);

    const created = await call('POST', 'http://localhost/api/desinscription', {
      ip: '203.0.113.3',
      headers: { 'content-type': 'application/json', accept: 'application/json', origin },
      body: JSON.stringify({ email: 'Ada@Exemple.fr', phone: '06 12 34 56 78' }),
    });
    assert.equal(created.status, 200);
    assert.equal(created.data.ok, true);
    assert.equal(created.data.deja, false);

    const list = await call('GET', 'http://localhost/api/desinscription', {
      ip: '203.0.113.1',
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    });
    const people = list.data.personnes as Array<{ email: string; phone: string }>;
    assert.equal(list.data.total, 1);
    assert.equal(people[0].email, 'ada@exemple.fr');
    assert.equal('desinscrit' in list.data, false);

    const hit = await call('GET', 'http://localhost/api/desinscription?email=ada@exemple.fr', {
      ip: '203.0.113.1',
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    });
    assert.equal(hit.data.desinscrit, true);

    const miss = await call('GET', 'http://localhost/api/desinscription?email=autre@exemple.fr', {
      ip: '203.0.113.1',
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    });
    assert.equal(miss.data.desinscrit, false);

    const byPhone = await call('GET', 'http://localhost/api/desinscription?telephone=%2B33%206%2012%2034%2056%2078', {
      ip: '203.0.113.1',
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    });
    assert.equal(byPhone.data.desinscrit, true);

    const badQuery = await call('GET', 'http://localhost/api/desinscription?email=non', {
      ip: '203.0.113.1',
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    });
    assert.equal(badQuery.status, 422);

    const again = await call('POST', 'http://localhost/api/desinscription', {
      ip: '203.0.113.4',
      headers: { 'content-type': 'application/json', accept: 'application/json', origin },
      body: JSON.stringify({ email: 'ada@exemple.fr', phone: '06 12 34 56 78' }),
    });
    assert.equal(again.status, 200);
    assert.equal(again.data.deja, true);

    const honeypot = await call('POST', 'http://localhost/api/desinscription', {
      ip: '203.0.113.5',
      headers: { 'content-type': 'application/json', accept: 'application/json', origin },
      body: JSON.stringify({ email: 'robot@exemple.fr', fax_number: 'rempli' }),
    });
    assert.equal(honeypot.status, 200);
    const afterHoney = await readOptouts(file);
    assert.equal(afterHoney.some((record) => record.email === 'robot@exemple.fr'), false);

    const invalid = await call('POST', 'http://localhost/api/desinscription', {
      ip: '203.0.113.6',
      headers: { 'content-type': 'application/json', accept: 'application/json', origin },
      body: JSON.stringify({ email: 'non' }),
    });
    assert.equal(invalid.status, 422);

    const token = signOptout('lien@exemple.fr', SECRET);
    const oneClick = await call(
      'POST',
      `http://localhost/api/desinscription?email=lien@exemple.fr&jeton=${encodeURIComponent(token)}`,
      {
        ip: '203.0.113.7',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
        body: 'List-Unsubscribe=One-Click',
      },
    );
    assert.equal(oneClick.status, 200);
    assert.equal(oneClick.data.ok, true);
    const linked = (await readOptouts(file)).find((record) => record.email === 'lien@exemple.fr');
    assert.equal(linked?.source, 'lien');

    const forged = await call('POST', 'http://localhost/api/desinscription?email=piege@exemple.fr&jeton=faux', {
      ip: '203.0.113.8',
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: 'List-Unsubscribe=One-Click',
    });
    assert.equal(forged.status, 403);

    const signedForm = await call('POST', 'http://localhost/api/desinscription', {
      ip: '203.0.113.9',
      headers: { 'content-type': 'application/json', accept: 'application/json', origin },
      body: JSON.stringify({ email: 'formulaire-signe@exemple.fr', jeton: signOptout('formulaire-signe@exemple.fr', SECRET) }),
    });
    assert.equal(signedForm.status, 200);
    const signed = (await readOptouts(file)).find((record) => record.email === 'formulaire-signe@exemple.fr');
    assert.equal(signed?.source, 'lien');

    const stored = await readFile(file, 'utf8');
    assert.equal(stored.includes('203.0.113'), false);

    delete process.env.DESINSCRIPTION_TOKEN;
    const unconfigured = await call('GET', 'http://localhost/api/desinscription', {
      ip: '203.0.113.10',
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    });
    assert.equal(unconfigured.status, 503);

    let limited = 0;
    for (let index = 0; index < 9; index += 1) {
      const response = await call('POST', 'http://localhost/api/desinscription', {
        ip: '203.0.113.50',
        headers: { 'content-type': 'application/json', accept: 'application/json', origin },
        body: JSON.stringify({ email: `quota-${index}@exemple.fr` }),
      });
      limited = response.status;
    }
    assert.equal(limited, 429);
  } finally {
    if (previous.path === undefined) delete process.env.DESINSCRIPTIONS_PATH;
    else process.env.DESINSCRIPTIONS_PATH = previous.path;
    if (previous.token === undefined) delete process.env.DESINSCRIPTION_TOKEN;
    else process.env.DESINSCRIPTION_TOKEN = previous.token;
    if (previous.secret === undefined) delete process.env.DESINSCRIPTION_SECRET;
    else process.env.DESINSCRIPTION_SECRET = previous.secret;
    resetOptoutLimits();
  }
});
