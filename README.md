# calcul-distance

> Prompt : Génère une application web de calcul de distance entre deux villes. Travaille avec vite / TypeScript. Utilise le service d'autocomplétion de la géoplateforme saisir le nom de ville

Application web (Vite + TypeScript) qui calcule la distance à vol d'oiseau entre deux villes.

La saisie des noms de ville s'appuie sur le
[service d'autocomplétion de la Géoplateforme](https://geoservices.ign.fr/documentation/services/services-geoplateforme/autocompletion)
(`https://data.geopf.fr/geocodage/completion/`, filtré sur les communes).
La distance est calculée avec la formule de haversine.

## Utilisation

```bash
npm install
npm run dev      # serveur de développement (http://localhost:5173)
npm test         # tests unitaires (vitest)
npm run build    # vérification des types + build de production dans dist/
```

## Structure

- `src/geoplateforme.ts` : appel au service d'autocomplétion
- `src/autocomplete.ts` : liste de suggestions (clavier, souris, accessibilité)
- `src/distance.ts` : formule de haversine
- `src/main.ts` : assemblage de la page
