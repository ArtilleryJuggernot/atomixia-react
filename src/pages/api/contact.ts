import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { escapeHtml, fieldsFromRecord, hasErrors, isHoneypotTripped, validateContact } from '../../lib/contact';
import { site } from '../../lib/site';

export const prerender = false;

const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clientIp(request: Request, fallback: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || fallback || 'inconnu';
}

function sameOrigin(request: Request): boolean {
  const source = request.headers.get('origin') ?? request.headers.get('referer');
  if (!source) return false;
  let originHost = '';
  try {
    originHost = new URL(source).host;
  } catch {
    return false;
  }
  const allowed = new Set<string>();
  try {
    allowed.add(new URL(request.url).host);
  } catch {
    /* URL interne illisible */
  }
  for (const header of ['host', 'x-forwarded-host']) {
    const value = request.headers.get(header);
    if (value) allowed.add(value.split(',')[0].trim());
  }
  return allowed.has(originHost);
}

function wantsJson(request: Request): boolean {
  const type = request.headers.get('content-type') ?? '';
  const accept = request.headers.get('accept') ?? '';
  return type.includes('application/json') || accept.includes('application/json');
}

async function readRecord(request: Request): Promise<Record<string, string>> {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    const data = (await request.json()) as Record<string, unknown>;
    const record: Record<string, string> = {};
    for (const [key, value] of Object.entries(data ?? {})) {
      if (typeof value === 'string') record[key] = value;
      else if (typeof value === 'boolean') record[key] = value ? 'oui' : '';
    }
    if (record.fax_number && !record.website) record.website = record.fax_number;
    return record;
  }
  const form = await request.formData();
  const record: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') record[key] = value;
  }
  if (record.fax_number && !record.website) record.website = record.fax_number;
  return record;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function htmlPage(title: string, body: string, status: number): Response {
  const document = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${escapeHtml(title)}</title>
</head>
<body>
  <main>
    ${body}
    <p><a href="/contact">Retour au contact</a></p>
  </main>
</body>
</html>`;
  return new Response(document, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy': "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    },
  });
}

async function persist(record: ReturnType<typeof fieldsFromRecord>): Promise<string> {
  const id = crypto.randomUUID();
  const file = process.env.LEADS_PATH || path.join(process.cwd(), 'data', 'leads', 'contacts.jsonl');
  await mkdir(path.dirname(file), { recursive: true });
  const line = JSON.stringify({
    id,
    at: new Date().toISOString(),
    projectType: record.projectType,
    name: record.name,
    email: record.email,
    phone: record.phone,
    project: record.project,
    consent: record.consent,
  });
  await appendFile(file, `${line}\n`, { encoding: 'utf8', mode: 0o600 });
  return id;
}

async function notify(record: ReturnType<typeof fieldsFromRecord>, id: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO || site.email;
  if (!key || !from) return;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: record.email,
      subject: `Demande de devis Atomixia — ${record.projectType}`,
      text: [
        `Identifiant : ${id}`,
        `Type de projet : ${record.projectType}`,
        `Nom : ${record.name}`,
        `E-mail : ${record.email}`,
        `Téléphone : ${record.phone || '—'}`,
        '',
        record.project,
      ].join('\n'),
    }),
  });
  if (!response.ok) {
    console.error(JSON.stringify({ level: 'error', event: 'contact_email_failed', status: response.status }));
  }
}

export const POST: APIRoute = async (context) => {
  const { request } = context;
  let address = '';
  try {
    address = context.clientAddress;
  } catch {
    address = '';
  }
  const asJson = wantsJson(request);
  if (!sameOrigin(request)) {
    const message = 'Envoi refusé.';
    return asJson ? json({ ok: false, message }, 403) : htmlPage('Envoi refusé', `<h1>${message}</h1>`, 403);
  }

  const ip = clientIp(request, address);
  if (limited(ip)) {
    const message = `Trop d’envois depuis ce réseau. Réessayez dans une heure, ou appelez le ${site.phoneDisplay}.`;
    return asJson ? json({ ok: false, message }, 429) : htmlPage('Trop d’envois', `<h1>Trop d’envois</h1><p>${escapeHtml(message)}</p>`, 429);
  }

  let record: Record<string, string>;
  try {
    record = await readRecord(request);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'contact_parse_failed',
        message: error instanceof Error ? error.message : 'erreur inconnue',
      }),
    );
    const message = 'Le message n’a pas pu être lu.';
    return asJson ? json({ ok: false, message }, 400) : htmlPage('Message illisible', `<h1>${message}</h1>`, 400);
  }

  const fields = fieldsFromRecord(record);
  if (isHoneypotTripped(fields)) {
    const confirmation = `<h1>Merci.</h1><p>Hugo vous répond sous ${site.response}. Pour aller plus vite : ${site.phoneDisplay}.</p>`;
    return asJson
      ? json({ ok: true }, 200)
      : htmlPage('Message reçu', confirmation, 200);
  }

  const errors = validateContact(fields);
  if (hasErrors(errors)) {
    if (asJson) return json({ ok: false, errors }, 422);
    const items = Object.values(errors)
      .map((error) => `<li>${escapeHtml(error ?? '')}</li>`)
      .join('');
    return htmlPage('Champs à reprendre', `<h1>Certains champs empêchent l’envoi.</h1><ul>${items}</ul>`, 422);
  }

  try {
    const id = await persist(fields);
    console.info(JSON.stringify({ level: 'info', event: 'contact_stored', id }));
    await notify(fields, id);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'contact_persist_failed',
        message: error instanceof Error ? error.message : 'erreur inconnue',
      }),
    );
    const message = `Le message n’a pas pu être enregistré. Écrivez à ${site.email} ou appelez le ${site.phoneDisplay}.`;
    return asJson ? json({ ok: false, message }, 503) : htmlPage('Envoi impossible', `<h1>Envoi impossible</h1><p>${escapeHtml(message)}</p>`, 503);
  }

  if (asJson) return json({ ok: true }, 200);
  return htmlPage(
    'Message reçu',
    `<h1>Merci.</h1><p>Hugo vous répond sous ${site.response}. Pour aller plus vite : ${site.phoneDisplay}.</p>`,
    200,
  );
};

export const GET: APIRoute = async () => json({ ok: false, message: 'Méthode non autorisée.' }, 405);
