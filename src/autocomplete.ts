import { rechercherVilles, type Ville } from "./geoplateforme";

const DELAI_MS = 250;

/**
 * Branche l'autocomplétion de communes sur un champ texte.
 * `onSelect` est appelé avec la ville choisie, ou `null` si la saisie est modifiée.
 */
export function attacherAutocompletion(
  input: HTMLInputElement,
  liste: HTMLUListElement,
  onSelect: (ville: Ville | null) => void,
): void {
  let suggestions: Ville[] = [];
  let actif = -1;
  let timer: number | undefined;
  let controller: AbortController | undefined;

  const fermer = () => {
    liste.hidden = true;
    liste.replaceChildren();
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    actif = -1;
  };

  const choisir = (ville: Ville) => {
    input.value = ville.libelle;
    fermer();
    onSelect(ville);
  };

  const surligner = (index: number) => {
    const items = liste.querySelectorAll<HTMLLIElement>("li");
    items.forEach((li, i) => li.setAttribute("aria-selected", String(i === index)));
    actif = index;
    if (index >= 0) {
      input.setAttribute("aria-activedescendant", items[index].id);
      items[index].scrollIntoView({ block: "nearest" });
    }
  };

  const afficher = (villes: Ville[]) => {
    suggestions = villes;
    if (villes.length === 0) return fermer();
    liste.replaceChildren(
      ...villes.map((ville, i) => {
        const li = document.createElement("li");
        li.id = `${liste.id}-${i}`;
        li.role = "option";
        li.textContent = ville.libelle;
        // mousedown plutôt que click pour passer avant le blur du champ
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          choisir(ville);
        });
        return li;
      }),
    );
    liste.hidden = false;
    input.setAttribute("aria-expanded", "true");
    actif = -1;
  };

  input.addEventListener("input", () => {
    onSelect(null);
    window.clearTimeout(timer);
    controller?.abort();
    timer = window.setTimeout(async () => {
      controller = new AbortController();
      try {
        afficher(await rechercherVilles(input.value, { signal: controller.signal }));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
          fermer();
        }
      }
    }, DELAI_MS);
  });

  input.addEventListener("keydown", (e) => {
    if (liste.hidden) return;
    const n = suggestions.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        surligner((actif + 1) % n);
        break;
      case "ArrowUp":
        e.preventDefault();
        surligner((actif - 1 + n) % n);
        break;
      case "Enter":
        if (actif >= 0) {
          e.preventDefault();
          choisir(suggestions[actif]);
        }
        break;
      case "Escape":
        fermer();
        break;
    }
  });

  input.addEventListener("blur", fermer);
}
