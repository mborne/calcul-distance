# Quickstart: Distance between two cities

Guide de validation de bout en bout de la fonctionnalité.

## Prérequis

- Node.js 24 et npm
- Accès à `https://data.geopf.fr`

## Lancer

```bash
npm install
npm test          # tests unitaires : doivent tous passer
npm run build     # vérification des types + build dans dist/
npm run dev       # http://localhost:5173
```

## Scénarios de validation manuelle

| # | Story | Action | Résultat attendu |
| --- | --- | --- | --- |
| 1 | US1 | Ouvrir la page | Deux champs vides, aucun résultat |
| 2 | US1 | Taper « Toulo » dans « Ville de départ » | Suggestions dont « Toulouse, 31000 » et « Toulon, 83000 » |
| 3 | US1 | Cliquer « Toulouse, 31000 » | Le champ affiche « Toulouse, 31000 », la liste se ferme, aucun résultat |
| 4 | US1 | Choisir « Marseille » en arrivée | « Toulouse → Marseille : 319 km à vol d'oiseau » (± 1 km) |
| 5 | US2 | Dans un champ, taper « Paris », ↓ puis Entrée | « Paris » est sélectionnée |
| 6 | US2 | Liste ouverte, ↑ depuis la première option | La dernière option devient active |
| 7 | US2 | Liste ouverte, Échap | Liste fermée, sélection inchangée |
| 8 | US3 | Avec deux villes choisies, ajouter une lettre dans un champ | Le résultat disparaît |
| 9 | US3 | Couper le réseau (DevTools → Offline) puis taper « Lyon » | Message « La recherche de communes a échoué… » |
| 10 | Edge | Choisir la même ville deux fois | « … : 0 m à vol d'oiseau » |

Les contrats détaillés sont dans [contracts/](contracts/), les entités dans [data-model.md](data-model.md).
