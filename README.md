# calcul-distance

Application web (Vite + TypeScript) qui calcule la distance à vol d'oiseau entre deux communes françaises.
Les noms de ville sont saisis avec le
[service d'autocomplétion de la Géoplateforme](https://geoservices.ign.fr/documentation/services/services-geoplateforme/autocompletion) (IGN).

Démo : https://mborne.github.io/calcul-distance/

> Sur cette branche, le projet est développé **à partir de spécifications** avec
> [Spec Kit](https://github.com/github/spec-kit) : une [constitution](.specify/memory/constitution.md)
> fixe les principes du projet, puis chaque fonctionnalité est décrite dans [`specs/`](specs/)
> avant d'écrire le code. Pour le faire évoluer, voir [CODING.md](CODING.md).

## Utilisation

```bash
npm install
npm run dev      # serveur de développement (http://localhost:5173)
npm test         # tests unitaires (vitest)
npm run build    # vérification des types + build de production dans dist/
```

## Spécifications

| Fonctionnalité | Documents |
| --- | --- |
| [001-city-distance](specs/001-city-distance/) | [spec](specs/001-city-distance/spec.md) · [plan](specs/001-city-distance/plan.md) · [tâches](specs/001-city-distance/tasks.md) · [quickstart](specs/001-city-distance/quickstart.md) |

Les tests sont nommés d'après les user stories (`US1`, `US3`) et les exigences (`FR-006`…) de la spec ;
les commentaires du code renvoient aux mêmes identifiants.

## Structure

- `src/geoplateforme.ts` : appel au service d'autocomplétion
- `src/autocomplete.ts` : liste de suggestions (clavier, souris, accessibilité)
- `src/distance.ts` : formule de haversine et formatage
- `src/main.ts` : assemblage de la page

## Déploiement

Le workflow `.github/workflows/pages.yml` teste et construit l'application à chaque PR,
et la publie sur GitHub Pages à chaque push sur `main`.
