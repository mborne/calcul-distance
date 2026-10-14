# Spec Delta

## Purpose

Calcule la distance à vol d'oiseau entre deux communes sélectionnées et l'affiche à l'utilisateur dans un format lisible.

## ADDED Requirements

### Requirement: Distance orthodromique
Le système SHALL calculer la distance à vol d'oiseau entre deux points (longitude, latitude en degrés WGS84) avec la formule de haversine et un rayon terrestre moyen de 6 371 km.

#### Scenario: Points identiques
- **WHEN** la distance est calculée entre un point et lui-même
- **THEN** le résultat vaut 0 km

#### Scenario: Paris – Marseille
- **WHEN** la distance est calculée entre Paris (2.3522, 48.8566) et Marseille (5.3698, 43.2965)
- **THEN** le résultat vaut environ 660 km (à 1 km près)

#### Scenario: Symétrie
- **WHEN** la distance est calculée de A vers B puis de B vers A
- **THEN** les deux résultats sont égaux

### Requirement: Calcul automatique
Dès que les deux champs ont chacun une commune retenue, le système SHALL afficher la distance sans action supplémentaire ; tant que ce n'est pas le cas, aucune distance ne SHALL être affichée.

#### Scenario: Deux villes sélectionnées
- **WHEN** l'utilisateur a sélectionné Paris en départ et Marseille en arrivée
- **THEN** la distance s'affiche immédiatement

#### Scenario: Une seule ville
- **WHEN** seule la ville de départ est sélectionnée
- **THEN** aucune distance n'est affichée

### Requirement: Format d'affichage
La distance SHALL être affichée en français avec les noms des deux communes, en kilomètres arrondis à l'unité, ou à une décimale en dessous de 10 km, et en mètres en dessous de 1 km ; le résultat est annoncé aux lecteurs d'écran.

#### Scenario: Grande distance
- **WHEN** la distance calculée entre Paris et Marseille vaut 660,48 km
- **THEN** le texte est « Paris → Marseille : 660 km à vol d'oiseau »

#### Scenario: Petite distance
- **WHEN** la distance calculée vaut 0,4321 km
- **THEN** elle est affichée « 432 m »

#### Scenario: Distance moyenne
- **WHEN** la distance calculée vaut 7,26 km
- **THEN** elle est affichée « 7,3 km »
