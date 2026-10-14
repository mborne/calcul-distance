# Feature Specification: Distance between two cities

**Feature Branch**: `spec-kit`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "A web application that computes the distance between two cities. The user types the city names and picks them from suggestions provided by the autocompletion service of the Géoplateforme (IGN)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Get the distance between two cities (Priority: P1)

A visitor wants to know how far apart two French municipalities are. They start typing the name of the
departure city, pick it from the suggested municipalities, do the same for the arrival city, and
immediately read the straight-line distance between them.

**Why this priority**: this is the whole purpose of the application; on its own it is a usable MVP.

**Independent Test**: open the page, type "Paris" then pick "Paris", type "Marseill" then pick
"Marseille": the page shows about 660 km.

**Acceptance Scenarios**:

1. **Given** the page has just been opened, **When** the visitor looks at it, **Then** they see two
   empty fields labelled "Ville de départ" and "Ville d'arrivée" and no distance.
2. **Given** the departure field is focused, **When** the visitor types "Toulo", **Then** a list of
   matching municipalities appears below the field, including "Toulouse, 31000" and "Toulon, 83000".
3. **Given** suggestions are displayed, **When** the visitor clicks "Toulouse, 31000", **Then** the
   field shows "Toulouse, 31000" and the list closes.
4. **Given** Paris is selected as departure, **When** the visitor selects Marseille as arrival,
   **Then** the page shows "Paris → Marseille : 660 km à vol d'oiseau" without any further action.
5. **Given** only the departure city is selected, **When** the visitor looks at the result area,
   **Then** no distance is shown.

---

### User Story 2 - Use the application with the keyboard and a screen reader (Priority: P2)

A visitor who does not use a mouse, possibly with a screen reader, wants to complete the same task
with the keyboard only and to be told the suggestions and the result.

**Why this priority**: accessibility is required for a public-facing tool (constitution, principle V),
but the MVP is already valuable without it.

**Independent Test**: complete User Story 1 with the keyboard only (Tab, arrows, Enter, Escape) and
check with a screen reader that the active suggestion and the result are announced.

**Acceptance Scenarios**:

1. **Given** suggestions are displayed, **When** the visitor presses Down then Enter, **Then** the
   first suggestion is selected.
2. **Given** the last suggestion is active, **When** the visitor presses Down, **Then** the first
   suggestion becomes active (and Up from the first goes to the last).
3. **Given** suggestions are displayed, **When** the visitor presses Escape, **Then** the list closes
   and the selected city is unchanged.
4. **Given** a suggestion is active, **When** assistive technology inspects the field, **Then** the
   field is exposed as an expanded combobox whose active option is that suggestion.
5. **Given** both cities are selected, **When** the distance appears, **Then** it is announced to
   screen readers.

---

### User Story 3 - Recover from mistakes and service problems (Priority: P3)

A visitor may mistype, change their mind, type quickly, or face an unavailable search service. The
application must never show a misleading distance and must explain what went wrong.

**Why this priority**: improves trust and robustness once the main flow works.

**Independent Test**: select two cities, edit one of the fields, and check the distance disappears;
simulate a service failure and check an error message is shown.

**Acceptance Scenarios**:

1. **Given** two cities are selected and a distance is shown, **When** the visitor edits the text of
   one field, **Then** that field no longer has a selected city and the distance disappears.
2. **Given** the visitor types "Bord" then quickly "Borde", **When** the results arrive, **Then** only
   suggestions matching "Borde" are displayed.
3. **Given** the search service is unavailable, **When** the visitor types a city name, **Then** a
   message states that the municipality search failed, and the page keeps working.

---

### Edge Cases

- Fewer than 3 characters typed (spaces ignored): no search is run and no suggestion is shown.
- No municipality matches: the suggestion list is hidden.
- Homonyms (e.g. "Saint-Denis"): suggestions show the postal code to tell them apart.
- Same city selected twice: the distance shown is "0 m".
- Very short distances: shown in metres below 1 km ("432 m"), with one decimal below 10 km ("7,3 km").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST provide two input fields, "Ville de départ" and "Ville d'arrivée".
- **FR-002**: The system MUST suggest French municipalities whose name matches the typed text, once at
  least 3 non-blank characters are typed and after a short typing pause (about 250 ms).
- **FR-003**: The system MUST display at most 10 suggestions, each with the municipality name and
  postal code when known.
- **FR-004**: Users MUST be able to select a suggestion with the mouse or with the keyboard (Down/Up
  with wrap-around, Enter to select, Escape to close).
- **FR-005**: The input fields and suggestion lists MUST follow the WAI-ARIA combobox pattern.
- **FR-006**: The system MUST compute the straight-line (great-circle) distance between the two
  selected municipalities, assuming a spherical Earth with a mean radius of 6,371 km.
- **FR-007**: The system MUST display the distance as soon as both cities are selected, and display
  nothing while at least one is missing.
- **FR-008**: The distance MUST be formatted in French: metres below 1 km, kilometres with one decimal
  below 10 km, whole kilometres otherwise, preceded by the two municipality names
  ("Paris → Marseille : 660 km à vol d'oiseau").
- **FR-009**: Editing a field after a selection MUST discard the selection for that field.
- **FR-010**: Only suggestions for the latest typed text MUST be displayed; outdated searches are
  discarded.
- **FR-011**: When the search service fails, the system MUST display an understandable error message
  without blocking the page.

### Key Entities

- **Municipality**: a French commune proposed by the search; name, full label (name and postal code),
  optional postal code, longitude and latitude (WGS84).
- **Selection**: the municipality chosen in a field (departure or arrival), or none.
- **Distance result**: the distance in kilometres between the two selected municipalities and its
  formatted label.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor gets the distance between two cities in under 30 seconds.
- **SC-002**: Suggestions appear in under 1 second after the visitor stops typing, on a standard
  connection.
- **SC-003**: The computed distance is within 1 km of the reference value for Paris–Marseille
  (660 km with reference coordinates).
- **SC-004**: 100% of User Story 1 can be completed with the keyboard only.
- **SC-005**: No distance is ever displayed for a field whose text no longer matches the selected city.

## Assumptions

- Visitors are French-speaking; the interface is in French only.
- The distance is "as the crow flies"; road distance and travel time are out of scope.
- No map is displayed in this version.
- Only French municipalities are supported (no addresses, no foreign cities).
- Dependency: the public autocompletion service of the Géoplateforme (IGN) provides municipality
  names and coordinates; it is free and requires no account.
