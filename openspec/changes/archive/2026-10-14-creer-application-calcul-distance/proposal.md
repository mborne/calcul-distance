# Proposal

## Why

On souhaite pouvoir connaître rapidement la distance entre deux villes françaises, sans installer de logiciel ni connaître leurs coordonnées. Le projet repart de zéro pour illustrer une démarche pilotée par les spécifications (OpenSpec) : le comportement attendu est décrit avant d'écrire le code.

## What Changes

- Création d'une application web monopage où l'utilisateur saisit une ville de départ et une ville d'arrivée.
- Autocomplétion des noms de communes grâce au service d'autocomplétion de la Géoplateforme (IGN).
- Calcul et affichage de la distance à vol d'oiseau entre les deux communes sélectionnées.
- Publication automatique de l'application sur GitHub Pages.

## Capabilities

### New Capabilities

- `recherche-commune` : recherche de communes françaises à partir d'un début de nom, via le service d'autocomplétion de la Géoplateforme (requête, résultats, erreurs).
- `selection-ville` : champ de saisie avec liste de suggestions permettant de choisir une commune à la souris ou au clavier, de façon accessible.
- `calcul-distance` : calcul de la distance orthodromique entre deux points et affichage du résultat à l'utilisateur.

### Modified Capabilities

_Aucune (projet initial)._

## Impact

- Nouveau projet Vite + TypeScript : `index.html`, `src/`, `tests/`, `package.json`.
- Dépendance externe à l'exécution : `https://data.geopf.fr/geocodage/completion/` (service public, sans clé).
- Workflow GitHub Actions existant (`.github/workflows/pages.yml`) réutilisé pour tester, construire et publier.
