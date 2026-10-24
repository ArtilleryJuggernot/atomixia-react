export type ServiceId = 'automation' | 'software' | 'systems' | 'cyber';

export type Faq = { question: string; answer: string };

export type Service = {
  id: ServiceId;
  index: string;
  label: string;
  short: string;
  name: string;
  href: string;
  tone: 'cyan' | 'gold' | 'silver' | 'amber';
  summary: string;
  pageTitle: string;
  headline: string;
  lede: string;
  problem: string;
  audiences: string[];
  delivers: string[];
  engagement: { title: string; text: string }[];
  deliverables: string[];
  technical: string[];
  faqs: Faq[];
  cta: string;
};

export const services: Record<ServiceId, Service> = {
  automation: {
    id: 'automation',
    index: '01',
    label: 'Automatisation intelligente',
    short: 'Automatisation IA',
    name: 'Agents et automatisations',
    href: '/solutions/automatisation-ia',
    tone: 'cyan',
    summary: 'Relier les outils, préparer les gestes répétitifs, garder une personne pour décider.',
    pageTitle: 'Automatisation IA — Des processus plus intelligents.',
    headline: 'Des processus plus intelligents.',
    lede: 'Les demandes arrivent, les pièces s’accumulent, les mêmes gestes reviennent chaque semaine. Un agent prépare ce travail à partir des outils déjà en place. L’envoi, l’émission et l’engagement restent une décision humaine.',
    problem:
      'Le temps se perd entre la messagerie, les dossiers et l’outil de suivi. Les informations existent, mais personne n’a le temps de les rapprocher.',
    audiences: [
      'TPE et PME dont une personne absorbe la messagerie et la préparation des pièces.',
      'Cabinets, agences et entreprises du bâtiment qui traitent des demandes semblables chaque jour.',
      'Équipes qui veulent un agent relié à leurs outils, sans remplacer ces outils.',
    ],
    delivers: [
      'Tri et préparation des e-mails entrants, avec réponse proposée.',
      'Lecture de documents : devis, bons, factures, pièces jointes.',
      'Rapprochement avec la fiche client ou le dossier existant.',
      'Orchestration entre messagerie, dossiers, suivi et facturation.',
      'Validation humaine avant tout envoi ou toute émission.',
      'Journal des actions : question, pièces consultées, texte préparé, personne qui valide.',
      'Gouvernance : accès par rôle, sources citées, périmètre écrit.',
    ],
    engagement: [
      { title: 'Observer', text: 'Une semaine réelle, un mail, un devis, une pièce introuvable.' },
      { title: 'Cartographier', text: 'Les étapes, les outils, les décisions. Ce qu’un agent peut préparer.' },
      { title: 'Relier', text: 'L’agent s’appuie sur la messagerie, les dossiers et la facturation en place.' },
      { title: 'Encadrer', text: 'Rôles, sources, validation, journal. Ce qui est interdit est écrit.' },
      { title: 'Superviser', text: 'On relit, on corrige, on arrête si le métier change.' },
    ],
    deliverables: [
      'Carte du processus avec responsables et points de validation.',
      'Agent relié aux outils, avec ses règles d’accès.',
      'Journal consultable des actions préparées et validées.',
      'Guide de supervision pour l’équipe.',
    ],
    technical: [
      'L’agent lit ce que la personne est autorisée à lire.',
      'Une réponse sur un document nomme la pièce. Sans pièce, l’agent le dit.',
      'Les documents d’entreprise ne servent pas à entraîner un modèle public.',
      'L’hébergement se choisit avec vous.',
    ],
    faqs: [
      {
        question: 'L’agent envoie-t-il des e-mails tout seul ?',
        answer: 'Non. Il prépare. Une personne relit et décide. La démonstration de cette page ne fait rien partir.',
      },
      {
        question: 'Faut-il changer nos logiciels ?',
        answer: 'Rarement. On relie ce qui existe. S’il manque un outil pour porter le processus, on peut le concevoir.',
      },
      {
        question: 'Combien de processus au départ ?',
        answer: 'Peu. Ceux qui font perdre du temps chaque semaine. Le périmètre s’élargit ensuite, si l’usage le justifie.',
      },
    ],
    cta: 'Décrire une tâche à automatiser',
  },
  software: {
    id: 'software',
    index: '02',
    label: 'Systèmes logiciels',
    short: 'SaaS et logiciels',
    name: 'Logiciels sur mesure et SaaS',
    href: '/solutions/saas-logiciels',
    tone: 'gold',
    summary: 'Applications web, plateformes SaaS, outils internes et API alignés sur un besoin réel.',
    pageTitle: 'Logiciels sur mesure et SaaS — Vos idées deviennent des produits.',
    headline: 'Vos idées deviennent des produits.',
    lede: 'Quand le tableur ou la boîte mail ne suffisent plus, l’outil se dessine autour du parcours de la personne qui s’en sert chaque semaine. Artemisia, logiciel de gestion pour le BTP, est le produit déjà commercialisé par Atomixia.',
    problem:
      'Les données vivent dans des fichiers partagés, les droits sont flous, et chaque nouvelle personne réinvente la méthode.',
    audiences: [
      'Entreprises dont le métier n’entre dans aucun logiciel du marché.',
      'Structures qui veulent un outil interne limité et utilisable, plutôt qu’un catalogue.',
      'Fondateurs qui veulent une première version d’un SaaS, tenue par un usage réel.',
    ],
    delivers: [
      'Applications web métier.',
      'Plateformes SaaS multi-comptes.',
      'Outils internes : suivi, dossiers, documents, droits.',
      'API et intégrations avec les outils déjà en place.',
      'Modèle de données et architecture.',
      'Authentification, rôles et permissions.',
      'Déploiement, sauvegardes et supervision.',
      'Évolution et maintenance après la mise en service.',
    ],
    engagement: [
      { title: 'Comprendre', text: 'Le parcours de la personne qui ouvrira l’outil chaque semaine.' },
      { title: 'Dessiner', text: 'Les écrans utiles, les comptes, les permissions. Rien de décoratif.' },
      { title: 'Construire', text: 'Une première version limitée, utilisable, mise entre les mains.' },
      { title: 'Intégrer', text: 'Les outils existants sont reliés, les données migrées quand il le faut.' },
      { title: 'Faire évoluer', text: 'Ce qui coince vraiment est traité en premier.' },
    ],
    deliverables: [
      'Maquettes sobres validées avec l’équipe.',
      'Application déployée, avec comptes et permissions.',
      'Documentation technique et guide d’usage.',
      'Plan d’évolution hiérarchisé.',
    ],
    technical: [
      'Comptes et permissions avant les tableaux de bord.',
      'Données utiles au métier, sans faux cockpit.',
      'Sauvegardes et journalisation prévues dès la première version.',
      'Pile choisie pour durer : Laravel, Livewire, Tailwind, MariaDB sur Artemisia.',
    ],
    faqs: [
      {
        question: 'Un site vitrine et un logiciel, est-ce le même projet ?',
        answer: 'Non. Le site explique et reçoit une demande. Le logiciel sert à faire le travail. On peut commencer par l’un.',
      },
      {
        question: 'Qui possède le code ?',
        answer: 'Le cadre est écrit au départ. Pour un outil interne, le client dispose de son application et de ses données.',
      },
      {
        question: 'Que se passe-t-il après la mise en ligne ?',
        answer: 'Une période de suivi, puis une évolution par priorités, sur ce que l’équipe rencontre réellement.',
      },
    ],
    cta: 'Décrire le logiciel',
  },
  systems: {
    id: 'systems',
    index: '03',
    label: 'Architecture des systèmes',
    short: 'Conseil SI',
    name: 'Conseil en systèmes d’information',
    href: '/expertises/conseil-systeme-information',
    tone: 'silver',
    summary: 'Comprendre, relier et moderniser le système d’information au service de la stratégie.',
    pageTitle: 'Conseil en systèmes d’information — Une architecture qui sert votre stratégie.',
    headline: 'Une architecture qui sert votre stratégie.',
    lede: 'Les applications se sont ajoutées avec les années. Les flux de données ne sont écrits nulle part. Avant d’automatiser ou de développer, on regarde l’ensemble, on nomme les dépendances et on hiérarchise.',
    problem:
      'Chaque outil a été choisi pour une bonne raison. Ensemble, ils forment un système que personne ne décrit en entier.',
    audiences: [
      'PME qui préparent une automatisation ou un nouveau logiciel et veulent partir d’un état des lieux.',
      'Directions qui doivent arbitrer une modernisation ou un choix d’hébergement.',
      'Organisations qui veulent évaluer leur maturité avant d’introduire de l’IA.',
    ],
    delivers: [
      'État des lieux technique et architectural.',
      'Cartographie applicative et flux de données.',
      'Stratégie d’intégration entre outils.',
      'Choix cloud et infrastructure, argumentés.',
      'Lecture de la dette technique.',
      'Trajectoire de modernisation.',
      'Préparation à l’IA : données, accès, règles.',
      'Sécurité et gouvernance dans les recommandations.',
    ],
    engagement: [
      { title: 'Audit', text: 'Entretiens, lecture des outils, relevé des flux réels.' },
      { title: 'Architecture', text: 'La carte cible, avec ce qui reste, ce qui se relie, ce qui s’arrête.' },
      { title: 'Priorisation', text: 'Les chantiers ordonnés par effet sur le travail et par risque.' },
      { title: 'Implémentation', text: 'Avec Atomixia ou avec vos prestataires, le plan reste le même.' },
      { title: 'Optimisation', text: 'Relecture à distance, ajustement de la trajectoire.' },
    ],
    deliverables: [
      'Cartographie applicative annotée.',
      'Schéma des flux de données.',
      'Rapport de recommandations hiérarchisées.',
      'Feuille de route par étapes.',
    ],
    technical: [
      'Les recommandations nomment un effet attendu sur le travail, pas seulement une technologie.',
      'Les dépendances critiques sont listées avant les nouveautés.',
      'Les règles d’accès aux données précèdent tout projet d’IA.',
      'Le rapport est lisible par une direction et par une équipe technique.',
    ],
    faqs: [
      {
        question: 'Faut-il un audit avant un agent IA ?',
        answer: 'Souvent utile quand plusieurs outils sont en jeu. Pour un processus isolé, l’observation d’une semaine suffit.',
      },
      {
        question: 'Atomixia impose-t-elle ses outils ?',
        answer: 'Non. Le plan est écrit pour être exécuté par n’importe quelle équipe compétente.',
      },
      {
        question: 'Quelle durée ?',
        answer: 'Selon le nombre d’applications et de flux. Le périmètre est fixé après un premier échange.',
      },
    ],
    cta: 'Demander un état des lieux',
  },
  cyber: {
    id: 'cyber',
    index: '04',
    label: 'Cyberdéfense',
    short: 'Cybersécurité et pentest',
    name: 'Cybersécurité et pentest',
    href: '/expertises/cybersecurite-pentest',
    tone: 'amber',
    summary: 'Identifier les risques avant qu’ils ne deviennent des incidents, dans un périmètre autorisé.',
    pageTitle: 'Cybersécurité et pentest — Identifiez les risques avant qu’ils ne deviennent des incidents.',
    headline: 'Identifiez les risques avant qu’ils ne deviennent des incidents.',
    lede: 'Un système relié expose une surface. On la mesure, on cherche les faiblesses, on classe par priorité. Les tests se font uniquement dans un périmètre écrit et autorisé. Le livrable est un rapport, pas une garantie.',
    problem:
      'Les accès s’accumulent, les versions vieillissent, et personne ne sait ce qu’un attaquant verrait depuis l’extérieur.',
    audiences: [
      'PME qui exposent une application, un portail client ou un SaaS.',
      'Organisations qui préparent une mise en conformité et veulent une mesure honnête.',
      'Équipes qui ont corrigé des failles et veulent un nouveau test.',
    ],
    delivers: [
      'Évaluation de la posture de sécurité.',
      'Test d’intrusion autorisé, sur un périmètre écrit.',
      'Analyse de vulnérabilités.',
      'Sécurité applicative : authentification, droits, entrées.',
      'Évaluation de l’infrastructure exposée.',
      'Revue d’architecture de sécurité.',
      'Recommandations de correction hiérarchisées.',
      'Nouveau test après correction.',
    ],
    engagement: [
      { title: 'Cadrer', text: 'Périmètre, autorisation écrite, fenêtres de test, contacts.' },
      { title: 'Mesurer', text: 'Surface d’attaque, versions, services exposés.' },
      { title: 'Tester', text: 'Recherche de faiblesses dans le périmètre convenu.' },
      { title: 'Classer', text: 'Chaque constat avec un niveau de risque et une correction.' },
      { title: 'Retester', text: 'Vérification après correction, rapport mis à jour.' },
    ],
    deliverables: [
      'Rapport de constats classés par risque.',
      'Recommandations de correction, concrètes.',
      'Synthèse lisible par une direction.',
      'Rapport de nouveau test.',
    ],
    technical: [
      'Un audit décrit l’organisation et les règles. Une analyse de vulnérabilités liste les faiblesses connues. Un test d’intrusion tente de les exploiter, dans le cadre autorisé.',
      'Aucun test sans autorisation écrite du responsable du système.',
      'Aucune promesse de couverture totale, de certification ou de conformité.',
      'La correction reste la décision du client.',
    ],
    faqs: [
      {
        question: 'Le pentest garantit-il que nous sommes protégés ?',
        answer: 'Non. Il photographie une situation à une date, dans un périmètre. Il réduit l’incertitude, il ne la supprime pas.',
      },
      {
        question: 'Atomixia surveille-t-elle nos systèmes en continu ?',
        answer: 'Non. Les prestations sont ponctuelles : évaluation, test, nouveau test après correction.',
      },
      {
        question: 'Qui réalise les tests ?',
        answer: 'Des personnes qualifiées, nommées dans le cadrage, avec l’autorisation du responsable du système.',
      },
    ],
    cta: 'Cadrer un test',
  },
};

export const serviceList: Service[] = [services.automation, services.software, services.systems, services.cyber];
