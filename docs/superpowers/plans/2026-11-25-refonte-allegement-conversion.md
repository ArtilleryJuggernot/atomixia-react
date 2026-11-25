# Refonte allégée et conversion — plan d’implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer la refonte Astro d’atomixia.fr conforme au brief, plus légère, accessible et orientée vers le devis gratuit.

**Architecture:** Astro rend tout le contenu et le shell global. React est limité au formulaire et aux démonstrations interactives conservées. Un contrôleur GSAP commun anime les révélations et la ligne de méthode, avec un chemin sans mouvement.

**Tech Stack:** Astro 5, React 19 en îlots, Tailwind 4, GSAP 3 + ScrollTrigger, Three.js uniquement en chargement conditionnel desktop, Node Test Runner, Playwright, Lighthouse.

## Global Constraints

- Branche unique `refonte/allegement-conversion`, base `master`, sans merge ni déploiement.
- Aucun prix, montant, `€`, `tarif`, `à partir de`, `/mois`, `HT` ou `TTC` dans le HTML rendu.
- Aucune URL publique supprimée ; `/methode` redirige en 301 vers `/a-propos#methode`.
- Aucun attribut `style` dans le HTML ; ne pas affaiblir la CSP.
- Téléphone et e-mail proviennent uniquement de `src/lib/site.ts`.
- H1, textes cibles et budgets de mots suivent `compte-rendu.md`.
- Aucun chiffre, témoignage, logo client, diplôme ou fait non vérifié n’est ajouté.
- Toutes les interactions principales mesurent au moins 44 px ; aucun texte sous 13 px.
- `prefers-reduced-motion: reduce` affiche immédiatement l’état final sans transformation ni scrub.
- L’accueil ne charge pas Three.js, hydrate trois îlots au maximum et vise moins de 150 Ko de JavaScript initial non compressé.

---

### Task 1: Tests de contrat du build

**Files:**
- Create: `test/site-output.test.ts`
- Create: `test/content-contract.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: fichiers HTML dans `dist/client`.
- Produces: helpers `publicHtmlFiles()`, `mainWordCount(html)` et tests de conformité exécutés après `npm run build`.

- [ ] **Step 1: écrire les tests en échec**

Ajouter des assertions qui lisent chaque `dist/client/**/index.html` et vérifient les H1 cibles, budgets ±10 %, prix interdits, coordonnées, zéro `style=`, zéro emoji, et la méthode à quatre étapes.

- [ ] **Step 2: vérifier le rouge**

Run: `npm run build && npm test`
Expected: FAIL sur les H1, budgets, prix latent ou coordonnées manquantes.

- [ ] **Step 3: ajouter une commande de vérification**

Conserver `npm test` pour les tests unitaires et de sortie ; les tests de sortie doivent expliquer que `npm run build` est requis si `dist/client` manque.

- [ ] **Step 4: commit**

```bash
git add package.json test/site-output.test.ts test/content-contract.test.ts
git commit -m "test: verrouiller les contrats éditoriaux du site"
```

### Task 2: Conversion et formulaire

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/lib/contact.ts`
- Modify: `src/components/islands/ContactForm.tsx`
- Modify: `src/pages/api/contact.ts`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/confidentialite.astro`
- Modify: `test/contact.test.ts`

**Interfaces:**
- Produces: `site.quoteMailto`, `site.quoteCta`, `ContactFields.projectType`, `ContactFields.project`.
- Consumes: `site.phoneTel`, `site.phoneDisplay`, `site.email`.

- [ ] **Step 1: adapter les tests du formulaire au contrat cible**

Tester un type obligatoire, nom, e-mail, téléphone facultatif, projet de 20 à 2 000 caractères, consentement et pot de miel.

- [ ] **Step 2: vérifier le rouge**

Run: `npm test -- test/contact.test.ts`
Expected: FAIL car `projectType` et `project` n’existent pas.

- [ ] **Step 3: implémenter le modèle, l’API et l’interface**

Les pastilles radio utilisent les six valeurs prescrites. `?tache=` sélectionne `automation`. La réponse HTML serveur n’emploie aucun style inline.

- [ ] **Step 4: vérifier et commit**

Run: `npm test -- test/contact.test.ts`
Expected: PASS.

```bash
git add src/lib/site.ts src/lib/contact.ts src/components/islands/ContactForm.tsx src/pages/api/contact.ts src/pages/contact.astro src/pages/confidentialite.astro test/contact.test.ts
git commit -m "feat: simplifier la demande de devis"
```

### Task 3: Shell global accessible

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Create: `src/components/MobileCta.astro`
- Create: `src/components/FinalCta.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `src/styles/global.css`
- Modify: `src/styles/fonts.css`

**Interfaces:**
- `MobileCta` détecte `[data-page-hero]`, `[data-final-cta]` et `footer`.
- `FinalCta` rend le CTA `/contact`, le lien `tel:` et le micro-texte commun.

- [ ] **Step 1: écrire des assertions de sortie pour le shell**

Chaque page doit contenir `tel:+33781223171`, un mailto Atomixia, un lien devis et un unique `<header>`.

- [ ] **Step 2: vérifier le rouge**

Run: `npm run build && npm test`
Expected: FAIL sur les pages sans CTA ou mailto.

- [ ] **Step 3: implémenter navigation, footer, CTA mobile et JSON-LD**

Le menu mobile piège le focus et se ferme par Échap. La barre mobile n’est pas rendue sur `/contact`. Les polices passent à `swap`.

- [ ] **Step 4: vérifier et commit**

Run: `npm run build && npm test`
Expected: PASS pour les contrats globaux.

```bash
git add src/components src/layouts/Base.astro src/styles src/lib/site.ts test
git commit -m "feat: ajouter le shell de conversion accessible"
```

### Task 4: Accueil statique et léger

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/HomeHero.astro`
- Create: `src/components/ServiceCards.astro`
- Modify: `src/components/LightLine.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Hero expose `data-page-hero`.
- Les sections animables exposent `data-reveal-group` et les éléments `data-reveal-item`.
- L’accueil ne référence ni `StellarScene`, ni `SystemScene`, ni `TaskMatcher`, ni `ContactForm`, ni `Cursor`.

- [ ] **Step 1: faire échouer le test H1/budget/poids**

Run: `npm run build && npm test`
Expected: FAIL pour le H1, le budget de 450 mots et les interdits d’accueil.

- [ ] **Step 2: composer les sept sections et la citation**

Utiliser `StageView client:visible` comme unique démonstration React. Remplacer le WebGL par le halo CSS.

- [ ] **Step 3: vérifier l’artefact**

Run: `npm run build && npm test && test ! -f dist/client/_astro/StellarScene*.js`
Expected: PASS et aucun chunk StellarScene référencé par l’accueil.

- [ ] **Step 4: commit**

```bash
git add src/pages/index.astro src/components src/styles/global.css
git commit -m "feat: alléger l’accueil"
```

### Task 5: Pages services

**Files:**
- Modify: `src/lib/services.ts`
- Modify: `src/components/ServiceShell.astro`
- Modify: `src/pages/solutions/automatisation-ia.astro`
- Modify: `src/pages/solutions/saas-logiciels.astro`
- Modify: `src/pages/expertises/conseil-systeme-information.astro`
- Modify: `src/pages/expertises/cybersecurite-pentest.astro`
- Modify: `src/pages/sites.astro`
- Modify: `src/content/sites/page.json`

**Interfaces:**
- Les pages partagent hero, `FinalCta`, listes, étapes et FAQ, mais contrôlent leurs sections.
- Les scènes Three éventuelles ne démarrent qu’après `(min-width: 1024px) and (pointer: fine)`.

- [ ] **Step 1: constater les échecs H1 et budgets**

Run: `npm run build && npm test`
Expected: FAIL sur les cinq H1 et budgets.

- [ ] **Step 2: appliquer les textes et compositions de l’audit**

Automatisation conserve une démo sans envoi ; Logiciels conserve les sept blocs ; Conseil accueille `ClarityBoard` ; Cyber conserve `Perimeter` ; Sites retire les huit emojis.

- [ ] **Step 3: vérifier et commit**

Run: `npm run build && npm test`
Expected: PASS sur H1, budgets, prix, contacts et emoji.

```bash
git add src/lib/services.ts src/components/ServiceShell.astro src/pages/solutions src/pages/expertises src/pages/sites.astro src/content/sites/page.json
git commit -m "feat: condenser les pages de services"
```

### Task 6: Pages portfolio, usages, agents et à-propos

**Files:**
- Modify: `src/pages/realisations.astro`
- Modify: `src/pages/usages.astro`
- Modify: `src/pages/agents/index.astro`
- Modify: `src/pages/agents/[slug].astro`
- Modify: `src/content/agents/*.json`
- Modify: `src/pages/a-propos.astro`
- Modify: `src/content/about/page.json`
- Modify: `src/content/method/parcours.json`
- Modify: `astro.config.mjs`
- Delete: `src/pages/methode.astro`

**Interfaces:**
- Le gabarit agent limite les FAQ à deux et fusionne `neverAlone` avec `safeguards`.
- `/a-propos#methode` expose les quatre étapes communes.

- [ ] **Step 1: constater les échecs H1/budgets/redirection**

Run: `npm run build && npm test`
Expected: FAIL.

- [ ] **Step 2: appliquer les textes et structures**

Limiter les exemples de réalisations à six, conserver TaskMatcher sur Usages, condenser tous les agents et fusionner Méthode dans À propos.

- [ ] **Step 3: vérifier et commit**

Run: `npm run build && npm test`
Expected: PASS.

```bash
git add src/pages src/content astro.config.mjs
git commit -m "feat: condenser les pages éditoriales"
```

### Task 7: Mouvement sobre et suppression de la dette visuelle

**Files:**
- Create: `src/components/Motion.astro`
- Modify: `src/components/LightLine.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `src/styles/global.css`
- Delete: `src/components/islands/Cursor.tsx`

**Interfaces:**
- `Motion.astro` initialise les sélecteurs `data-title-line`, `data-reveal-item`, `data-work-image`.
- Aucun élément essentiel ne dépend de l’animation pour être visible avec mouvement réduit ou sans script.

- [ ] **Step 1: ajouter le test statique des animations interdites**

Le test source refuse `animation: ... infinite` sur les sélecteurs retirés et vérifie la règle `prefers-reduced-motion`.

- [ ] **Step 2: vérifier le rouge**

Run: `npm test`
Expected: FAIL sur les animations infinies existantes.

- [ ] **Step 3: implémenter Motion et nettoyer le CSS**

Utiliser `ScrollTrigger.batch`, `once: true`, transitions transform/opacité/clip-path seulement et view transitions désactivées en mouvement réduit.

- [ ] **Step 4: vérifier et commit**

Run: `npm run build && npm test`
Expected: PASS.

```bash
git add src/components/Motion.astro src/components/LightLine.astro src/layouts/Base.astro src/styles/global.css src/components/islands/Cursor.tsx test
git commit -m "feat: harmoniser les animations accessibles"
```

### Task 8: Tests navigateur, captures et Lighthouse

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.ts`
- Create: `test/e2e/site.spec.ts`
- Create: `scripts/capture-pages.mjs`
- Create: `scripts/measure-site.mjs`

**Interfaces:**
- Les scripts écrivent hors dépôt dans `/opt/cursor/artifacts/atomixia-refonte/`.
- Le rapport JSON contient route, largeur, mots, scores Lighthouse et métriques.

- [ ] **Step 1: installer les outils à leur dernière version**

Run: `npm install --save-dev @playwright/test@latest lighthouse@latest`
Expected: package lock mis à jour.

- [ ] **Step 2: écrire les tests E2E**

Tester menu clavier, barre mobile, formulaire, coordonnées, cibles tactiles et mouvement réduit.

- [ ] **Step 3: lancer la vérification complète**

Run: `npm run build && npm test && npx playwright test`
Expected: tous les tests passent.

- [ ] **Step 4: capturer et mesurer**

Produire les captures après et Lighthouse mobile sur les quatre URL, puis comparer aux artefacts avant.

- [ ] **Step 5: commit**

```bash
git add package.json package-lock.json playwright.config.ts test/e2e scripts
git commit -m "test: automatiser les preuves de la refonte"
```

### Task 9: Revue finale et livraison

**Files:**
- Modify: `docs/informations-manquantes.md`
- Review: all changed files

- [ ] **Step 1: retirer la ligne de prix et contrôler les TODO Hugo**

Conserver uniquement les faits réellement manquants et reprendre les cinq éléments du brief dans la PR.

- [ ] **Step 2: exécuter les preuves fraîches**

Run: `npm run build && npm test && npx playwright test`
Expected: exit 0.

Run: `git diff --check && git status --short`
Expected: aucune erreur d’espace ; uniquement les changements attendus.

- [ ] **Step 3: revue de branche**

Faire relire le diff complet par un agent indépendant, corriger toute anomalie importante, puis relancer les preuves.

- [ ] **Step 4: commit, push et PR**

```bash
git add docs/informations-manquantes.md
git commit -m "docs: actualiser les informations à fournir"
git push -u origin refonte/allegement-conversion
```

Créer une seule PR vers `master` avec résumé page par page, tableau de mots, Lighthouse avant/après, captures avant/après et section « À fournir par Hugo ».
