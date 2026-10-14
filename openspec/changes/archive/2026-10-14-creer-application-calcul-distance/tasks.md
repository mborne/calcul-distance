# Tasks

## 1. Initialisation du projet

- [x] 1.1 Créer `package.json` (scripts `dev`, `build`, `preview`, `test`, `openspec`), `tsconfig.json` (strict) et `vite.config.ts` (`base: "./"`) ; vérifier que `npm install` réussit
- [x] 1.2 Créer `index.html` (titre, deux champs combobox, `<output>` du résultat, mention de la Géoplateforme) et `src/style.css` ; vérifier que `npm run dev` sert la page

## 2. Calcul de distance (`calcul-distance`)

- [x] 2.1 Implémenter `haversine` dans `src/distance.ts` ; vérifier avec `tests/distance.test.ts` (points identiques, Paris–Marseille ≈ 660 km, symétrie)
- [x] 2.2 Implémenter `formaterDistance` (m, km à une décimale, km entiers) ; vérifier les scénarios « 432 m », « 7,3 km », « 660 km » dans les tests

## 3. Recherche de communes (`recherche-commune`)

- [x] 3.1 Implémenter `rechercherCommunes` dans `src/geoplateforme.ts` (paramètres de requête, mapping de la réponse, limite par défaut de 10, signal d'annulation) ; vérifier avec `tests/geoplateforme.test.ts` utilisant un `fetch` simulé
- [x] 3.2 Couvrir par des tests le texte trop court (aucune requête), le texte avec espaces, la réponse vide et l'erreur HTTP 500

## 4. Sélection de ville et assemblage (`selection-ville`)

- [x] 4.1 Implémenter le composant combobox `src/autocomplete.ts` (debounce 250 ms, annulation, souris, clavier, ARIA, oubli de la sélection à la modification, message d'erreur)
- [x] 4.2 Assembler la page dans `src/main.ts` : afficher « Départ → Arrivée : distance à vol d'oiseau » quand les deux villes sont retenues, vider le résultat sinon ; vérifier manuellement avec `npm run dev` (Paris → Marseille affiche environ 660 km)
- [x] 4.3 Rédiger le `README.md` (présentation, commandes, structure, lien vers la méthode OpenSpec) ; vérifier que les commandes documentées fonctionnent

## 5. Vérification d'ensemble

- [x] 5.1 Vérifier que `npm test` et `npm run build` passent et que `npx openspec validate --all --strict` ne signale aucune erreur

## Workflow follow-up

- Archiver le changement (`openspec archive creer-application-calcul-distance`) pour verser les specs dans `openspec/specs/`.
