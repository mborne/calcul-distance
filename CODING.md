# Faire évoluer le projet avec Spec Kit

Ce projet suit une démarche de **développement piloté par les spécifications** (*spec-driven
development*) outillée par [Spec Kit](https://github.com/github/spec-kit) (GitHub).
Le principe : **on ne modifie pas le code directement**. On décrit d'abord *ce que* l'utilisateur
doit pouvoir faire et *pourquoi*, puis *comment* le construire, puis la liste des tâches ; le code
vient en dernier, généré par un assistant IA (ou écrit à la main) à partir de ces documents.

## Organisation des fichiers

```text
.specify/
├── memory/constitution.md      # PRINCIPES NON NÉGOCIABLES du projet (stack, données, tests, langue…)
├── templates/                  # modèles de spec, plan, tâches, checklist
└── scripts/bash/               # scripts appelés par les commandes /speckit-*
specs/
└── 001-city-distance/          # UNE FONCTIONNALITÉ = un dossier numéroté
    ├── spec.md                 # QUOI / POURQUOI : user stories, exigences FR-xxx, critères SC-xxx
    ├── checklists/requirements.md   # contrôle qualité de la spec
    ├── plan.md                 # COMMENT : contexte technique, contrôle de la constitution, structure
    ├── research.md             # décisions techniques et alternatives écartées
    ├── data-model.md           # entités
    ├── contracts/              # interfaces (service consommé, DOM/ARIA de l'interface)
    ├── quickstart.md           # scénarios de validation de bout en bout
    └── tasks.md                # tâches T001… groupées par user story
.claude/skills/speckit-*/       # commandes /speckit-* pour Claude Code
```

**Langue** : la constitution et les `spec.md` sont en anglais (cohérent avec MUST / Given-When-Then) ;
les textes de l'interface cités dans les scénarios restent en français. Plans et tâches sont en
français. Cette convention est inscrite dans la constitution, que l'assistant relit à chaque étape.

## Le cycle d'une fonctionnalité

```text
constitution ─► specify ─► (clarify) ─► plan ─► (checklist) ─► tasks ─► (analyze) ─► implement
   une fois      QUOI        questions    COMMENT   qualité      étapes   cohérence     code
```

### 0. Constitution (déjà faite, à amender si besoin)

```text
/speckit-constitution Ajouter un principe : toute nouvelle couche cartographique utilise les flux de la Géoplateforme.
```

Met à jour `.specify/memory/constitution.md` (version sémantique). Tous les plans futurs sont
contrôlés par rapport à elle (section *Constitution Check*).

### 1. Spécifier

Décrire le besoin **sans parler de technique** :

```text
/speckit-specify Afficher aussi la distance routière et la durée du trajet en voiture entre les deux villes.
```

L'assistant crée `specs/002-<nom-court>/spec.md` : user stories priorisées (P1 = MVP), scénarios
d'acceptation *Given / When / Then*, exigences `FR-xxx`, critères de succès mesurables `SC-xxx`,
hypothèses. Il remplit `checklists/requirements.md` et pose au plus 3 questions si un point est
ambigu (marqueurs `[NEEDS CLARIFICATION]`).

> Spec Kit propose normalement de créer une branche git par fonctionnalité (`002-…`) via
> l'extension git ; elle n'est pas installée ici, on reste sur la branche courante.

### 2. Clarifier (optionnel, recommandé)

```text
/speckit-clarify
```

Questions ciblées sur les zones floues ; les réponses sont intégrées à la spec (section *Clarifications*).

### 3. Planifier

Donner les choix techniques :

```text
/speckit-plan Utiliser le service d'itinéraire de la Géoplateforme (profil voiture, plus rapide).
```

Produit `plan.md` (avec le **contrôle de la constitution** : une violation doit être justifiée
dans *Complexity Tracking*), `research.md`, `data-model.md`, `contracts/` et `quickstart.md`.

### 4. Découper en tâches

```text
/speckit-tasks
/speckit-analyze        # optionnel : cohérence spec ↔ plan ↔ tâches, couverture des FR
```

`tasks.md` liste les tâches `T001…` par phase (setup, fondations, puis **une phase par user story**),
avec `[P]` pour celles parallélisables et `[USn]` pour la story servie.

### 5. Relire (étape humaine, essentielle)

Relire et corriger spec, plan et tâches avant toute ligne de code. Ces documents peuvent être
commités et relus dans une PR dédiée.

### 6. Implémenter

```text
/speckit-implement
```

L'assistant vérifie que les checklists sont cochées, puis déroule `tasks.md` phase par phase (tests
avant le code), coche chaque tâche (`[x]`) et termine par la validation du `quickstart.md`.
On peut s'arrêter après la phase de la user story P1 pour livrer un MVP.

Si l'implémentation contredit la spec, **on corrige la spec d'abord** (exemple réel : le scénario
« Paris → Marseille : 660 km » a été ajusté à 661 km, valeur obtenue avec les coordonnées de la
Géoplateforme).

### Modifier une fonctionnalité existante

Spec Kit n'a pas de notion de « delta » : pour un petit ajustement d'une fonctionnalité, on modifie
directement `specs/001-city-distance/spec.md`, puis on régénère ou met à jour `plan.md` et
`tasks.md` (`/speckit-plan`, `/speckit-tasks`). Pour un ajout significatif, on crée une nouvelle
fonctionnalité `002-…` qui référence la précédente.

## Comparaison avec OpenSpec (branche `openspec`)

Le même projet a été reconstruit avec [OpenSpec](https://github.com/Fission-AI/OpenSpec) sur la
branche [`openspec`](https://github.com/mborne/calcul-distance/tree/openspec).

| | Spec Kit (cette branche) | OpenSpec |
| --- | --- | --- |
| Unité de travail | **fonctionnalité** numérotée (`specs/001-…/`) | **changement** (`openspec/changes/<nom>/`) |
| Spécification | par fonctionnalité, orientée **user stories** priorisées (P1 = MVP), FR/SC numérotés | par **capacité** du système (`openspec/specs/<capacité>/`), exigences SHALL + scénarios WHEN/THEN |
| Source de vérité du comportement | dispersée dans les `specs/NNN-*/spec.md` successives | `openspec/specs/` : état courant consolidé |
| Évolution | modifier la spec ou ajouter une fonctionnalité `002-…` | **delta** (ADDED / MODIFIED / REMOVED) fusionné par `archive` |
| Principes du projet | **constitution** versionnée, contrôlée à chaque plan | `openspec/config.yaml` (contexte + règles par artefact) |
| Documents de conception | plan, research, data-model, contracts, quickstart | un seul `design.md` |
| Tâches | par user story, `[P]` parallélisable, IDs T001… | groupes numérotés, chaque tâche avec sa vérification |
| Outillage | CLI Python `specify` (init) ; le reste = commandes `/speckit-*` + scripts bash | CLI Node `openspec` (validate, show, archive…) + commandes `/opsx:*` |
| Validation | checklists et `/speckit-analyze` (par l'IA) | `openspec validate --strict` (format vérifié par la CLI) |
| Branches git | une branche par fonctionnalité (extension git) | indépendant des branches |
| Point fort | cadrage initial riche (produit → technique), MVP par story | évolutions incrémentales d'un existant, specs toujours à jour |
| Point faible | beaucoup de documents pour un petit projet ; pas d'état consolidé | moins guidé sur l'analyse produit (pas de stories, pas de critères de succès) |

En résumé : Spec Kit est plus adapté pour **lancer** une fonctionnalité (de l'idée au MVP),
OpenSpec pour **faire évoluer** un système existant en gardant une spécification consolidée.

## Bonnes pratiques

- **Une fonctionnalité = un besoin utilisateur** : petite, livrable, avec une story P1 qui se suffit.
- **La spec ne parle pas de technique** : services, bibliothèques et structure du code vont dans le plan.
- **Garder le lien spec ↔ code ↔ tests** : identifiants `USn`, `FR-xxx` dans les noms de tests et
  les commentaires.
- **Amender la constitution plutôt que la contourner** : une règle répétée dans chaque demande a sa
  place dans la constitution.
- **Valider le quickstart** avant de considérer une fonctionnalité terminée.

## Historique

La fonctionnalité [`001-city-distance`](specs/001-city-distance/) illustre le cycle complet :
l'application a été supprimée puis reconstruite en rédigeant d'abord la constitution, la spec,
le plan et les tâches (commit dédié), puis en générant le code à partir de ces documents.
