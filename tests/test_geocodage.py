import json

import pytest

from calcul_distance import cli, geocodage
from calcul_distance.geocodage import Ville, VilleIntrouvable, geocoder

COMMUNES = {
    "Paris": ("Paris", "75056", "75, Paris, Île-de-France", 2.347, 48.859),
    "Lyon": ("Lyon", "69123", "69, Rhône, Auvergne-Rhône-Alpes", 4.835, 45.758),
}


def faux_service(params, timeout):
    commune = COMMUNES.get(params["q"])
    if commune is None:
        return {"type": "FeatureCollection", "features": []}
    nom, insee, contexte, lon, lat = commune
    return {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": {"name": nom, "citycode": insee, "context": contexte},
        }],
    }


@pytest.fixture(autouse=True)
def sans_reseau(monkeypatch):
    monkeypatch.setattr(geocodage, "_requete", faux_service)


def test_geocoder():
    ville = geocoder("Paris")
    assert ville == Ville("Paris", "75056", "75, Paris, Île-de-France", 2.347, 48.859)


def test_geocoder_introuvable():
    with pytest.raises(VilleIntrouvable):
        geocoder("Xyzzy")


def test_geocoder_vide():
    with pytest.raises(VilleIntrouvable):
        geocoder("  ")


def test_cli_texte(capsys):
    assert cli.main(["Paris", "Lyon"]) == 0
    sortie = capsys.readouterr().out
    assert "Paris" in sortie and "Lyon" in sortie and "km" in sortie


def test_cli_json(capsys):
    assert cli.main(["Paris", "Lyon", "--json"]) == 0
    resultat = json.loads(capsys.readouterr().out)
    assert resultat["depart"]["code_insee"] == "75056"
    assert resultat["distance_km"] == pytest.approx(391, abs=3)


def test_cli_introuvable(capsys):
    assert cli.main(["Paris", "Xyzzy"]) == 1
    assert "Xyzzy" in capsys.readouterr().err
