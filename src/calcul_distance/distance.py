"""Calcul de distance orthodromique (à vol d'oiseau)."""

import math

# Rayon moyen de la Terre (IUGG), en kilomètres
RAYON_TERRE_KM = 6371.0088


def haversine(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    """Distance orthodromique en kilomètres entre deux points (degrés WGS84)."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = phi2 - phi1
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * RAYON_TERRE_KM * math.asin(math.sqrt(a))
