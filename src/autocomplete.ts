import type { Commune } from "./geoplateforme";

/** Délai d'attente après la dernière frappe avant de lancer la recherche (ms). */
export const DELAI_SAISIE_MS = 250;

export interface OptionsCombobox {
  input: HTMLInputElement;
  liste: HTMLUListElement;
  rechercher: (texte: string, signal: AbortSignal) => Promise<Commune[]>;
  /** Appelé avec la commune retenue, ou `null` quand la sélection est oubliée. */
  onSelect: (commune: Commune | null) => void;
  onErreur: (message: string | null) => void;
}

/**
 * Champ de saisie avec suggestions de communes (motif ARIA « combobox »).
 * Spec : city-selection.
 */
export function creerCombobox({ input, liste, rechercher, onSelect, onErreur }: OptionsCombobox): void {
  let suggestions: Commune[] = [];
  let active = -1;
  let minuterie: ReturnType<typeof setTimeout> | undefined;
  let controleur: AbortController | undefined;

  const idOption = (i: number) => `${liste.id}-${i}`;

  function fermer(): void {
    liste.hidden = true;
    liste.replaceChildren();
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  }

  function afficher(communes: Commune[]): void {
    suggestions = communes;
    active = -1;
    if (communes.length === 0) {
      fermer();
      return;
    }
    liste.replaceChildren(
      ...communes.map((commune, i) => {
        const li = document.createElement("li");
        li.id = idOption(i);
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", "false");
        li.textContent = commune.libelle;
        // mousedown plutôt que click : se déclenche avant la perte de focus du champ.
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          choisir(i);
        });
        return li;
      }),
    );
    liste.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function activer(i: number): void {
    const options = liste.querySelectorAll("li");
    options.forEach((li, j) => li.setAttribute("aria-selected", String(j === i)));
    active = i;
    input.setAttribute("aria-activedescendant", idOption(i));
    options[i]?.scrollIntoView({ block: "nearest" });
  }

  function choisir(i: number): void {
    const commune = suggestions[i];
    if (!commune) return;
    input.value = commune.libelle;
    fermer();
    onSelect(commune);
  }

  input.addEventListener("input", () => {
    onSelect(null);
    clearTimeout(minuterie);
    controleur?.abort();
    minuterie = setTimeout(async () => {
      controleur = new AbortController();
      const { signal } = controleur;
      try {
        const communes = await rechercher(input.value, signal);
        if (signal.aborted) return;
        onErreur(null);
        afficher(communes);
      } catch (e) {
        if (signal.aborted) return;
        fermer();
        onErreur(`La recherche de communes a échoué. ${e instanceof Error ? e.message : ""}`.trim());
      }
    }, DELAI_SAISIE_MS);
  });

  input.addEventListener("keydown", (e) => {
    if (liste.hidden) return;
    const n = suggestions.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        activer((active + 1) % n);
        break;
      case "ArrowUp":
        e.preventDefault();
        activer((active - 1 + n) % n);
        break;
      case "Enter":
        if (active >= 0) {
          e.preventDefault();
          choisir(active);
        }
        break;
      case "Escape":
        fermer();
        break;
    }
  });

  input.addEventListener("blur", fermer);
}
