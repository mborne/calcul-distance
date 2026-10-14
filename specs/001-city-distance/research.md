# Research: Distance between two cities

## Service de recherche de communes

- **Decision**: service d'autocomplétion de la Géoplateforme
  `GET https://data.geopf.fr/geocodage/completion/?text=…&type=PositionOfInterest&poiType=commune&maximumResponses=10`
  (voir [contracts/geoplateforme-completion.md](contracts/geoplateforme-completion.md)).
- **Rationale**: imposé par la demande ; public, sans clé, CORS ouvert ; renvoie nom, code postal et
  coordonnées en une requête. Vérifié le 2026-10-15 avec `text=Toulo` (Toulouse, Toulon, Toulouges…).
- **Alternatives considered**: API de géocodage `/geocodage/search` (plus lourde, orientée adresses) ;
  API Découpage administratif de geo.api.gouv.fr (hors Géoplateforme, écarté par le principe III).

## Calcul de distance

- **Decision**: formule de haversine, rayon moyen 6 371 km.
- **Rationale**: précision largement suffisante (< 0,5 %) pour un ordre de grandeur entre communes,
  quelques lignes de code, sans dépendance.
- **Alternatives considered**: formule de Vincenty / bibliothèque geodesic (précision ellipsoïdale
  inutile ici, ajoute une dépendance) ; distance routière (hors périmètre, voir Assumptions).

## Interface et accessibilité

- **Decision**: composant combobox maison suivant le motif WAI-ARIA « Combobox with listbox popup »,
  debounce 250 ms, annulation des requêtes obsolètes par `AbortController`.
- **Rationale**: ~100 lignes suffisent ; aucune dépendance (principe V) ; `AbortController` répond
  directement à FR-010.
- **Alternatives considered**: `<datalist>` (pas de contrôle de l'affichage ni de la sélection, ne
  permet pas d'associer les coordonnées) ; bibliothèque d'autocomplétion (dépendance injustifiée).

## Formatage

- **Decision**: `Intl.NumberFormat("fr-FR")` ; m < 1 km, une décimale < 10 km, entier sinon.
- **Rationale**: séparateurs français natifs (« 7,3 km », « 1 234 km ») sans bibliothèque.

## Outillage et publication

- **Decision**: Vite 8 (`base: "./"`), TypeScript 7 strict, Vitest 5 ; workflow GitHub Actions
  existant (`.github/workflows/pages.yml`) pour tester, construire et publier.
- **Rationale**: outillage standard, configuration minimale, Vitest partage la configuration Vite.
