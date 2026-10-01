export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  process: string;
  tools: string;
  message: string;
  consent: boolean;
  website: string;
};

export type ContactErrors = Partial<Record<Exclude<keyof ContactFields, 'website'>, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emptyContact(): ContactFields {
  return {
    name: '',
    email: '',
    phone: '',
    company: '',
    process: '',
    tools: '',
    message: '',
    consent: false,
    website: '',
  };
}

export function fieldsFromRecord(record: Record<string, string>): ContactFields {
  const read = (key: string) => (record[key] ?? '').trim();
  const consent = read('consent');
  return {
    name: read('name'),
    email: read('email'),
    phone: read('phone'),
    company: read('company'),
    process: read('process'),
    tools: read('tools'),
    message: read('message'),
    consent: consent === 'oui' || consent === 'on' || consent === 'true',
    website: read('website'),
  };
}

export function isHoneypotTripped(fields: ContactFields): boolean {
  return fields.website.trim().length > 0;
}

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};

  if (fields.name.length < 2 || fields.name.length > 80) {
    errors.name = 'Indiquez votre nom.';
  }

  if (!EMAIL.test(fields.email) || fields.email.length > 120) {
    errors.email = 'Indiquez une adresse e-mail valide.';
  }

  if (fields.phone) {
    const digits = fields.phone.replace(/\D/g, '');
    if (digits.length < 6 || digits.length > 15 || !/^[0-9+().\s-]+$/.test(fields.phone)) {
      errors.phone = 'Ce numéro ne semble pas complet.';
    }
  }

  if (fields.company.length < 2 || fields.company.length > 120) {
    errors.company = 'Indiquez l’entreprise ou la structure.';
  }

  if (fields.process.length < 10 || fields.process.length > 600) {
    errors.process = 'Décrivez le processus en une ou deux phrases.';
  }

  if (fields.tools.length > 300) {
    errors.tools = 'Raccourcissez la liste des outils.';
  }

  if (fields.message.length < 20 || fields.message.length > 2000) {
    errors.message = 'Écrivez quelques mots de contexte (20 caractères minimum).';
  }

  if (!fields.consent) {
    errors.consent = 'Cochez la case pour autoriser la réponse à votre demande.';
  }

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function escapeHtml(value: string): string {
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
