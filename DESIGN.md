# Atomixia — système stellaire

Direction : Stellar Ink, or champagne, cyan ionique. Le logo officiel reste le A argent (`public/brand/mark.webp`). Il n’est ni redessiné ni remplacé. L’or est la signature, le cyan signale la donnée et l’état actif.

## Jetons

| Jeton | Valeur | Rôle |
| --- | --- | --- |
| Deep Ink | `#050609` | Fond |
| Obsidian | `#090C12` | Panneaux |
| Midnight | `#101725` | Navigation |
| Surface | `#151D2B` | Surfaces élevées |
| Filet | `#283343` | Bordures |
| Or champagne | `#D9C18A` | Signature, filets, focus |
| Or lumineux | `#F2D9A0` | Hautes lumières |
| Bronze | `#8E7045` | Ombre métallique |
| Cyan ionique | `#00DDF5` | Donnée, lien actif |
| Bleu électrique | `#2583FF` | Profondeur |
| Blanc | `#F4F5F8` | Texte |
| Texte atténué | `#A7B0BF` | Secondaire |
| Texte discret | `#737E90` | Annotations |
| Succès | `#62D6A3` | Constat corrigé |
| Alerte | `#E8B86D` | Signal de sécurité |
| Erreur | `#F07885` | Constat élevé |

Space Grotesk pour l’interface, Cormorant Garamond pour les phrases éditoriales, JetBrains Mono pour les index. Inter pour le texte courant.

## Mouvement

| Famille | Outil | Ce qu’il anime |
| --- | --- | --- |
| Entrées, orbites, états | CSS | Hero, anneaux, cartes, menu |
| Ligne de lumière | GSAP ScrollTrigger | La méthode, au défilement |
| Scène planétaire | Three.js | Étoiles, anneaux, quatre planètes |
| Champ de la démo agent | Three.js | Points derrière le flux simulé |
| Curseur | CSSOM (`transform`) | Point et anneau, bureau uniquement |

Le curseur n’existe qu’avec une souris fine et sans `prefers-reduced-motion`. Le mouvement réduit fige les scènes sur leur état lisible. Sans WebGL, le canvas disparaît et les liens HTML restent.

La politique de sécurité du site bloque les attributs `style` dans le HTML. Les animations passent par des classes ou par le CSSOM (`element.style.transform`), jamais par `setAttribute('style')`.

## Pages

- `/` — univers, clarté, automatisation, architecture, conseil, cyber, méthode, Artemisia, contact.
- `/solutions/automatisation-ia`
- `/solutions/saas-logiciels`
- `/expertises/conseil-systeme-information`
- `/expertises/cybersecurite-pentest` — `/securite` redirige ici.

Les scènes sont des démonstrations. Aucun e-mail n’est envoyé, aucune facture n’est émise, aucun test d’intrusion n’est lancé depuis le site.

## Higgsfield

La génération d’images a été tentée sur les modèles `gpt_image_2_5`, `soul_location` et `recraft_v4_1`. Le compte est sur le plan gratuit : chaque appel répond « Requires basic plan or higher ». Aucun visuel généré n’a été intégré, et les appels n’ont pas été répétés. Les planètes, les étoiles et les anneaux sont procéduraux. Voir `docs/assets.md`.
