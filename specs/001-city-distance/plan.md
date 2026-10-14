# Implementation Plan: Distance between two cities

**Branch**: `spec-kit` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-city-distance/spec.md`

## Summary

Page web statique où l'on choisit une ville de départ et une ville d'arrivée parmi des communes
suggérées par le service d'autocomplétion de la Géoplateforme, puis qui affiche la distance à vol
d'oiseau (formule de haversine). Application Vite + TypeScript sans framework : trois modules métier
purs et testés (recherche, distance, formatage), un composant combobox accessible et un module
d'assemblage. Voir [research.md](research.md) pour les choix.

## Technical Context

**Language/Version**: TypeScript 7 (strict), ES2022, exécuté dans le navigateur

**Primary Dependencies**: Vite 8 (dev server + build) ; aucune dépendance d'exécution

**Storage**: N/A (aucun état persistant)

**Testing**: Vitest 5 (environnement Node, `fetch` injecté) ; vérification manuelle de l'interface via [quickstart.md](quickstart.md)

**Target Platform**: navigateurs récents (evergreen), hébergement statique GitHub Pages sous `/calcul-distance/`

**Project Type**: application web statique (frontend seul)

**Performance Goals**: suggestions affichées < 1 s après la fin de frappe (SC-002) ; bundle JS < 10 kB

**Constraints**: pas de backend ni de clé d'API ; chemins relatifs ; interface en français ; clavier + ARIA

**Scale/Scope**: une page, deux champs, ~400 lignes de code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Vérification | Statut |
| --- | --- | --- |
| I. Specification Before Code | spec.md validée (checklist) avant ce plan ; code écrit après tasks.md | ✅ |
| II. Static Client-Side Application | Vite build statique, `base: "./"`, pas de backend | ✅ |
| III. Open Public Data Services | Service d'autocomplétion Géoplateforme, sans clé ; erreurs affichées (FR-011) | ✅ |
| IV. Testable Domain Logic | `geoplateforme.ts`, `distance.ts` purs, `fetch` injectable, tests nommés `USn / scénario` | ✅ |
| V. Simplicity and Accessibility | aucune dépendance d'exécution ; combobox WAI-ARIA ; UI en français | ✅ |

Re-check après la phase 1 (data-model, contrats) : ✅ aucune violation, Complexity Tracking vide.

## Project Structure

### Documentation (this feature)

```text
specs/001-city-distance/
├── spec.md              # Spécification fonctionnelle (/speckit-specify)
├── checklists/
│   └── requirements.md  # Contrôle qualité de la spec
├── plan.md              # Ce fichier (/speckit-plan)
├── research.md          # Phase 0 : décisions techniques
├── data-model.md        # Phase 1 : entités
├── quickstart.md        # Phase 1 : scénarios de validation
├── contracts/
│   ├── geoplateforme-completion.md  # Contrat du service externe consommé
│   └── ui.md                        # Contrat de l'interface (DOM, ARIA, textes)
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
index.html               # structure de la page (champs, listes, résultat, erreur)
vite.config.ts           # base relative
src/
├── geoplateforme.ts     # recherche de communes (FR-002, FR-003, FR-010, FR-011)
├── distance.ts          # haversine + formatage (FR-006, FR-008)
├── autocomplete.ts      # composant combobox (FR-004, FR-005, FR-009, FR-010, FR-011)
├── main.ts              # assemblage, affichage du résultat (FR-001, FR-007)
└── style.css
tests/
├── geoplateforme.test.ts
└── distance.test.ts
```

**Structure Decision**: projet unique à la racine (option « single project »), sans découpage
`models/services` : la taille du code ne le justifie pas (principe V).

## Complexity Tracking

_Aucune violation de la constitution._
