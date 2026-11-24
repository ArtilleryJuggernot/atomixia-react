import { normalizeEmail, validateOptout } from '../src/lib/optout-fields.ts';
import { linkTokenValid, signOptout } from '../src/lib/optout.ts';
import { site } from '../src/lib/site.ts';

const email = process.argv[2] ?? '';
const secret = process.env.DESINSCRIPTION_SECRET ?? '';
const errors = validateOptout({ email, phone: '', name: '', company: '', website: '', token: '' });

if (!secret) {
  console.error('DESINSCRIPTION_SECRET est absent.');
  process.exit(1);
}

if (errors.email) {
  console.error(errors.email);
  process.exit(1);
}

const normalized = normalizeEmail(email);
const token = signOptout(normalized, secret);
if (!linkTokenValid(normalized, token, secret)) {
  console.error('Le jeton produit ne se vérifie pas.');
  process.exit(1);
}

const page = new URL('/stop', site.url);
page.searchParams.set('email', normalized);
page.searchParams.set('jeton', token);

const oneClick = new URL('/api/desinscription', site.url);
oneClick.searchParams.set('email', normalized);
oneClick.searchParams.set('jeton', token);

console.log(page.toString());
console.log(oneClick.toString());
