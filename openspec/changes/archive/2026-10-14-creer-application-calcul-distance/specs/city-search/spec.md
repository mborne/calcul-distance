# Spec Delta

## Purpose

Find French municipalities (communes) and their coordinates from the beginning of their name, using the autocompletion service of the Géoplateforme (IGN).

## ADDED Requirements

### Requirement: Search by name prefix
The system SHALL query the Géoplateforme autocompletion service (`https://data.geopf.fr/geocodage/completion/`) restricted to municipalities, and SHALL return for each match its name, a full label, its postal code when known, and its longitude and latitude (WGS84).

#### Scenario: Existing municipality
- **WHEN** the user searches for "Marseil"
- **THEN** the system queries the service with the text "Marseil" filtered on the municipality type
- **AND** returns a list containing a municipality named "Marseille" with its coordinates

#### Scenario: No result
- **WHEN** the service returns no result
- **THEN** the system returns an empty list

### Requirement: Minimum input length
The system MUST NOT query the service while the searched text, trimmed of leading and trailing whitespace, is shorter than 3 characters.

#### Scenario: Text too short
- **WHEN** the user searches for "Pa"
- **THEN** no request is sent
- **AND** the system returns an empty list

#### Scenario: Whitespace ignored
- **WHEN** the user searches for "   Lyon  "
- **THEN** the request is made with the text "Lyon"

### Requirement: Limited number of results
The system SHALL request at most 10 results from the service by default.

#### Scenario: Default limit
- **WHEN** a search is run without specifying a limit
- **THEN** the request asks for at most 10 responses

### Requirement: Service error
The system SHALL report an explicit error, including the HTTP status code, when the service responds with an error status.

#### Scenario: Service unavailable
- **WHEN** the service responds with HTTP status 500
- **THEN** the search fails with an error message containing "500"

### Requirement: Cancellation of outdated searches
The system SHALL allow a pending search to be cancelled when a newer search replaces it, so that only the results of the latest input are displayed.

#### Scenario: Fast typing
- **WHEN** the user types "Bord" then "Borde" before the first search has returned
- **THEN** only the results for "Borde" are suggested
