const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type OptOutSource = 'formulaire' | 'lien';

export type OptOutRecord = {
  id: string;
  at: string;
  email: string;
  phone: string;
  name: string;
  company: string;
  source: OptOutSource;
};

export type OptOutDraft = {
  email: string;
  phone: string;
  name: string;
  company: string;
  website: string;
  token: string;
};

export type OptOutErrors = Partial<Record<'email' | 'phone' | 'name' | 'company', string>>;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function emptyOptout(): OptOutDraft {
  return { email: '', phone: '', name: '', company: '', website: '', token: '' };
}

function phoneError(phone: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (phone.length > 40 || digits.length < 6 || digits.length > 15 || !/^[0-9+().\s-]+$/.test(phone)) {
    return 'Ce numéro ne semble pas complet.';
  }
  return undefined;
}

export function validateOptout(fields: OptOutDraft): OptOutErrors {
  const errors: OptOutErrors = {};
  const email = fields.email.trim();
  if (!EMAIL.test(email) || email.length > 120) {
    errors.email = email ? 'Indiquez une adresse e-mail valide.' : 'Indiquez l’adresse e-mail à retirer.';
  }
  const phone = phoneError(fields.phone.trim());
  if (phone) errors.phone = phone;
  if (fields.name.trim().length > 80) errors.name = 'Le nom est trop long.';
  if (fields.company.trim().length > 120) errors.company = 'Le nom de l’entreprise est trop long.';
  return errors;
}

export function hasOptoutErrors(errors: OptOutErrors): boolean {
  return Object.keys(errors).length > 0;
}
