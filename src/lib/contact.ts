export const projectTypes = ['site', 'automation', 'software', 'systems', 'cyber', 'other'] as const;
export type ProjectType = (typeof projectTypes)[number];

export type ContactFields = {
  projectType: ProjectType | '';
  name: string;
  email: string;
  phone: string;
  project: string;
  consent: boolean;
  website: string;
};

export type ContactErrors = Partial<Record<Exclude<keyof ContactFields, 'website'>, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emptyContact(): ContactFields {
  return {
    projectType: '',
    name: '',
    email: '',
    phone: '',
    project: '',
    consent: false,
    website: '',
  };
}

export function fieldsFromRecord(record: Record<string, string>): ContactFields {
  const read = (key: string) => (record[key] ?? '').trim();
  const consent = read('consent');
  const projectType = read('projectType');
  return {
    projectType: projectTypes.includes(projectType as ProjectType) ? (projectType as ProjectType) : '',
    name: read('name'),
    email: read('email'),
    phone: read('phone'),
    project: read('project'),
    consent: consent === 'oui' || consent === 'on' || consent === 'true',
    website: read('website'),
  };
}

export function isHoneypotTripped(fields: ContactFields): boolean {
  return fields.website.trim().length > 0;
}

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};

  if (!projectTypes.includes(fields.projectType as ProjectType)) {
    errors.projectType = 'Choisissez un type de projet.';
  }

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

  if (fields.project.length < 20) {
    errors.project = 'Décrivez votre projet (20 caractères minimum).';
  } else if (fields.project.length > 2000) {
    errors.project = 'Raccourcissez votre projet (2 000 caractères maximum).';
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
