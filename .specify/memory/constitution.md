# calcul-distance Constitution

## Core Principles

### I. Specification Before Code

Every change in behaviour MUST start with a feature specification under `specs/` (`/speckit-specify`),
followed by a plan (`/speckit-plan`) and a task list (`/speckit-tasks`) before any code is written.
Code that implements behaviour not described in a specification MUST NOT be merged. When
implementation reveals a gap, the specification is updated first, then the code.

Rationale: the project illustrates spec-driven development; the specification is the reference for
reviewers and for coding agents.

### II. Static Client-Side Application

The application MUST remain a static web page (HTML, CSS, TypeScript bundled by Vite) with no
backend, no server-side state and no user account. It MUST work when served from a sub-path
(GitHub Pages: `https://mborne.github.io/calcul-distance/`).

Rationale: free hosting, zero operations, and a codebase small enough to read in one sitting.

### III. Open Public Data Services

Geographic data MUST come from public services of the IGN Géoplateforme (`https://data.geopf.fr`),
called directly from the browser without an API key. Data from proprietary or non-open sources
MUST NOT be used. Every call to an external service MUST handle errors and show the user an
understandable message.

Rationale: reproducible results based on authoritative, open French reference data.

### IV. Testable Domain Logic

Domain logic (search request building and response mapping, distance calculation, formatting) MUST
live in pure modules that run without a browser, with network access injectable. Each acceptance
scenario that can be checked without a browser MUST have a unit test (Vitest) whose name refers to
the user story and scenario. `npm test` and `npm run build` MUST pass before merging.

Rationale: tests derived from scenarios keep the specification and the code aligned.

### V. Simplicity and Accessibility

No UI framework or runtime dependency MAY be added without a justification recorded in the plan's
Complexity Tracking table. The user interface MUST be in French, usable with the keyboard alone, and
follow the relevant WAI-ARIA patterns.

Rationale: an illustrative project must stay minimal; accessibility is not optional for a public
service.

## Language and Documentation Conventions

- `spec.md` files and this constitution MUST be written in English (requirements use MUST/SHOULD
  keywords). User-facing strings quoted in scenarios stay in French, as displayed by the application.
- Plans (`plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/`) and `tasks.md`
  are written in French; template headings are kept in English.
- Source code identifiers and comments are in French, consistent with the user interface.
- `README.md` describes how to run the project; `CODING.md` describes how to evolve it.

## Development Workflow and Quality Gates

1. `/speckit-specify` → optional `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` →
   optional `/speckit-analyze` → `/speckit-implement`.
2. Specification artifacts MAY be committed and reviewed before the implementation.
3. The GitHub Actions workflow `.github/workflows/pages.yml` runs `npm test` and `npm run build` on
   every pull request and publishes `dist/` to GitHub Pages on every push to `main`.
4. Tasks are checked off in `tasks.md` as they are completed; a feature is done when all tasks are
   checked and the quickstart scenarios have been validated.

## Governance

This constitution supersedes other development practices of the project. Every plan MUST include a
Constitution Check; any violation MUST be justified in Complexity Tracking or the plan rejected.
Amendments are made with `/speckit-constitution`, reviewed in a pull request, and versioned with
semantic versioning (MAJOR: principle removed or redefined; MINOR: principle or section added;
PATCH: wording). `CODING.md` is the runtime guidance for contributors and coding agents.

**Version**: 1.0.0 | **Ratified**: 2026-10-15 | **Last Amended**: 2026-10-15
