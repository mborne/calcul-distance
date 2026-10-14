"""Géocodage des communes via le service de la Géoplateforme (IGN)."""

import json
import urllib.parse
import urllib.request
from dataclasses import dataclass

URL_GEOCODAGE = "https://data.geopf.fr/geocodage/search"


class VilleIntrouvable(Exception):
    """Aucune commune ne correspond à la recherche."""


@dataclass(frozen=True)
class Ville:
    nom: str
    code_insee: str
    contexte: str
    lon: float
    lat: float

    def __str__(self) -> str:
        return f"{self.nom} ({self.contexte})"


def _requete(params: dict, timeout: float) -> dict:
    url = f"{URL_GEOCODAGE}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=timeout) as reponse:
        return json.load(reponse)


def geocoder(nom: str, timeout: float = 10.0) -> Ville:
    """Retourne la commune la plus pertinente correspondant à ``nom``."""
    if not nom.strip():
        raise VilleIntrouvable("nom de ville vide")
    resultat = _requete(
        {"q": nom, "index": "address", "type": "municipality", "limit": 1},
        timeout,
    )
    features = resultat.get("features", [])
    if not features:
        raise VilleIntrouvable(f"aucune commune trouvée pour '{nom}'")
    feature = features[0]
    props = feature["properties"]
    lon, lat = feature["geometry"]["coordinates"]
    return Ville(
        nom=props["name"],
        code_insee=props["citycode"],
        contexte=props.get("context", ""),
        lon=lon,
        lat=lat,
    )
