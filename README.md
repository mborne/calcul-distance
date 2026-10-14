# calcul-distance

Application web (Vite + TypeScript) qui calcule la distance à vol d'oiseau entre deux communes françaises.
Les noms de ville sont saisis avec le
[service d'autocomplétion de la Géoplateforme](https://geoservices.ign.fr/documentation/services/services-geoplateforme/autocompletion) (IGN).

Démo : https://mborne.github.io/calcul-distance/

> Ce projet est développé **à partir de spécifications** avec [OpenSpec](https://github.com/Fission-AI/OpenSpec) :
> le comportement attendu est décrit dans [`openspec/specs/`](openspec/specs/) avant d'écrire le code.
> Pour le faire évoluer, voir [FAIRE-EVOLUER.md](FAIRE-EVOLUER.md).

## Utilisation

```bash
npm install
npm run dev      # serveur de développement (http://localhost:5173)
npm test         # tests unitaires (vitest)
npm run build    # vérification des types + build de production dans dist/
```

## Spécifications

| Capacité | Spécification | Code | Tests |
| --- | --- | --- | --- |
| Recherche de communes | [recherche-commune](openspec/specs/recherche-commune/spec.md) | `src/geoplateforme.ts` | `tests/geoplateforme.test.ts` |
| Saisie et sélection d'une ville | [selection-ville](openspec/specs/selection-ville/spec.md) | `src/autocomplete.ts` | _(vérification manuelle)_ |
| Calcul et affichage de la distance | [calcul-distance](openspec/specs/calcul-distance/spec.md) | `src/distance.ts`, `src/main.ts` | `tests/distance.test.ts` |

Les tests reprennent le nom des scénarios des spécifications (`Scenario: ...`).

L'historique des changements (proposition, design, tâches) est conservé dans
[`openspec/changes/archive/`](openspec/changes/archive/).

## Déploiement

Le workflow `.github/workflows/pages.yml` teste et construit l'application à chaque PR,
et la publie sur GitHub Pages à chaque push sur `main`.
