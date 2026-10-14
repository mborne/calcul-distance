# Design

## Context

Projet vide (voir proposal.md). Contraintes : site statique publié sur GitHub Pages sous un sous-chemin (`/calcul-distance/`), pas de backend, service d'autocomplétion de la Géoplateforme appelé directement depuis le navigateur (CORS ouvert, pas de clé).

## Goals / Non-Goals

**Goals:**
- Une base de code minimale, lisible et testable, servant d'exemple de développement piloté par les spécifications.
- Logique métier (recherche, calcul, formatage) testable sans navigateur ni réseau.

**Non-Goals:**
- Distance routière ou temps de trajet (seule la distance à vol d'oiseau est couverte).
- Affichage cartographique.
- Tests de bout en bout dans un navigateur.

## Decisions

- **Vite + TypeScript sans framework UI** : la page ne compte que deux champs et un résultat ; un framework (React, Vue) alourdirait l'exemple sans bénéfice. Vite fournit le serveur de dev et le build statique.
- **Découpage en modules** (un par capacité, plus l'assemblage) :
  - `src/geoplateforme.ts` → `city-search` : `rechercherCommunes(texte, { max, signal, fetchFn })`. La fonction `fetch` est injectable pour les tests ; l'`AbortSignal` sert à annuler les requêtes obsolètes.
  - `src/autocomplete.ts` → `city-selection` : composant combobox branché sur un `<input>` et un `<ul>` existants dans `index.html` ; il reçoit une fonction de recherche et un callback `onSelect(commune | null)`.
  - `src/distance.ts` → `distance-calculation` : `haversine(a, b)` et `formaterDistance(km)` (fonctions pures, `Intl.NumberFormat("fr-FR")`).
  - `src/main.ts` : assemble les deux combobox et met à jour le résultat (`<output aria-live="polite">`).
- **Paramètres du service** : `text`, `type=PositionOfInterest`, `poiType=commune`, `maximumResponses`. Les champs utilisés dans la réponse sont `names[0]`, `fulltext`, `zipcode`, `x` (longitude), `y` (latitude).
- **Debounce de 250 ms** dans le composant plutôt que dans le module de recherche, pour garder ce dernier synchrone vis-à-vis de l'appelant et simple à tester.
- **Chemins relatifs** (`base: "./"` dans Vite) : le build fonctionne à la racine comme sous `/calcul-distance/`.
- **Vitest** : même configuration que Vite, exécution en environnement Node (pas de DOM nécessaire pour les modules testés).
- **Publication** : le workflow `.github/workflows/pages.yml` déjà présent exécute `npm ci`, `npm test`, `npm run build` puis déploie `dist/`. Il est conservé tel quel.

## Risks / Trade-offs

- [Le service de la Géoplateforme change de format ou devient indisponible] → erreurs remontées explicitement à l'utilisateur ; le mapping de la réponse est isolé dans `geoplateforme.ts` et couvert par des tests.
- [Le composant combobox n'est pas testé automatiquement] → il reste petit et sans logique métier ; vérification manuelle avec `npm run dev`. Des tests DOM (jsdom) pourront être ajoutés par un changement ultérieur.
- [Homonymes de communes] → le libellé complet (avec code postal) est affiché dans les suggestions et dans le champ après sélection.
