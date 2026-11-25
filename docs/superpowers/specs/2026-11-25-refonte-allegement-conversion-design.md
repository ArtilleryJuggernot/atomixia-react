# Refonte allégée et orientée conversion

## Objectif

Refondre atomixia.fr en conservant toutes ses URL publiques, ses contenus vérifiés et ses démonstrations utiles, tout en ramenant le contenu principal à environ 3 400 mots, en supprimant toute mention de prix et en améliorant nettement la conversion, l’accessibilité mobile et la performance de l’accueil.

## Décision d’architecture

L’implémentation est « Astro d’abord » :

- le HTML utile est rendu statiquement par Astro ;
- la navigation, le pied de page, les CTA et les sections éditoriales ne dépendent pas de React ;
- React reste limité au formulaire et aux démonstrations qui ont un état interactif réel ;
- le JavaScript global est limité au menu accessible, à la barre CTA mobile et au contrôleur de mouvement ;
- Three.js disparaît de l’accueil et ne peut être chargé ailleurs que sur un appareil desktop avec pointeur fin, après visibilité de la scène ;
- GSAP et ScrollTrigger pilotent uniquement les révélations, les images et la ligne de méthode.

Les pages de service ne sont plus contraintes par un gabarit éditorial uniforme. Elles partagent des primitives de page — hero, CTA, liste, étapes, FAQ — et gardent une composition Astro spécifique aux contenus prescrits dans l’audit.

## Système global

### Navigation

L’en-tête desktop propose un menu « Services » accessible au clavier contenant Sites web, Automatisation IA, Logiciels, Conseil SI et Cybersécurité, puis Réalisations, À propos et Contact. Le numéro de téléphone et le bouton « Devis gratuit » restent visibles.

Sous 768 px, l’en-tête mesure au plus 64 px. Il comprend le logo, un bouton d’appel de 44 px et un burger de 44 px. Le menu plein écran :

- expose `aria-expanded` et `aria-controls` ;
- déplace le focus au premier lien à l’ouverture ;
- piège Tab et Maj+Tab ;
- se ferme par Échap, clic sur un lien ou clic sur le bouton de fermeture ;
- rend le focus à l’élément déclencheur.

### Conversion

Les coordonnées et libellés sont centralisés dans `src/lib/site.ts`. Le CTA primaire commun est « Demander un devis gratuit » vers `/contact`. Le CTA secondaire est un lien `tel:+33781223171`. Le mailto de devis possède l’objet et le corps préremplis demandés.

Une barre fixe mobile apparaît après la sortie du hero, se masque lorsque le CTA final ou le pied de page entre dans le viewport et est absente de `/contact`. La classe appliquée au `body` réserve l’espace nécessaire ; aucun contenu n’est masqué.

### Pied de page et données structurées

Le pied de page comporte trois colonnes, des liens téléphone et e-mail d’au moins 44 px et le CTA devis. Le JSON-LD d’organisation contient un `contactPoint` commercial et aucun `priceRange`.

## Pages

Les H1, textes, suppressions, déplacements et budgets de mots suivent strictement `compte-rendu.md`. L’accueil contient exactement les sept sections prescrites, plus la citation unique de Sénèque comme pause éditoriale entre la démonstration et « Pourquoi Atomixia ».

Les modules sont déplacés sans duplication :

- `ClarityBoard` vers Conseil SI ;
- `TaskMatcher` vers `/usages` ;
- architecture à sept blocs vers Logiciels ;
- `Perimeter` vers Cybersécurité ;
- réalisations détaillées vers `/realisations`.

Le chiffre « +20 projets en production » disparaît. Le bloc témoignages n’est pas rendu tant que sa source est vide. `/methode` devient une redirection permanente vers `/a-propos#methode`.

Le gabarit agent contient Situation, quatre actions, trois limites au plus, une ligne outils vers résultat, deux FAQ et le CTA commun.

## Formulaire

Le modèle de données devient :

```ts
type ContactFields = {
  projectType: 'site' | 'automation' | 'software' | 'systems' | 'cyber' | 'other' | '';
  name: string;
  email: string;
  phone: string;
  project: string;
  consent: boolean;
  website: string;
};
```

Le pot de miel reste présent. `?tache=` sélectionne Automatisation IA et préremplit le projet. La validation, la persistance et l’e-mail serveur utilisent les mêmes champs. La réponse HTML de secours est sémantique et sans attribut `style`.

## Design

Le fond reste l’encre `#050609`. Les textes utilisent les couleurs vérifiées de la charte ; le cyan est réservé aux données et états actifs. Le bouton or s’arrête à `#B0945F` ou plus clair afin de conserver le contraste requis avec `#1A1308`.

L’échelle typographique fonctionnelle contient sept tailles : 13, 14, 17, 20, 28, 40 et un `clamp()` 44–72. Le corps est en Inter 17 px avec un interligne de 1,6. Aucun texte n’est inférieur à 13 px. Les titres utilisent Space Grotesk 500 et un seul segment Cormorant Garamond italique 500 par écran.

Les sections ont 72 px de respiration verticale en mobile et 120 px en desktop. Les paragraphes sont limités à 62 caractères environ. Les cartes n’ont pas de fond vitré systématique ; elles reposent sur l’espace et un filet or à 16 %, renforcé à 40 % au survol ou au focus.

Le hero d’accueil utilise un halo CSS et le monogramme existant à faible opacité, sans WebGL.

## Mouvement

Un contrôleur commun initialise GSAP côté client :

- titres : masque et translation Y de 100 % vers 0 en 700 ms ;
- sections : `ScrollTrigger.batch`, opacité 0→1 et Y 24→0, 600 ms, `power3.out`, départ à 85 %, une seule lecture ;
- réalisations : `clip-path` et scale 1,06→1, 900 ms ;
- méthode : progression liée au scroll avec `scrub: 0.6`.

Les micro-interactions utilisent le CSS et seulement `transform`, `opacity` ou `clip-path`. Toutes les boucles infinies existantes sont retirées ou remplacées par une lecture ponctuelle déclenchée par visibilité ou interaction.

`gsap.matchMedia()` traite `prefers-reduced-motion: reduce` : aucun scrub, aucune translation, aucun délai ; le contenu et les démonstrations sont directement dans leur état final. Les view transitions cross-document durent 250 ms et sont désactivées en mouvement réduit.

## Performance

L’accueil hydrate au plus un îlot de démonstration en `client:visible`. Il ne charge ni Three.js, ni curseur personnalisé, ni formulaire. Son JavaScript initial non compressé doit rester sous 150 Ko.

Les deux polices critiques — Space Grotesk 500 et Inter 400 — sont les seules préchargées. Toutes les fontes passent à `font-display: swap` avec repli ajusté. Les images conservent largeur et hauteur explicites.

## Tests et preuves

Les tests Node couvrent :

- le nouveau contrat et la validation du formulaire ;
- les H1 cibles dans le HTML construit ;
- les budgets de mots dans `<main>`, avec tolérance de 10 % ;
- l’absence de `€`, `tarif`, `à partir de`, `/mois`, `HT` et `TTC` dans le HTML construit ;
- la présence d’un lien téléphone et d’un lien e-mail sur chaque page publique ;
- l’absence d’attribut `style` dans le HTML construit et les gabarits de réponse ;
- la redirection de `/methode` et la méthode à quatre étapes.

Playwright vérifie les interactions du menu, de la barre mobile, du formulaire, les cibles tactiles et l’état en mouvement réduit. Il produit les captures avant/après en 1280 px et 390 px du premier écran de toutes les pages modifiées, ainsi qu’une capture pleine page de l’accueil.

Lighthouse mobile mesure `/`, `/solutions/automatisation-ia`, `/sites` et `/contact`. Les résultats avant/après, les mots avant/après et les captures sont joints à l’unique PR.

## Hors périmètre

Pas de témoignage, logo client, chiffre, photo ou réponse factuelle inventés. Les éléments manquants restent listés dans la PR sous « À fournir par Hugo ». Aucun déploiement, merge ou modification de `master`.
