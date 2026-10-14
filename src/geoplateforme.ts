import type { LonLat } from "./distance";

/** Service d'autocomplétion de la Géoplateforme (IGN). */
export const COMPLETION_URL = "https://data.geopf.fr/geocodage/completion/";

/** Nombre minimal de caractères avant d'interroger le service. */
export const LONGUEUR_MIN = 3;

/** Nombre maximal de résultats demandés par défaut. */
export const MAX_RESULTATS = 10;

export interface Commune extends LonLat {
  nom: string;
  libelle: string;
  codePostal?: string;
}

interface ResultatCompletion {
  x: number;
  y: number;
  names?: string[];
  fulltext: string;
  zipcode?: string;
}

interface ReponseCompletion {
  status: string;
  results?: ResultatCompletion[];
}

export interface OptionsRecherche {
  max?: number;
  signal?: AbortSignal;
  /** Permet de remplacer `fetch` (tests). */
  fetchFn?: typeof fetch;
}

/**
 * Recherche les communes correspondant au début de nom `texte`.
 * specs/001-city-distance : FR-002, FR-003, FR-010, FR-011 ;
 * contrat : contracts/geoplateforme-completion.md.
 */
export async function rechercherCommunes(
  texte: string,
  options: OptionsRecherche = {},
): Promise<Commune[]> {
  const q = texte.trim();
  if (q.length < LONGUEUR_MIN) return [];

  const params = new URLSearchParams({
    text: q,
    type: "PositionOfInterest",
    poiType: "commune",
    maximumResponses: String(options.max ?? MAX_RESULTATS),
  });
  const fetchFn = options.fetchFn ?? fetch;
  const reponse = await fetchFn(`${COMPLETION_URL}?${params}`, { signal: options.signal });
  if (!reponse.ok) {
    throw new Error(`Erreur du service d'autocomplétion (HTTP ${reponse.status})`);
  }
  const donnees = (await reponse.json()) as ReponseCompletion;
  return (donnees.results ?? []).map((r) => ({
    nom: r.names?.[0] ?? r.fulltext,
    libelle: r.fulltext,
    codePostal: r.zipcode,
    lon: r.x,
    lat: r.y,
  }));
}
