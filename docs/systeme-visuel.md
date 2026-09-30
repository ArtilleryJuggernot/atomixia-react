# Système visuel Atomixia

Univers : atelier nocturne, précis, chaud, métallique. Peu d’effets. Beaucoup d’air.

## Couleurs

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `ink-950` | `#06040f` | Fond principal |
| `ink-900` | `#0c0922` | Barre de navigation, panneaux |
| `ink-800` | `#141033` | Réserve, plus claire |
| `parchment` | `#ece7da` | Texte principal, titres |
| `parchment-dim` | `#b8b3a6` | Texte secondaire, métadonnées |
| `gold-300` | `#ffe49a` | Or clair, survol |
| `gold-400` | `#f5c542` | Bouton principal, focus |
| `gold-500` | `#d9a521` | Filets, repères |
| `cyan-flux` | `#4be1ec` | Signal actif seulement |

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
- Bouton pilule or (texte encre) et bouton fantôme (filet or, texte parchemin).
- Grain fixe très léger (`/noise.png`, opacité 4 %) derrière le texte.
- Focus visible : contour or 2 px, décalage 3 px. Curseur système natif.

## Constellation

Chaque agent est une étoile. Les traits sont les données qui circulent. L’étoile active passe au cyan. Le tracé est progressif ; il est immédiat si `prefers-reduced-motion` ou si JavaScript est absent.

## Motion

Révélations courtes à l’entrée dans le viewport, uniquement sous la ligne de flottaison, via opacité et translation. Le tracé de la constellation et le filet des démonstrations sont en CSS. Le hero reste visible tout de suite. Pas d’animation infinie, pas de parallaxe, pas de scène 3D.
