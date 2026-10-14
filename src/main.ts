import "./style.css";
import { creerCombobox } from "./autocomplete";
import { formaterDistance, haversine } from "./distance";
import { rechercherCommunes, type Commune } from "./geoplateforme";

const resultat = document.querySelector<HTMLOutputElement>("#resultat")!;
const erreur = document.querySelector<HTMLParagraphElement>("#erreur")!;

const selection: { depart: Commune | null; arrivee: Commune | null } = {
  depart: null,
  arrivee: null,
};

/** Spec : calcul-distance / « Calcul automatique » et « Format d'affichage ». */
function mettreAJour(): void {
  const { depart, arrivee } = selection;
  resultat.textContent =
    depart && arrivee
      ? `${depart.nom} → ${arrivee.nom} : ${formaterDistance(haversine(depart, arrivee))} à vol d'oiseau`
      : "";
}

for (const champ of ["depart", "arrivee"] as const) {
  creerCombobox({
    input: document.querySelector<HTMLInputElement>(`#${champ}`)!,
    liste: document.querySelector<HTMLUListElement>(`#${champ}-suggestions`)!,
    rechercher: (texte, signal) => rechercherCommunes(texte, { signal }),
    onSelect: (commune) => {
      selection[champ] = commune;
      mettreAJour();
    },
    onErreur: (message) => {
      erreur.textContent = message ?? "";
    },
  });
}
