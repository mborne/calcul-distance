# Spec Delta

## Purpose

Compute the straight-line ("as the crow flies") distance between two selected municipalities and display it to the user in a readable format.

## ADDED Requirements

### Requirement: Great-circle distance
The system SHALL compute the straight-line distance between two points (longitude, latitude in WGS84 degrees) using the haversine formula with a mean Earth radius of 6,371 km.

#### Scenario: Identical points
- **WHEN** the distance between a point and itself is computed
- **THEN** the result is 0 km

#### Scenario: Paris to Marseille
- **WHEN** the distance between Paris (2.3522, 48.8566) and Marseille (5.3698, 43.2965) is computed
- **THEN** the result is about 660 km (within 1 km)

#### Scenario: Symmetry
- **WHEN** the distance is computed from A to B and then from B to A
- **THEN** both results are equal

### Requirement: Automatic calculation
As soon as both fields have a selected municipality, the system SHALL display the distance without any further action; until then, no distance SHALL be displayed.

#### Scenario: Two cities selected
- **WHEN** the user has selected Paris as departure and Marseille as arrival
- **THEN** the distance is displayed immediately

#### Scenario: Single city
- **WHEN** only the departure city is selected
- **THEN** no distance is displayed

### Requirement: Display format
The distance SHALL be displayed in French with the names of both municipalities: in kilometres rounded to the unit, with one decimal below 10 km, and in metres below 1 km; the result is announced to screen readers.

#### Scenario: Long distance
- **WHEN** the computed distance between Paris and Marseille is 660.48 km
- **THEN** the text is "Paris → Marseille : 660 km à vol d'oiseau"

#### Scenario: Short distance
- **WHEN** the computed distance is 0.4321 km
- **THEN** it is displayed as "432 m"

#### Scenario: Medium distance
- **WHEN** the computed distance is 7.26 km
- **THEN** it is displayed as "7,3 km"
