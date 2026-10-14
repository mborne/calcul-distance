# calcul-distance

Calcule la distance à vol d'oiseau (orthodromique) entre deux villes françaises.

Les communes sont géocodées avec le [service de géocodage de la Géoplateforme](https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage) (IGN), puis la distance est calculée avec la formule de haversine (sphère de rayon moyen 6371,0088 km).

Aucune dépendance hors bibliothèque standard Python (≥ 3.10).

## Utilisation

```bash
uv run calcul-distance Paris Lyon
# Départ  : Paris (75, Paris, Île-de-France)
# Arrivée : Lyon (69, Rhône, Auvergne-Rhône-Alpes)
# Distance à vol d'oiseau : 392.5 km

uv run calcul-distance "Saint-Mandé" Marseille --json
```

Depuis Python :

```python
from calcul_distance import geocoder, haversine

a, b = geocoder("Brest"), geocoder("Strasbourg")
print(haversine(a.lon, a.lat, b.lon, b.lat))
```

## Tests

```bash
uv run pytest
```

Les tests n'appellent pas le service de géocodage (réponses simulées).

## Limites

- Distance à vol d'oiseau, pas d'itinéraire routier.
- Modèle sphérique : écart de l'ordre de 0,5 % au plus par rapport à un calcul ellipsoïdal.
- En cas d'homonymie, la commune la mieux classée par le géocodeur est retenue (le contexte affiché permet de vérifier).
