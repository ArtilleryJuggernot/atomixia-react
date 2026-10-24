export type StoicQuote = {
  text: string;
  author: string;
  work: string;
};

/**
 * Short passages already fixed in public-domain French translations.
 * The first line is the one the homepage has carried.
 * Baillard, Lettres à Lucilius, lettre 1.
 * Couat, Pensées, livre V, 1.
 * Barthélémy-Saint-Hilaire, Pensées, livre IV, 3.
 */
export const stoicQuotes: StoicQuote[] = [
  {
    text: 'Ce n’est pas que nous ayons peu de temps : c’est que nous en perdons beaucoup.',
    author: 'Sénèque',
    work: 'De la brièveté de la vie',
  },
  {
    text: 'Le matin, quand tu as de la peine à te réveiller, aie cette pensée présente à l’esprit : je m’éveille pour faire œuvre d’homme.',
    author: 'Marc Aurèle',
    work: 'Pensées, livre V',
  },
  {
    text: 'Tandis qu’on l’ajourne, la vie passe.',
    author: 'Sénèque',
    work: 'Lettres à Lucilius',
  },
  {
    text: 'Le monde n’est qu’une transformation perpétuelle ; la vie n’est qu’une idée et une opinion.',
    author: 'Marc Aurèle',
    work: 'Pensées, livre IV',
  },
  {
    text: 'Tout le reste est d’emprunt, le temps seul est notre bien.',
    author: 'Sénèque',
    work: 'Lettres à Lucilius',
  },
];
