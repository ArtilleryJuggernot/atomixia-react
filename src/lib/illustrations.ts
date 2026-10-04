export type Illustration = {
  id: string;
  src: string;
  srcSet: string;
  thumb: string;
  alt: string;
  kicker: string;
  title: string;
};

function plate(
  id: string,
  alt: string,
  kicker: string,
  title: string,
): Illustration {
  return {
    id,
    src: `/illustrations/${id}.webp`,
    srcSet: `/illustrations/${id}-720.webp 720w, /illustrations/${id}.webp 1400w`,
    thumb: `/illustrations/${id}-720.webp`,
    alt,
    kicker,
    title,
  };
}

export const illustrations = {
  courrier: plate(
    'courrier',
    'Enveloppe de coton ouverte, un ruban de lumière cyan en sort, à côté d’un carnet noir et d’une règle de laiton.',
    'Courrier',
    'Le message a un destinataire.',
  ),
  site: plate(
    'site',
    'Feuille de papier épais dressée comme une page, trois pastilles d’argent et un filet cyan, devant une vitre sombre.',
    'Sites',
    'Une présence que l’on a envie d’ouvrir.',
  ),
  systeme: plate(
    'systeme',
    'Instrument d’argent : trois anneaux concentriques autour d’une sphère de verre cyan, sur un socle de pierre noire.',
    'Système',
    'Un outil précis, prêt à préparer le travail.',
  ),
  charte: plate(
    'charte',
    'Éventail de papiers encre, parchemin et cyan, tenu par un poids d’argent, à côté d’un cadre noir vide.',
    'Charte',
    'Trois matières. Une seule règle.',
  ),
  mobile: plate(
    'mobile',
    'Dalle de verre noir sur un socle de pierre claire, avec des blocs de parchemin et une barre cyan.',
    'Mobile',
    'Le téléphone porte la page.',
  ),
  securite: plate(
    'securite',
    'Bouclier d’argent devant une vitre où un plan est gravé en lignes cyan, sur un marbre noir.',
    'Sécurité',
    'Le plan reste lisible. La décision aussi.',
  ),
};

export const homeSlides: Illustration[] = [
  illustrations.courrier,
  illustrations.site,
  illustrations.systeme,
  illustrations.charte,
  illustrations.mobile,
  illustrations.securite,
];

export const siteSlides: Illustration[] = [
  illustrations.site,
  illustrations.charte,
  illustrations.courrier,
  illustrations.mobile,
];
