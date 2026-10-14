import "./style.css";
import { attacherAutocompletion } from "./autocomplete";
import { haversine } from "./distance";
import type { Ville } from "./geoplateforme";

const villes: [Ville | null, Ville | null] = [null, null];
const resultat = document.querySelector<HTMLOutputElement>("#resultat")!;

const formatKm = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

function mettreAJour(): void {
  const [a, b] = villes;
  if (a && b) {
    resultat.innerHTML = "";
    const valeur = document.createElement("strong");
    valeur.textContent = `${formatKm.format(haversine(a, b))} km`;
    resultat.append(
      `Distance à vol d'oiseau entre ${a.nom} et ${b.nom} : `,
      valeur,
    );
  } else {
    resultat.textContent = "Sélectionnez deux villes pour calculer la distance.";
  }
}

(["depart", "arrivee"] as const).forEach((id, i) => {
  attacherAutocompletion(
    document.querySelector<HTMLInputElement>(`#${id}`)!,
    document.querySelector<HTMLUListElement>(`#${id}-suggestions`)!,
    (ville) => {
      villes[i] = ville;
      mettreAJour();
    },
  );
});

mettreAJour();
