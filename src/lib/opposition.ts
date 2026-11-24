import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export type OppositionResult = {
  email: string;
  created: boolean;
};

export function oppositionFile(): string {
  return process.env.OPPOSITIONS_PATH || path.join(process.cwd(), 'data', 'prospection', 'oppositions.jsonl');
}

export function normalizeEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (!email || email.length > 120 || email.includes('..') || !EMAIL.test(email)) return null;
  return email;
}

export type EmailQuery = {
  present: boolean;
  email: string | null;
};

export function emailFromSearch(search: string): EmailQuery {
  const missing: EmailQuery = { present: false, email: null };
  const query = search.startsWith('?') ? search.slice(1) : search;
  if (!query) return missing;

  for (const part of query.split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const rawKey = eq === -1 ? part : part.slice(0, eq);
    const rawValue = eq === -1 ? '' : part.slice(eq + 1);
    let key = '';
    try {
      key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    } catch {
      continue;
    }
    if (key !== 'email' && key !== 'mail') continue;
    try {
      return { present: true, email: normalizeEmail(decodeURIComponent(rawValue.replace(/\+/g, '%2B'))) };
    } catch {
      return { present: true, email: null };
    }
  }

  return missing;
}

export function oppositionLink(email: string, origin = 'https://atomixia.fr'): string | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  const url = new URL('/desinscription', origin);
  url.searchParams.set('email', normalized);
  return url.toString();
}

let tail: Promise<void> = Promise.resolve();

function exclusive<T>(task: () => Promise<T>): Promise<T> {
  const run = tail.then(task, task);
  tail = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readKnown(file: string): Promise<Set<string>> {
  let raw = '';
  try {
    raw = await readFile(file, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return new Set();
    throw error;
  }

  const emails = new Set<string>();
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as { email?: unknown };
      if (typeof parsed.email !== 'string') continue;
      const email = normalizeEmail(parsed.email);
      if (email) emails.add(email);
    } catch {
      /* ligne illisible ignorée */
    }
  }
  return emails;
}

async function appendLine(file: string, line: string): Promise<void> {
  let prefix = '';
  try {
    const raw = await readFile(file, 'utf8');
    if (raw.length > 0 && !raw.endsWith('\n')) prefix = '\n';
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${prefix}${line}\n`, { encoding: 'utf8', mode: 0o600 });
}

export async function hasOpposition(email: string, file: string = oppositionFile()): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  const known = await readKnown(file);
  return known.has(normalized);
}

export async function recordOpposition(email: string, file: string = oppositionFile()): Promise<OppositionResult> {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error('adresse invalide');

  return exclusive(async () => {
    const known = await readKnown(file);
    if (known.has(normalized)) return { email: normalized, created: false };
    const line = JSON.stringify({
      email: normalized,
      at: new Date().toISOString(),
      source: 'lien',
    });
    await appendLine(file, line);
    return { email: normalized, created: true };
  });
}
