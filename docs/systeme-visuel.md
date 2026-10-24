# Système visuel Atomixia

La référence à jour est [DESIGN.md](../DESIGN.md). Univers : obsidienne, navy, cyan électrique. Le logo officiel ne change pas.

## Couleurs

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `ink-950` | `#05080d` | Fond principal |
| `ink-900` | `#0b1422` | Barre de navigation, panneaux |
| `ink-800` | `#14243a` | Surface élevée |
| `parchment` | `#f5f8fc` | Texte principal, titres |
| `parchment-dim` | `#c9d4e2` | Texte secondaire |
| `gold-400` | `#176bff` | Bleu ion, réservé aux états |
| `cyan-flux` | `#00e5ff` | Signal, orbite, action |
| `cyan-deep` | `#176bff` | Dégradé du bouton |
| `silver` | `#d5dde6` | Chrome du mot-marque |

Le violet n’apparaît que dans un halo radial très dilué (`rgba(139, 92, 246, 0.04)`), jamais en aplat.

## Typographie

Graisses réellement chargées, `font-display: optional`, fichiers latin et latin-ext auto-hébergés.

| Famille | Graisses | Usage |
| --- | --- | --- |
| Space Grotesk | 500 | Titres, boutons, marque |
| Cormorant Garamond | 500 italique | Une phrase éditoriale par section |
| Inter | 400 | Texte courant |
| JetBrains Mono | 400 | Repères, catégories, métadonnées, en petites capitales espacées |

## Composants

- Cartes verre : fond parchemin à 4 %, filet fin, sans ombre portée lourde.
- Coins de visée : quatre segments or, réservés aux blocs qui portent une décision (diagnostic, Artemisia, cadre).
- Filet or sous les titres, aligné à gauche, qui s’efface.
- Bouton pilule électrique (dégradé cyan, texte encre) et bouton fantôme (filet cyan).
- Marque : le A argent et l’orbite cyan du logo, plus le mot-marque chromé. Signature : Intelligence · Automatiser · Impact.
- Le hero porte le logo complet, avec une entrée GSAP et un halo. Le défilement révèle les cartes d’offres. `prefers-reduced-motion` laisse tout visible, sans boucle.
- Grain fixe très léger (`/noise.png`, opacité 4 %) derrière le texte.
- Focus visible : contour cyan 2 px, décalage 3 px. Curseur système natif.

## Constellation

Chaque agent est une étoile. Les traits sont les données qui circulent. L’étoile active passe au cyan. Le tracé est progressif ; il est immédiat si `prefers-reduced-motion` ou si JavaScript est absent.

## Motion

Révélations courtes à l’entrée dans le viewport, uniquement sous la ligne de flottaison, via opacité et translation. Le tracé de la constellation et le filet des démonstrations sont en CSS. Le hero porte une scène Three.js (champ et anneaux) et des panneaux HTML. Le défilement des états est en CSS et en minuteur. `prefers-reduced-motion` fige la scène sur le dernier état.
