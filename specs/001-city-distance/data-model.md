# Data Model: Distance between two cities

Aucune donnée n'est stockée ; les entités ci-dessous n'existent qu'en mémoire dans la page.

## LonLat

Point géographique WGS84 en degrés décimaux.

| Champ | Type | Règle |
| --- | --- | --- |
| `lon` | number | longitude, -180..180 |
| `lat` | number | latitude, -90..90 |

## Commune (spec : Municipality)

Commune proposée par la recherche. Étend `LonLat`.

| Champ | Type | Source (réponse du service) | Règle |
| --- | --- | --- | --- |
| `nom` | string | `names[0]`, à défaut `fulltext` | non vide ; utilisé dans le résultat |
| `libelle` | string | `fulltext` | non vide ; affiché dans les suggestions et le champ |
| `codePostal` | string \| undefined | `zipcode` | optionnel |
| `lon` | number | `x` | |
| `lat` | number | `y` | |

## Sélection (spec : Selection)

État de chaque champ : `{ depart: Commune | null, arrivee: Commune | null }`.

Transitions :

```text
null ──(clic / Entrée sur une suggestion)──► Commune
Commune ──(modification du texte du champ, FR-009)──► null
Commune ──(Échap, perte de focus)──► Commune (inchangée)
```

## Résultat de distance (spec : Distance result)

Dérivé, recalculé à chaque changement de sélection :

- les deux sélections non nulles → `haversine(depart, arrivee)` en km, formaté (FR-008) :
  `"{depart.nom} → {arrivee.nom} : {distance formatée} à vol d'oiseau"` ;
- sinon → texte vide (FR-007).
