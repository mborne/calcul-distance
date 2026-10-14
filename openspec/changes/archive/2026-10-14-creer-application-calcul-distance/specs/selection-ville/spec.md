# Spec Delta

## Purpose

Permet à l'utilisateur de choisir une ville de départ et une ville d'arrivée dans des champs de saisie proposant des suggestions de communes, utilisables à la souris comme au clavier.

## ADDED Requirements

### Requirement: Deux champs de saisie
La page SHALL présenter deux champs libellés « Ville de départ » et « Ville d'arrivée ».

#### Scenario: Affichage initial
- **WHEN** l'utilisateur ouvre l'application
- **THEN** il voit les champs « Ville de départ » et « Ville d'arrivée », vides
- **AND** aucune distance n'est affichée

### Requirement: Suggestions pendant la saisie
Pendant la saisie dans un champ, le système SHALL afficher sous ce champ la liste des communes correspondantes (voir `recherche-commune`), en attendant une courte pause de frappe (environ 250 ms) avant de lancer la recherche.

#### Scenario: Affichage des suggestions
- **WHEN** l'utilisateur tape « Toulo » dans « Ville de départ »
- **THEN** une liste de suggestions apparaît sous le champ, incluant « Toulouse » et « Toulon » avec leur libellé complet

#### Scenario: Aucune commune trouvée
- **WHEN** la recherche ne renvoie aucune commune
- **THEN** la liste de suggestions est masquée

### Requirement: Sélection d'une suggestion
L'utilisateur SHALL pouvoir choisir une suggestion d'un clic ; le champ prend alors le libellé de la commune, la liste se ferme et la commune devient la ville retenue pour ce champ.

#### Scenario: Sélection à la souris
- **WHEN** l'utilisateur clique sur la suggestion « Toulouse »
- **THEN** le champ affiche le libellé de Toulouse et la liste se ferme

### Requirement: Navigation au clavier
La liste de suggestions SHALL être utilisable au clavier : flèches bas/haut pour parcourir les suggestions (en boucle), Entrée pour sélectionner la suggestion active, Échap pour fermer la liste.

#### Scenario: Sélection au clavier
- **WHEN** l'utilisateur appuie sur flèche bas puis Entrée
- **THEN** la première suggestion est sélectionnée

#### Scenario: Fermeture par Échap
- **WHEN** la liste est ouverte et l'utilisateur appuie sur Échap
- **THEN** la liste se ferme sans modifier la ville retenue

### Requirement: Modification de la saisie
Lorsque l'utilisateur modifie le texte d'un champ après une sélection, la ville précédemment retenue pour ce champ SHALL être oubliée.

#### Scenario: Correction d'une ville
- **WHEN** l'utilisateur a sélectionné « Toulouse » puis modifie le texte du champ
- **THEN** plus aucune ville n'est retenue pour ce champ et la distance affichée disparaît

### Requirement: Accessibilité
Chaque champ SHALL suivre le motif ARIA « combobox » (rôles `combobox`, `listbox`, `option`, attributs `aria-expanded` et `aria-activedescendant` à jour).

#### Scenario: Lecteur d'écran
- **WHEN** la liste de suggestions est ouverte et une suggestion est active
- **THEN** le champ a `aria-expanded="true"` et `aria-activedescendant` désigne la suggestion active

### Requirement: Erreur de recherche
Si la recherche de communes échoue, le système SHALL afficher un message d'erreur compréhensible à l'utilisateur, sans bloquer la page.

#### Scenario: Service en panne
- **WHEN** le service d'autocomplétion est indisponible pendant la saisie
- **THEN** un message indique que la recherche de communes a échoué
