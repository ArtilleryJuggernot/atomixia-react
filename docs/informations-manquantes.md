# Informations manquantes

Ces éléments n’ont pas été inventés.

- Forme juridique, capital social, numéro SIRET, RCS, numéro de TVA.
- Adresse postale du siège.
- Identité de l’hébergeur et lieu d’hébergement des données.
- URL publique du logiciel Artemisia.
- Prix du diagnostic. Le bloc ne l’affiche que si une valeur est ajoutée dans `src/content/home/page.json` (`diagnostic.price`).
- Prestataire d’e-mail transactionnel. Le formulaire enregistre la demande côté serveur (`data/leads/contacts.jsonl`, ou `LEADS_PATH`). L’envoi par Resend ne part que si `RESEND_API_KEY` et `CONTACT_FROM` sont définis. `CONTACT_TO` vaut par défaut `hugo.jacquel@atomixia.fr`.
- Outil d’envoi de la prospection. La désinscription est enregistrée côté serveur (`data/prospection/oppositions.jsonl`, ou `OPPOSITIONS_PATH`). Le lien à placer dans chaque message est `https://atomixia.fr/desinscription?email=` suivi de l’adresse encodée.
- Nom d’un délégué à la protection des données, s’il en existe un.
- Durée de conservation si elle doit différer des 24 mois retenus dans la politique.
- Clients, logos, témoignages, chiffre d’affaires, pourcentages, nombre d’agents déployés. Les comptes affichés dans les scènes d’usage (e-mails, relances, sources) sont des exemples de fonctionnement, pas des mesures d’Atomixia.
