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
  promise: 'Vos systèmes méritent de devenir intelligents.',
  signature: 'Quatre capacités. Un système relié.',
  description:
    'Atomixia conçoit des logiciels sur mesure, des systèmes d’IA, des automatisations et des tests de sécurité autorisés. Lyon et Auvergne-Rhône-Alpes. La décision reste humaine.',
} as const;

export const navGroups = [
  {
    label: 'Solutions',
    items: [
      { href: '/solutions/automatisation-ia', label: 'Automatisation IA', text: 'Agents reliés aux outils, validation humaine.' },
      { href: '/solutions/saas-logiciels', label: 'SaaS et logiciels', text: 'Applications, plateformes, outils internes.' },
    ],
  },
  {
    label: 'Expertises',
    items: [
      { href: '/expertises/conseil-systeme-information', label: 'Conseil SI', text: 'Cartographie, architecture, priorités.' },
      { href: '/expertises/cybersecurite-pentest', label: 'Cybersécurité et pentest', text: 'Risques mesurés, périmètre autorisé.' },
    ],
  },
] as const;

export const nav = [
  { href: '/realisations', label: 'Réalisations' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
] as const;
