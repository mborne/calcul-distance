"""Interface en ligne de commande."""

import argparse
import json
import sys
import urllib.error

from calcul_distance.distance import haversine
from calcul_distance.geocodage import VilleIntrouvable, geocoder


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="calcul-distance",
        description="Calcule la distance à vol d'oiseau entre deux villes françaises.",
    )
    parser.add_argument("depart", help="ville de départ (ex. 'Paris')")
    parser.add_argument("arrivee", help="ville d'arrivée (ex. 'Lyon')")
    parser.add_argument("--json", action="store_true", help="sortie au format JSON")
    args = parser.parse_args(argv)

    try:
        depart = geocoder(args.depart)
        arrivee = geocoder(args.arrivee)
    except VilleIntrouvable as e:
        print(f"Erreur : {e}", file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError) as e:
        print(f"Erreur d'accès au service de géocodage : {e}", file=sys.stderr)
        return 2

    distance_km = haversine(depart.lon, depart.lat, arrivee.lon, arrivee.lat)

    if args.json:
        print(json.dumps(
            {
                "depart": vars(depart),
                "arrivee": vars(arrivee),
                "distance_km": round(distance_km, 3),
            },
            ensure_ascii=False,
            indent=2,
        ))
    else:
        print(f"Départ  : {depart}")
        print(f"Arrivée : {arrivee}")
        print(f"Distance à vol d'oiseau : {distance_km:.1f} km")
    return 0


if __name__ == "__main__":
    sys.exit(main())
