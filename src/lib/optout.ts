import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  hasOptoutErrors,
  normalizeEmail,
  validateOptout,
  type OptOutDraft,
  type OptOutErrors,
  type OptOutRecord,
  type OptOutSource,
} from './optout-fields.ts';

export {
  emptyOptout,
  hasOptoutErrors,
  normalizeEmail,
  validateOptout,
  type OptOutDraft,
  type OptOutErrors,
  type OptOutRecord,
  type OptOutSource,
} from './optout-fields.ts';

const WINDOW_MS = 60 * 60 * 1000;

export function desinscriptionsPath(): string {
  return process.env.DESINSCRIPTIONS_PATH || path.join(process.cwd(), 'data', 'leads', 'desinscriptions.jsonl');
}

/** Ramène un numéro français vers une clé comparable (06…, +33 6…, +33 (0)6…). */
export function phoneKey(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('0033')) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith('330') && digits.length >= 12) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith('33') && digits.length >= 11) digits = `0${digits.slice(2)}`;
  return digits;
}

export function optoutFromRecord(record: Record<string, string>): OptOutDraft {
  const read = (key: string) => (record[key] ?? '').trim();
  return {
    email: read('email'),
    phone: read('phone') || read('telephone'),
    name: read('name'),
    company: read('company'),
    website: read('website') || read('fax_number'),
    token: read('jeton') || read('token'),
  };
}

export function isOptoutHoneypot(fields: OptOutDraft): boolean {
  return fields.website.trim().length > 0;
}

export function signOptout(email: string, secret: string): string {
  return createHmac('sha256', secret).update(`desinscription\n${normalizeEmail(email)}`).digest('base64url');
}

export function safeEqual(left: string, right: string): boolean {
  const a = createHash('sha256').update(left).digest();
  const b = createHash('sha256').update(right).digest();
  return timingSafeEqual(a, b);
}

export function linkTokenValid(email: string, token: string, secret: string): boolean {
  if (!secret || !token || !email.trim()) return false;
  return safeEqual(signOptout(email, secret), token.trim());
}

export function bearerToken(header: string | null): string {
  if (!header) return '';
  const match = /^Bearer\s+(\S+)\s*$/i.exec(header);
  return match?.[1] ?? '';
}

function createLimiter(max: number) {
  const hits = new Map<string, number[]>();
  return {
    limited(ip: string, now = Date.now()): boolean {
      const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
      if (recent.length >= max) {
        hits.set(ip, recent);
        return true;
      }
      recent.push(now);
      hits.set(ip, recent);
      return false;
    },
    reset(): void {
      hits.clear();
    },
  };
}

export const postLimiter = createLimiter(8);
export const readLimiter = createLimiter(120);

export function resetOptoutLimits(): void {
  postLimiter.reset();
  readLimiter.reset();
}

function parseLine(line: string): OptOutRecord | undefined {
  try {
    const data = JSON.parse(line) as Partial<OptOutRecord>;
    if (!data || typeof data.email !== 'string' || typeof data.id !== 'string' || typeof data.at !== 'string') return;
    const email = normalizeEmail(data.email);
    if (!email) return;
    return {
      id: data.id,
      at: data.at,
      email,
      phone: typeof data.phone === 'string' ? data.phone : '',
      name: typeof data.name === 'string' ? data.name : '',
      company: typeof data.company === 'string' ? data.company : '',
      source: data.source === 'lien' ? 'lien' : 'formulaire',
    };
  } catch {
    return undefined;
  }
}

export async function readOptouts(file: string): Promise<OptOutRecord[]> {
  let raw = '';
  try {
    raw = await readFile(file, 'utf8');
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return [];
    throw error;
  }
  const records: OptOutRecord[] = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const record = parseLine(trimmed);
    if (record) records.push(record);
  }
  return records;
}

export function collapseOptouts(records: OptOutRecord[]): OptOutRecord[] {
  const groups = new Map<string, OptOutRecord[]>();
  for (const record of records) {
    const list = groups.get(record.email) ?? [];
    list.push(record);
    groups.set(record.email, list);
  }
  const people: OptOutRecord[] = [];
  for (const list of groups.values()) {
    const ordered = [...list].sort((a, b) => a.at.localeCompare(b.at));
    const first = ordered[0];
    const phones: string[] = [];
    const seen = new Set<string>();
    let name = '';
    let company = '';
    for (const record of ordered) {
      const key = phoneKey(record.phone);
      if (record.phone && key && !seen.has(key)) {
        seen.add(key);
        phones.push(record.phone);
      }
      if (!name && record.name) name = record.name;
      if (!company && record.company) company = record.company;
    }
    people.push({
      id: first.id,
      at: first.at,
      email: first.email,
      phone: phones.join(', '),
      name,
      company,
      source: first.source,
    });
  }
  people.sort((a, b) => b.at.localeCompare(a.at));
  return people;
}

export function findOppositions(
  records: OptOutRecord[],
  query: { email?: string; phone?: string },
): OptOutRecord[] {
  const mail = query.email ? normalizeEmail(query.email) : '';
  const tel = query.phone ? phoneKey(query.phone) : '';
  if (!mail && !tel) return [];
  const matched = records.filter((record) => {
    if (mail && record.email === mail) return true;
    if (tel && record.phone && phoneKey(record.phone) === tel) return true;
    return false;
  });
  if (matched.length === 0) return [];
  const emails = new Set(matched.map((record) => record.email));
  return collapseOptouts(records.filter((record) => emails.has(record.email)));
}

export async function rememberOptout(
  file: string,
  input: {
    email: string;
    phone: string;
    name: string;
    company: string;
    source: OptOutSource;
    now?: Date;
    id?: string;
  },
): Promise<{ record: OptOutRecord; created: boolean }> {
  const records = await readOptouts(file);
  const email = normalizeEmail(input.email);
  const phone = input.phone.trim();
  const name = input.name.trim();
  const company = input.company.trim();
  const sameEmail = records.filter((record) => record.email === email);
  const knownPhones = new Set(sameEmail.map((record) => phoneKey(record.phone)).filter(Boolean));
  const incomingPhone = phoneKey(phone);
  const phoneAlreadyKnown = !incomingPhone || knownPhones.has(incomingPhone);
  const nameAlreadyKnown = !name || sameEmail.some((record) => record.name === name);
  const companyAlreadyKnown = !company || sameEmail.some((record) => record.company === company);
  if (sameEmail.length > 0 && phoneAlreadyKnown && nameAlreadyKnown && companyAlreadyKnown) {
    return { record: collapseOptouts(sameEmail)[0], created: false };
  }
  const record: OptOutRecord = {
    id: input.id ?? crypto.randomUUID(),
    at: (input.now ?? new Date()).toISOString(),
    email,
    phone,
    name,
    company,
    source: input.source,
  };
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
  return { record: collapseOptouts([...sameEmail, record])[0], created: true };
}

function escapeText(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

function requestIp(request: Request, fallback: string): string {
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
  <title>${escapeText(title)}</title>
</head>
<body style="margin:0;background:#06040f;color:#ece7da;font-family:Georgia,serif;line-height:1.6">
  <main style="max-width:40rem;margin:0 auto;padding:4rem 1.5rem">
    ${body}
    <p style="margin-top:2rem"><a style="color:#ffe49a" href="/stop">Retour</a></p>
  </main>
</body>
</html>`;
  return new Response(document, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy':
        "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    },
  });
}

function reply(request: Request, status: number, title: string, message: string, extra?: Record<string, unknown>): Response {
  if (wantsJson(request)) return json({ ok: status < 400, message, ...extra }, status);
  const items = Array.isArray(extra?.items)
    ? (extra.items as string[]).map((item) => `<li>${escapeText(item)}</li>`).join('')
    : '';
  const list = items ? `<ul>${items}</ul>` : '';
  return htmlPage(title, `<h1>${escapeText(title)}</h1><p>${escapeText(message)}</p>${list}`, status);
}

async function readRecord(request: Request): Promise<Record<string, string>> {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    const data = (await request.json()) as Record<string, unknown>;
    const record: Record<string, string> = {};
    for (const [key, value] of Object.entries(data ?? {})) {
      if (typeof value === 'string') record[key] = value;
    }
    return record;
  }
  if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data')) {
    const form = await request.formData();
    const record: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') record[key] = value;
    }
    return record;
  }
  return {};
}

function isOneClick(request: Request, record: Record<string, string>): boolean {
  const header = request.headers.get('list-unsubscribe');
  if (header?.trim().toLowerCase() === 'one-click') return true;
  const body = record['List-Unsubscribe'] ?? record['list-unsubscribe'] ?? '';
  return body.trim() === 'One-Click';
}

async function store(
  input: { email: string; phone: string; name: string; company: string; source: OptOutSource },
  notifyTo?: string,
): Promise<{ created: boolean }> {
  const { record, created } = await rememberOptout(desinscriptionsPath(), input);
  console.info(JSON.stringify({ level: 'info', event: 'desinscription_stored', id: record.id, created }));
  if (created) await notify(record.email, record.phone, record.id, input.source, notifyTo);
  return { created };
}

async function notify(email: string, phone: string, id: string, source: string, notifyTo?: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO || notifyTo || 'hugo.jacquel@atomixia.fr';
  if (!key || !from) return;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Stop prospection — ${email}`,
        text: [`Identifiant : ${id}`, `E-mail : ${email}`, `Téléphone : ${phone || '—'}`, `Origine : ${source}`].join('\n'),
      }),
    });
    if (!response.ok) {
      console.error(JSON.stringify({ level: 'error', event: 'desinscription_email_failed', status: response.status }));
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'desinscription_email_failed',
        message: error instanceof Error ? error.message : 'erreur inconnue',
      }),
    );
  }
}

function confirm(request: Request, created: boolean): Response {
  const message = created
    ? 'C’est enregistré. Atomixia ne vous écrira plus à cette adresse pour de la prospection.'
    : 'C’est déjà enregistré. Cette adresse ne reçoit plus de prospection Atomixia.';
  if (wantsJson(request)) return json({ ok: true, deja: !created, message }, 200);
  return htmlPage('Opposition enregistrée', `<h1>C’est enregistré.</h1><p>${escapeText(message)}</p>`, 200);
}

function fieldErrors(request: Request, errors: OptOutErrors): Response {
  if (wantsJson(request)) return json({ ok: false, errors }, 422);
  return reply(request, 422, 'Adresse à reprendre', 'L’opposition n’a pas pu être enregistrée.', {
    items: Object.values(errors).filter((error): error is string => Boolean(error)),
  });
}

async function accept(request: Request, fields: OptOutDraft, source: OptOutSource, notifyTo?: string): Promise<Response> {
  const contact = notifyTo || 'hugo.jacquel@atomixia.fr';
  try {
    const { created } = await store(
      {
        email: fields.email,
        phone: fields.phone,
        name: fields.name,
        company: fields.company,
        source,
      },
      contact,
    );
    return confirm(request, created);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'desinscription_persist_failed',
        message: error instanceof Error ? error.message : 'erreur inconnue',
      }),
    );
    return reply(request, 503, 'Enregistrement impossible', `L’opposition n’a pas pu être enregistrée. Écrivez à ${contact}.`);
  }
}

export async function postOptout(request: Request, fallbackIp = '', notifyTo?: string): Promise<Response> {
  const contact = notifyTo || 'hugo.jacquel@atomixia.fr';
  const ip = requestIp(request, fallbackIp);
  if (postLimiter.limited(ip)) {
    return reply(request, 429, 'Trop de demandes', `Trop de demandes depuis ce réseau. Réessayez dans une heure, ou écrivez à ${contact}.`);
  }

  let record: Record<string, string>;
  try {
    record = await readRecord(request);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'desinscription_parse_failed',
        message: error instanceof Error ? error.message : 'erreur inconnue',
      }),
    );
    return reply(request, 400, 'Demande illisible', 'La demande n’a pas pu être lue.');
  }

  if (isOneClick(request, record)) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') ?? '';
    const token = url.searchParams.get('jeton') ?? url.searchParams.get('token') ?? '';
    const secret = process.env.DESINSCRIPTION_SECRET ?? '';
    if (!linkTokenValid(email, token, secret)) {
      return reply(request, 403, 'Lien refusé', 'Ce lien de désinscription n’est pas valable.');
    }
    const fields = optoutFromRecord({ email });
    const errors = validateOptout(fields);
    if (hasOptoutErrors(errors)) return fieldErrors(request, errors);
    return accept(request, fields, 'lien', notifyTo);
  }

  if (!sameOrigin(request)) {
    return reply(request, 403, 'Envoi refusé', 'Envoi refusé.');
  }

  const fields = optoutFromRecord(record);
  if (isOptoutHoneypot(fields)) {
    return wantsJson(request)
      ? json({ ok: true }, 200)
      : htmlPage(
          'Opposition enregistrée',
          '<h1>C’est enregistré.</h1><p>Atomixia ne vous écrira plus à cette adresse pour de la prospection.</p>',
          200,
        );
  }

  const errors = validateOptout(fields);
  if (hasOptoutErrors(errors)) return fieldErrors(request, errors);

  const secret = process.env.DESINSCRIPTION_SECRET ?? '';
  const source = linkTokenValid(fields.email, fields.token, secret) ? 'lien' : 'formulaire';
  return accept(request, fields, source, notifyTo);
}

function lookupQuery(url: URL): { email?: string; phone?: string } | { errors: OptOutErrors } {
  const errors: OptOutErrors = {};
  const email = url.searchParams.get('email');
  const phone = url.searchParams.get('telephone') ?? url.searchParams.get('phone');
  if (email !== null) {
    const check = validateOptout({ email, phone: '', name: '', company: '', website: '', token: '' });
    if (check.email) errors.email = check.email;
  }
  if (phone !== null) {
    const check = validateOptout({ email: 'personne@exemple.fr', phone, name: '', company: '', website: '', token: '' });
    if (check.phone) errors.phone = check.phone;
  }
  if (hasOptoutErrors(errors)) return { errors };
  return {
    email: email || undefined,
    phone: phone || undefined,
  };
}

export async function getOptout(request: Request, fallbackIp = ''): Promise<Response> {
  const ip = requestIp(request, fallbackIp);
  if (readLimiter.limited(ip)) {
    return json({ ok: false, message: 'Trop de lectures depuis ce réseau. Réessayez dans une heure.' }, 429);
  }

  const expected = process.env.DESINSCRIPTION_TOKEN ?? '';
  if (!expected) return json({ ok: false, message: 'La lecture de la liste n’est pas configurée.' }, 503);
  const provided = bearerToken(request.headers.get('authorization'));
  if (!provided || !safeEqual(provided, expected)) return json({ ok: false, message: 'Lecture non autorisée.' }, 401);

  const query = lookupQuery(new URL(request.url));
  if ('errors' in query) return json({ ok: false, errors: query.errors }, 422);

  try {
    const records = await readOptouts(desinscriptionsPath());
    const lookup = Boolean(query.email || query.phone);
    const personnes = lookup ? findOppositions(records, query) : collapseOptouts(records);
    return json(
      {
        ok: true,
        total: personnes.length,
        ...(lookup ? { desinscrit: personnes.length > 0 } : {}),
        personnes,
      },
      200,
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'desinscription_read_failed',
        message: error instanceof Error ? error.message : 'erreur inconnue',
      }),
    );
    return json({ ok: false, message: 'La liste n’a pas pu être lue.' }, 503);
  }
}
