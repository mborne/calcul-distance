# Spec Delta

## Purpose

Permet de retrouver des communes françaises et leurs coordonnées à partir d'un début de nom, en s'appuyant sur le service d'autocomplétion de la Géoplateforme (IGN).

## ADDED Requirements

### Requirement: Recherche par début de nom
Le système SHALL interroger le service d'autocomplétion de la Géoplateforme (`https://data.geopf.fr/geocodage/completion/`) en limitant les résultats aux communes, et SHALL retourner pour chaque commune trouvée son nom, un libellé complet, son code postal s'il est connu, sa longitude et sa latitude (WGS84).

#### Scenario: Recherche d'une commune existante
- **WHEN** l'utilisateur recherche « Marseil »
- **THEN** le système interroge le service avec le texte « Marseil » filtré sur le type commune
- **AND** retourne une liste contenant une commune nommée « Marseille » avec ses coordonnées

#### Scenario: Aucun résultat
- **WHEN** le service ne renvoie aucun résultat
- **THEN** le système retourne une liste vide

### Requirement: Longueur minimale de saisie
Le système MUST NOT interroger le service tant que le texte recherché, espaces de début et de fin retirés, compte moins de 3 caractères.

#### Scenario: Texte trop court
- **WHEN** l'utilisateur recherche « Pa »
- **THEN** aucune requête n'est envoyée
- **AND** le système retourne une liste vide

#### Scenario: Espaces ignorés
- **WHEN** l'utilisateur recherche «   Lyon  »
- **THEN** la requête porte sur le texte « Lyon »

### Requirement: Nombre de résultats limité
Le système SHALL demander au plus 10 résultats au service par défaut.

#### Scenario: Limite par défaut
- **WHEN** une recherche est lancée sans préciser de limite
- **THEN** la requête demande au plus 10 réponses

### Requirement: Erreur du service
Le système SHALL signaler une erreur explicite, mentionnant le code HTTP, lorsque le service répond avec un statut d'erreur.

#### Scenario: Service indisponible
- **WHEN** le service répond avec le statut HTTP 500
- **THEN** la recherche échoue avec un message d'erreur contenant « 500 »

### Requirement: Annulation des recherches obsolètes
Le système SHALL permettre d'annuler une recherche en cours lorsqu'une recherche plus récente la remplace, afin que seuls les résultats de la dernière saisie soient affichés.

#### Scenario: Saisie rapide
- **WHEN** l'utilisateur tape « Bord » puis « Borde » avant la réponse à la première recherche
- **THEN** seuls les résultats correspondant à « Borde » sont proposés
