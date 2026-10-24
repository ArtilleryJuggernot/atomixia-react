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
  promise: 'Vos systèmes connectés. Votre potentiel augmenté.',
  signature: 'Intelligence connectée',
  description:
    'Atomixia relie vos outils, automatise les tâches répétitives et conçoit les logiciels qui les portent. Lyon et Auvergne-Rhône-Alpes. La décision reste humaine.',
} as const;

export const nav = [
  { href: '/', label: 'Accueil' },
  { href: '/#solutions', label: 'Solutions' },
  { href: '/usages', label: "Cas d'usage" },
  { href: '/methode', label: 'Méthode' },
  { href: '/contact', label: 'Contact' },
] as const;
