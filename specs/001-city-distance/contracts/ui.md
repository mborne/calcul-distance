# Contract: interface utilisateur

Contrat entre `index.html`, les modules TypeScript et les tests manuels du [quickstart](../quickstart.md).

## Éléments du DOM

| Sélecteur | Élément | Attributs / rôle |
| --- | --- | --- |
| `#depart`, `#arrivee` | `<input type="text">` | `role="combobox"`, `aria-autocomplete="list"`, `aria-controls="{id}-suggestions"`, `aria-expanded`, `aria-activedescendant` ; libellés « Ville de départ » / « Ville d'arrivée » |
| `#depart-suggestions`, `#arrivee-suggestions` | `<ul>` | `role="listbox"`, `hidden` quand fermée |
| `#{liste}-{i}` | `<li>` | `role="option"`, `aria-selected="true"` pour l'option active ; texte = `libelle` |
| `#resultat` | `<output>` | `aria-live="polite"` ; vide ou texte du résultat |
| `#erreur` | `<p>` | `role="alert"` ; vide ou message d'erreur |

## Clavier (liste ouverte)

| Touche | Effet |
| --- | --- |
| ↓ / ↑ | option suivante / précédente, en boucle |
| Entrée | sélectionne l'option active |
| Échap | ferme la liste, sélection inchangée |

## Textes affichés

| Situation | Texte |
| --- | --- |
| Résultat | `{départ} → {arrivée} : {distance} à vol d'oiseau` |
| Distance < 1 km | `432 m` |
| Distance < 10 km | `7,3 km` |
| Distance ≥ 10 km | `660 km`, `1 234 km` |
| Échec de recherche | `La recherche de communes a échoué. Erreur du service d'autocomplétion (HTTP 500)` |
