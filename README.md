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
- `DESINSCRIPTIONS_PATH` — fichier JSONL des oppositions à la prospection (`data/leads/desinscriptions.jsonl` par défaut)
- `DESINSCRIPTION_TOKEN` — lecture de la liste (`Authorization: Bearer …`, page `/desinscriptions`)
- `DESINSCRIPTION_SECRET` — signature des liens de désinscription
- `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` — envoi d’e-mail

La page publique est `/stop`. Elle enregistre une opposition via `POST /api/desinscription`.

```bash
# Lien à placer dans un message de prospection
DESINSCRIPTION_SECRET=change-me npm run stop:lien -- personne@exemple.fr

# Savoir si une adresse est déjà désinscrite
curl -s -H "Authorization: Bearer $DESINSCRIPTION_TOKEN" \
  "https://atomixia.fr/api/desinscription?email=personne@exemple.fr"

# Toute la liste
curl -s -H "Authorization: Bearer $DESINSCRIPTION_TOKEN" \
  https://atomixia.fr/api/desinscription
```

Le lien signé ouvre `/stop`. Le second URL sert au désabonnement en un clic (`POST` avec le corps `List-Unsubscribe=One-Click`).

Les jetons visuels sont dans `docs/systeme-visuel.md`. Les faits non publiés sont listés dans `docs/informations-manquantes.md`.
