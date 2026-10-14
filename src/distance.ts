/** Rayon moyen de la Terre en kilomètres. */
export const EARTH_RADIUS_KM = 6371.0088;

export interface LonLat {
  lon: number;
  lat: number;
}

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Distance orthodromique (à vol d'oiseau) entre deux points, en kilomètres,
 * calculée avec la formule de haversine.
 */
export function haversine(a: LonLat, b: LonLat): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}
