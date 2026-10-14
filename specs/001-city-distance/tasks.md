---

description: "Task list for feature 001-city-distance"
---

# Tasks: Distance between two cities

**Input**: Design documents from `/specs/001-city-distance/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: tests unitaires exigés par la constitution (principe IV) pour la logique métier ; nommés
`USn - <scénario>`. L'interface est validée manuellement via [quickstart.md](quickstart.md).

**Organization**: tâches groupées par user story, chacune livrable et testable indépendamment.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, pas de dépendance)
- **[Story]** : user story concernée (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: initialisation du projet

- [x] T001 Créer `package.json` (scripts `dev`, `build`, `preview`, `test` ; devDependencies `typescript`, `vite`, `vitest`) puis `npm install`
- [x] T002 [P] Créer `tsconfig.json` (strict, ES2022, DOM, `noEmit`, inclut `src`, `tests`, `vite.config.ts`)
- [x] T003 [P] Créer `vite.config.ts` avec `base: "./"` (principe II)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: page et types partagés par toutes les stories

- [x] T004 Créer `index.html` conforme à [contracts/ui.md](contracts/ui.md) : `#depart`, `#arrivee`, listes `#…-suggestions`, `#resultat` (`aria-live="polite"`), `#erreur` (`role="alert"`), mention de la Géoplateforme
- [x] T005 [P] Créer `src/style.css` (mise en page, liste de suggestions, focus visible, mode sombre)
- [x] T006 [P] Définir `LonLat` dans `src/distance.ts` et `Commune` dans `src/geoplateforme.ts` selon [data-model.md](data-model.md) (`nom` ← `names[0]` à défaut `fulltext`, `libelle` ← `fulltext`, `codePostal` ← `zipcode` optionnel, `lon` ← `x`, `lat` ← `y`)

**Checkpoint**: `npm run build` passe, la page s'affiche avec `npm run dev`

---

## Phase 3: User Story 1 - Get the distance between two cities (Priority: P1) 🎯 MVP

**Goal**: choisir deux communes à la souris et lire la distance

**Independent Test**: quickstart, scénarios 1 à 4

### Tests for User Story 1

- [x] T007 [P] [US1] Tests de `haversine` dans `tests/distance.test.ts` : points identiques = 0, Paris (2.3522, 48.8566)–Marseille (5.3698, 43.2965) à 1 km de 660, symétrie (FR-006, SC-003)
- [x] T008 [P] [US1] Tests de `formaterDistance` dans `tests/distance.test.ts` : « 432 m », « 7,3 km », « 660 km », « 1 234 km » (FR-008)
- [x] T009 [P] [US1] Tests de `rechercherCommunes` dans `tests/geoplateforme.test.ts` avec `fetch` simulé : paramètres `text`, `type=PositionOfInterest`, `poiType=commune`, `maximumResponses=10`, mapping vers `Commune`, réponse vide, texte < 3 caractères sans requête, espaces retirés (FR-002, FR-003)

### Implementation for User Story 1

- [x] T010 [P] [US1] Implémenter `haversine` (rayon 6 371 km) et `formaterDistance` (`Intl.NumberFormat("fr-FR")`) dans `src/distance.ts`
- [x] T011 [P] [US1] Implémenter `rechercherCommunes(texte, { max, signal, fetchFn })` dans `src/geoplateforme.ts` selon [contracts/geoplateforme-completion.md](contracts/geoplateforme-completion.md)
- [x] T012 [US1] Implémenter `creerCombobox` dans `src/autocomplete.ts` : debounce 250 ms, affichage des suggestions (`libelle`), sélection au clic (`mousedown`), fermeture au blur, callback `onSelect`
- [x] T013 [US1] Assembler la page dans `src/main.ts` : deux combobox, résultat « {départ} → {arrivée} : {distance} à vol d'oiseau » dès que les deux villes sont choisies, vide sinon (FR-001, FR-007)

**Checkpoint**: `npm test` passe ; quickstart scénarios 1 à 4 OK

---

## Phase 4: User Story 2 - Keyboard and screen reader (Priority: P2)

**Goal**: même parcours au clavier seul, avec annonces aux lecteurs d'écran

**Independent Test**: quickstart, scénarios 5 à 7

### Implementation for User Story 2

- [x] T014 [US2] Ajouter la navigation clavier dans `src/autocomplete.ts` : ↓/↑ en boucle, Entrée, Échap (FR-004)
- [x] T015 [US2] Maintenir `aria-expanded`, `aria-activedescendant`, `role="option"` et `aria-selected` dans `src/autocomplete.ts` ; option active visible (`scrollIntoView`) (FR-005)

**Checkpoint**: quickstart scénarios 5 à 7 OK

---

## Phase 5: User Story 3 - Recover from mistakes and service problems (Priority: P3)

**Goal**: jamais de distance trompeuse, erreurs expliquées

**Independent Test**: quickstart, scénarios 8 et 9

### Tests for User Story 3

- [x] T016 [P] [US3] Tests dans `tests/geoplateforme.test.ts` : HTTP 500 → erreur contenant « 500 » ; le `signal` est transmis à `fetch` (FR-010, FR-011)

### Implementation for User Story 3

- [x] T017 [US3] Dans `src/geoplateforme.ts`, lever `Erreur du service d'autocomplétion (HTTP {status})` si la réponse n'est pas OK
- [x] T018 [US3] Dans `src/autocomplete.ts` : `onSelect(null)` à chaque modification du texte (FR-009) ; annuler la recherche précédente par `AbortController` et ignorer les réponses annulées (FR-010) ; callback `onErreur` (FR-011)
- [x] T019 [US3] Dans `src/main.ts`, afficher/effacer le message d'erreur dans `#erreur`

**Checkpoint**: toutes les stories fonctionnent ; quickstart scénarios 8 à 10 OK

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T020 [P] Rédiger `README.md` (présentation, commandes, lien vers `specs/` et `CODING.md`)
- [x] T021 [P] Rédiger `CODING.md` : comment faire évoluer le projet avec Spec Kit, comparaison avec OpenSpec
- [x] T022 Vérifier `npm test`, `npm run build` et l'intégralité de [quickstart.md](quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (1) → Foundational (2) → US1 (3) → US2 (4) et US3 (5) → Polish (6)

### User Story Dependencies

- **US1** : dépend uniquement de la phase 2 — c'est le MVP
- **US2** : enrichit le composant de US1 (`src/autocomplete.ts`)
- **US3** : enrichit `src/geoplateforme.ts`, `src/autocomplete.ts` et `src/main.ts` de US1 ; indépendante de US2

### Parallel Opportunities

- T002/T003, T005/T006, T007/T008/T009, T010/T011, T020/T021
- US2 et US3 touchent toutes deux `src/autocomplete.ts` : à faire séquentiellement dans ce fichier

## Implementation Strategy

1. Phases 1 et 2, puis US1 → **MVP démontrable** (souris uniquement)
2. US2 → accessibilité complète
3. US3 → robustesse
4. Polish et validation du quickstart
