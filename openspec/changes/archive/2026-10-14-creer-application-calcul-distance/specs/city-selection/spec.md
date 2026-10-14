# Spec Delta

## Purpose

Let the user pick a departure city and an arrival city in input fields that suggest matching municipalities, usable with the mouse as well as the keyboard.

## ADDED Requirements

### Requirement: Two input fields
The page SHALL display two input fields labelled "Ville de départ" and "Ville d'arrivée" (the user interface is in French).

#### Scenario: Initial display
- **WHEN** the user opens the application
- **THEN** the fields "Ville de départ" and "Ville d'arrivée" are shown, empty
- **AND** no distance is displayed

### Requirement: Suggestions while typing
While the user types in a field, the system SHALL display below that field the list of matching municipalities (see `city-search`), waiting for a short typing pause (about 250 ms) before running the search.

#### Scenario: Suggestions displayed
- **WHEN** the user types "Toulo" in the departure field
- **THEN** a list of suggestions appears below the field, including "Toulouse" and "Toulon" with their full label

#### Scenario: No municipality found
- **WHEN** the search returns no municipality
- **THEN** the suggestion list is hidden

### Requirement: Selecting a suggestion
The user SHALL be able to pick a suggestion with a click; the field then shows the municipality label, the list closes and the municipality becomes the selected city for that field.

#### Scenario: Mouse selection
- **WHEN** the user clicks the "Toulouse" suggestion
- **THEN** the field shows the label of Toulouse and the list closes

### Requirement: Keyboard navigation
The suggestion list SHALL be usable with the keyboard: Down/Up arrows move through the suggestions (wrapping around), Enter selects the active suggestion, Escape closes the list.

#### Scenario: Keyboard selection
- **WHEN** the user presses Down then Enter
- **THEN** the first suggestion is selected

#### Scenario: Closing with Escape
- **WHEN** the list is open and the user presses Escape
- **THEN** the list closes without changing the selected city

### Requirement: Editing the input
When the user edits the text of a field after a selection, the city previously selected for that field SHALL be discarded.

#### Scenario: Correcting a city
- **WHEN** the user has selected "Toulouse" and then edits the field text
- **THEN** no city is selected for that field any more and the displayed distance disappears

### Requirement: Accessibility
Each field SHALL follow the ARIA "combobox" pattern (roles `combobox`, `listbox`, `option`, with `aria-expanded` and `aria-activedescendant` kept up to date).

#### Scenario: Screen reader
- **WHEN** the suggestion list is open and a suggestion is active
- **THEN** the field has `aria-expanded="true"` and `aria-activedescendant` points to the active suggestion

### Requirement: Search error
If the municipality search fails, the system SHALL display an understandable error message to the user without blocking the page.

#### Scenario: Service down
- **WHEN** the autocompletion service is unavailable while the user types
- **THEN** a message states that the municipality search failed
