export const site = {
  name: 'Atomixia',
  url: 'https://atomixia.fr',
  locale: 'fr_FR',
  email: 'hugo.jacquel@atomixia.fr',
  phoneDisplay: '07 81 22 31 71',
  phoneTel: '+33781223171',
  founder: 'Hugo Jacquel',
  city: 'Lyon',
  region: 'Auvergne-Rhône-Alpes',
  portfolio: 'https://hugo-jacquel.atomixia.fr',
  response: '24 à 48 h',
  promise: 'Vos processus tournent. Vous gardez la main.',
  signature: 'Intelligence · Automatiser · Impact',
  description:
    'Atomixia conçoit des agents IA, des sites métier et des logiciels SaaS pour les TPE et PME, avec un humain qui garde la décision. Lyon et Auvergne-Rhône-Alpes.',
} as const;

export const nav = [
  { href: '/agents', label: 'Agents' },
  { href: '/sites', label: 'Sites' },
  { href: '/methode', label: 'Méthode' },
  { href: '/securite', label: 'Sécurité' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/contact', label: 'Contact' },
] as const;
