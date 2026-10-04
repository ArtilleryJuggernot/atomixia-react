export type TaskStep = {
  label: string;
  detail: string;
};

export type TaskMatch = {
  title: string;
  steps: TaskStep[];
  result: string;
  hold: string;
};

const SPECIFIC: { test: RegExp; match: TaskMatch }[] = [
  {
    test: /mail|e-mail|courriel|bo[iî]te|inbox/i,
    match: {
      title: 'Tri et préparation des messages',
      steps: [
        { label: 'Réception', detail: 'Les messages entrent, avec leurs fils et leurs pièces.' },
        { label: 'Lecture', detail: 'L’agent repère la demande, l’échéance et le ton.' },
        { label: 'Classement', detail: 'Urgent, à traiter, information, à écarter.' },
        { label: 'Remontée', detail: 'Les messages qui comptent passent devant.' },
      ],
      result: 'La boîte est triée. Les réponses sont prêtes, pas envoyées.',
      hold: 'Vous validez chaque envoi.',
    },
  },
  {
    test: /veille|surveill|réglement|reglement|site|actualité|actualite|mot-cl/i,
    match: {
      title: 'Veille sur des sources choisies',
      steps: [
        { label: 'Sources', detail: 'Les pages, textes et lettres que vous indiquez.' },
        { label: 'Comparaison', detail: 'L’agent regarde ce qui a changé depuis le dernier passage.' },
        { label: 'Détection', detail: 'Seuls les écarts utiles sont gardés.' },
        { label: 'Note', detail: 'Une synthèse courte, avec les liens.' },
      ],
      result: 'Vous recevez les changements, pas une revue de presse entière.',
      hold: 'Vous choisissez les sources et ce qui mérite une suite.',
    },
  },
  {
    test: /réunion|reunion|briefing|rendez-vous|rdv/i,
    match: {
      title: 'Briefing avant ou après un échange',
      steps: [
        { label: 'Dossier', detail: 'E-mails, notes et historique du sujet.' },
        { label: 'Lecture', detail: 'L’agent en tire le contexte et les points ouverts.' },
        { label: 'Page', detail: 'Un briefing, ou un compte rendu avec les tâches.' },
        { label: 'Suite', detail: 'Responsables et échéances, à confirmer.' },
      ],
      result: 'Vous arrivez préparé, ou vous repartez avec les actions écrites.',
      hold: 'La réunion et les décisions restent les vôtres.',
    },
  },
  {
    test: /document|contrat|pdf|chercher|base|connaissance|dossier/i,
    match: {
      title: 'Recherche dans vos documents',
      steps: [
        { label: 'Dépôt', detail: 'Contrats, notes, procédures, comptes rendus.' },
        { label: 'Index', detail: 'L’agent retient où se trouve chaque information.' },
        { label: 'Question', detail: 'Vous demandez, il cherche dans ces pièces.' },
        { label: 'Réponse', detail: 'Le passage utile, avec la source.' },
      ],
      result: 'La réponse cite le document. Sans pièce, elle ne l’invente pas.',
      hold: 'La base ne contient que ce que vous y mettez.',
    },
  },
  {
    test: /relance|prospect|devis|client/i,
    match: {
      title: 'Relances et suivi commercial',
      steps: [
        { label: 'Dossier', detail: 'Devis envoyé, demande, date.' },
        { label: 'Échéance', detail: 'L’agent voit ce qui n’a pas eu de réponse.' },
        { label: 'Message', detail: 'Une relance courte, au ton de la maison.' },
        { label: 'Liste', detail: 'Qui appeler aujourd’hui.' },
      ],
      result: 'Les dossiers silencieux reviennent au bon moment.',
      hold: 'La relance part quand vous la validez.',
    },
  },
  {
    test: /rapport|lundi|compil|hebdo|chiffre|tableur|excel/i,
    match: {
      title: 'Rapport récurrent',
      steps: [
        { label: 'Sources', detail: 'Tableurs, suivis, notes de la période.' },
        { label: 'Lecture', detail: 'L’agent aligne les chiffres qui viennent de vos fichiers.' },
        { label: 'Écarts', detail: 'Ce qui bouge, ce qui bloque.' },
        { label: 'Page', detail: 'La synthèse de la semaine, sources citées.' },
      ],
      result: 'Le rapport est préparé. Il n’est pas envoyé tout seul.',
      hold: 'Vous relisez avant la direction ou le client.',
    },
  },
  {
    test: /facture|administratif|classement|archiv/i,
    match: {
      title: 'Classement de documents',
      steps: [
        { label: 'Réception', detail: 'Facture, bon, scan ou pièce.' },
        { label: 'Lecture', detail: 'Tiers, date, montant, quand ils sont écrits.' },
        { label: 'Nom', detail: 'Un nom de fichier et un dossier proposés.' },
        { label: 'Suite', detail: 'Transmission préparée vers la bonne personne.' },
      ],
      result: 'Le papier est nommé et rangé.',
      hold: 'Rien n’est signé, payé, ni transmis à la comptabilité sans vous.',
    },
  },
  {
    test: /voyage|vacance|itinéraire|itineraire/i,
    match: {
      title: 'Préparation d’un déplacement',
      steps: [
        { label: 'Cadre', detail: 'Destination, dates, contraintes.' },
        { label: 'Options', detail: 'Transports, durées, hébergements dans le cadre donné.' },
        { label: 'Journées', detail: 'Une trame, sans tout remplir.' },
        { label: 'Reste', detail: 'Ce que vous devez encore réserver.' },
      ],
      result: 'Un itinéraire à relire.',
      hold: 'Aucune réservation ni aucun paiement n’est lancé.',
    },
  },
  {
    test: /candidat|recrut|cv|rh|onboarding|entretien/i,
    match: {
      title: 'Préparation côté équipes',
      steps: [
        { label: 'Dossiers', detail: 'Messages, pièces, critères que vous avez écrits.' },
        { label: 'Lecture', detail: 'L’agent applique ces critères, pas une intuition.' },
        { label: 'Ordre', detail: 'Ce qui se lit en premier.' },
        { label: 'Suite', detail: 'Entretien ou parcours d’arrivée, en trame.' },
      ],
      result: 'La pile est ordonnée.',
      hold: 'Aucun refus, aucun accès, aucune promesse n’est envoyé sans une personne.',
    },
  },
  {
    test: /ticket|support|incident|log|panne/i,
    match: {
      title: 'File de support ou d’incident',
      steps: [
        { label: 'Signal', detail: 'Ticket, message ou extrait de journal.' },
        { label: 'Lecture', detail: 'Urgence, répétition, sujet déjà vu.' },
        { label: 'Ordre', detail: 'Ce qui bloque, ce qui a une réponse connue.' },
        { label: 'Piste', detail: 'Une réponse ou un diagnostic à vérifier.' },
      ],
      result: 'La file est claire. Le système n’est pas modifié.',
      hold: 'Vous envoyez la réponse ou lancez l’action technique.',
    },
  },
];

const GENERIC: TaskMatch = {
  title: 'Préparation de cette tâche',
  steps: [
    { label: 'La tâche', detail: 'Ce que vous venez de décrire, tel quel.' },
    { label: 'Le répétitif', detail: 'Ce qui se refait, les pièces, les outils déjà là.' },
    { label: 'L’agent', detail: 'Il rassemble, classe et prépare un résultat.' },
    { label: 'Vous', detail: 'Vous validez avant qu’une action ne parte.' },
  ],
  result: 'Cette tâche peut être préparée par un agent. Le périmètre se précise ensemble.',
  hold: 'Ce qui engage un client, un paiement ou un droit reste une décision humaine.',
};

export function matchTask(input: string): TaskMatch | null {
  const text = input.trim();
  if (text.length < 10) return null;
  const found = SPECIFIC.find((item) => item.test.test(text));
  return found?.match ?? GENERIC;
}
