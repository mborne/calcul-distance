import type { LonLat } from "./distance";

/** Service d'autocomplétion de la Géoplateforme (IGN). */
export const COMPLETION_URL = "https://data.geopf.fr/geocodage/completion/";

export interface Ville extends LonLat {
  nom: string;
  libelle: string;
  codePostal?: string;
}

interface CompletionResult {
  x: number;
  y: number;
  names?: string[];
  fulltext: string;
  zipcode?: string;
}

interface CompletionResponse {
  status: string;
  results?: CompletionResult[];
}

/**
 * Recherche les communes dont le nom commence par `texte`
 * via le service d'autocomplétion de la Géoplateforme.
 */
export async function rechercherVilles(
  texte: string,
  options: { max?: number; signal?: AbortSignal; fetchFn?: typeof fetch } = {},
): Promise<Ville[]> {
  const q = texte.trim();
  if (q.length < 3) return [];

  const params = new URLSearchParams({
    text: q,
    type: "PositionOfInterest",
    poiType: "commune",
    maximumResponses: String(options.max ?? 10),
  });
  const fetchFn = options.fetchFn ?? fetch;
  const response = await fetchFn(`${COMPLETION_URL}?${params}`, {
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(`Erreur du service d'autocomplétion (HTTP ${response.status})`);
  }
  const data = (await response.json()) as CompletionResponse;
  return (data.results ?? []).map((r) => ({
    nom: r.names?.[0] ?? r.fulltext,
    libelle: r.fulltext,
    codePostal: r.zipcode,
    lon: r.x,
    lat: r.y,
  }));
}
