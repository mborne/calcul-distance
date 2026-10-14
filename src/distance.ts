/** Point en coordonnées géographiques WGS84 (degrés). */
export interface LonLat {
  lon: number;
  lat: number;
}

/** Rayon terrestre moyen (km). */
export const RAYON_TERRE_KM = 6371;

const enRadians = (degres: number): number => (degres * Math.PI) / 180;

/**
 * Distance à vol d'oiseau (km) entre deux points, par la formule de haversine.
 * Spec : calcul-distance / « Distance orthodromique ».
 */
export function haversine(a: LonLat, b: LonLat): number {
  const dLat = enRadians(b.lat - a.lat);
  const dLon = enRadians(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(enRadians(a.lat)) * Math.cos(enRadians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * RAYON_TERRE_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

const formatEntier = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const formatDecimal = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Formate une distance exprimée en km.
 * Spec : calcul-distance / « Format d'affichage ».
 */
export function formaterDistance(km: number): string {
  if (km < 1) return `${formatEntier.format(km * 1000)} m`;
  if (km < 10) return `${formatDecimal.format(km)} km`;
  return `${formatEntier.format(km)} km`;
}
