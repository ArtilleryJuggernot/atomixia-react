# Atomixia

Site d’entreprise statique, avec un formulaire rendu à la demande.

```bash
npm install
npm test
npm run dev
npm run build
npm run preview
```

Node.js 22 ou plus récent.

Variables facultatives :

- `LEADS_PATH` — fichier JSONL des demandes
- `OPPOSITIONS_PATH` — fichier JSONL des désinscriptions de prospection
- `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` — envoi d’e-mail

Lien de désinscription à placer dans chaque message de prospection. L’adresse est encodée pour une URL (`encodeURIComponent`) :

`https://atomixia.fr/desinscription?email=adresse%40domaine.fr`

`GET /desinscription?email=` enregistre l’adresse dans la liste d’opposition (`data/prospection/oppositions.jsonl`, ou `OPPOSITIONS_PATH`). Le paramètre `mail` est accepté aussi. Un second appel pour la même adresse ne crée pas de doublon. Avec `Accept: application/json`, la réponse est un objet `{ ok, email, created }`.

Les jetons visuels sont dans `docs/systeme-visuel.md`. Les faits non publiés sont listés dans `docs/informations-manquantes.md`.
