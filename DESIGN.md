# Atomixia — système visuel

Direction : intelligence connectée. Fond obsidienne, surfaces navy, signal cyan. Le logo officiel reste le A argent et son orbite cyan (`public/brand/mark.webp`).

## Jetons

| Jeton | Valeur | Rôle |
| --- | --- | --- |
| Obsidian | `#05080D` | Fond |
| Deep Navy | `#0B1422` | Surfaces |
| Graphite Blue | `#14243A` | Surfaces élevées |
| Ion Blue | `#176BFF` | Bleu de marque |
| Electric Cyan | `#00E5FF` | Accent, lien actif, orbite |
| Titanium | `#C9D4E2` | Texte secondaire |
| Ice White | `#F5F8FC` | Texte principal |
| Ligne | `#29394D` | Filets |
| Succès | `#4ADE80` | État positif |
| Erreur | `#FB7185` | État d’erreur |

Space Grotesk pour les titres, Inter pour le texte, JetBrains Mono pour les états techniques. Cormorant Garamond reste réservé aux citations.

## Scène

Le hero est une démonstration. Sept états se succèdent : demande, analyse, fiche, brouillon, validation, sortie préparée, tâche prête. Les traits relient des nœuds réels. Aucun e-mail n’est envoyé, aucune facture n’est émise.

Three.js dessine le champ et les anneaux, sans style en ligne (`setSize(..., false)`), parce que la politique de sécurité ignore `unsafe-inline` dès qu’un hash de style est présent. Les panneaux, le logo et les libellés sont du HTML. GSAP n’anime pas cette scène. Le mouvement est en CSS, coupé si `prefers-reduced-motion`.

## Higgsfield

La génération d’image a été demandée (fond orbital, sans texte ni logo). Le compte est sur le plan gratuit : `gpt_image_2_5`, `soul_location` et `recraft_v4_1` répondent « Requires basic plan or higher ». Aucun visuel généré n’a été intégré. La scène est procédurale.
