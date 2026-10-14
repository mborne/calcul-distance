# Contract: service d'autocomplétion de la Géoplateforme (consommé)

Documentation : https://geoservices.ign.fr/documentation/services/services-geoplateforme/autocompletion

## Requête

```http
GET https://data.geopf.fr/geocodage/completion/?text={texte}&type=PositionOfInterest&poiType=commune&maximumResponses={max}
```

| Paramètre | Valeur | Exigence |
| --- | --- | --- |
| `text` | texte saisi, sans espaces de début/fin, ≥ 3 caractères | FR-002 |
| `type` | `PositionOfInterest` | communes uniquement |
| `poiType` | `commune` | communes uniquement |
| `maximumResponses` | `10` par défaut | FR-003 |

Aucune requête n'est envoyée si le texte nettoyé fait moins de 3 caractères.
La requête porte un `AbortSignal` pour être annulée par une saisie plus récente (FR-010).

## Réponse 200 (extrait utile)

```json
{
  "status": "OK",
  "results": [
    {
      "x": 1.437253,
      "y": 43.607757,
      "names": ["Toulouse"],
      "zipcode": "31000",
      "fulltext": "Toulouse, 31000"
    }
  ]
}
```

`results` peut être absent ou vide → liste vide. Les autres champs sont ignorés.
Correspondance vers `Commune` : voir [data-model.md](../data-model.md).

## Erreurs

Statut HTTP ≠ 2xx → erreur `Erreur du service d'autocomplétion (HTTP {status})`, affichée à
l'utilisateur précédée de « La recherche de communes a échoué. » (FR-011).
Erreur réseau → même message d'échec. Une annulation (`AbortError`) n'est jamais affichée.
