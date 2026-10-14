# Faire évoluer le projet avec OpenSpec

Ce projet suit une démarche de **développement piloté par les spécifications** (*spec-driven development*)
outillée par [OpenSpec](https://github.com/Fission-AI/OpenSpec).
Le principe : **on ne modifie pas le code directement**, on décrit d'abord le changement de
comportement attendu, on le fait relire, puis on le fait implémenter (par un humain ou un assistant IA)
en s'appuyant sur cette description.

## Organisation des fichiers

```text
openspec/
├── config.yaml                 # contexte du projet (stack, conventions) et règles pour l'IA
├── specs/                      # SOURCE DE VÉRITÉ : ce que fait l'application aujourd'hui
│   ├── recherche-commune/spec.md
│   ├── selection-ville/spec.md
│   └── calcul-distance/spec.md
└── changes/                    # changements proposés, en cours ou archivés
    ├── <nom-du-changement>/    # un changement en cours
    │   ├── proposal.md         # POURQUOI et QUOI
    │   ├── specs/<capacité>/spec.md   # DELTA de spécification (ADDED / MODIFIED / REMOVED)
    │   ├── design.md           # COMMENT (choix techniques, alternatives, risques)
    │   └── tasks.md            # liste de tâches cochables
    └── archive/                # changements terminés (historique des décisions)
.claude/                        # commandes /opsx:* et skills OpenSpec pour Claude Code
```

Une **spécification** décrit un comportement observable sous forme d'exigences
(`### Requirement:` avec SHALL / MUST) illustrées par des **scénarios** (`#### Scenario:` en
WHEN / THEN). Chaque scénario est un cas de test potentiel : les tests de `tests/` en reprennent
le nom.

## Le cycle d'un changement

```text
  explorer ──► proposer ──► relire ──► implémenter ──► archiver
 /opsx:explore /opsx:propose  (humain)   /opsx:apply   /opsx:archive
```

### 0. (Optionnel) Explorer

Pour une idée encore floue, discuter avec l'assistant sans rien écrire :

```text
/opsx:explore Afficher les deux villes sur une carte ?
```

### 1. Proposer

Dans Claude Code, décrire le besoin **en termes de comportement**, pas de code :

```text
/opsx:propose Afficher aussi la distance routière et la durée du trajet en voiture,
en utilisant le service d'itinéraire de la Géoplateforme.
```

L'assistant crée `openspec/changes/<nom>/` avec `proposal.md`, les deltas de spécification,
`design.md` et `tasks.md`. Il s'appuie sur `openspec/config.yaml` (contexte et règles du projet)
et sur les specs existantes. Il **ne touche pas au code** à cette étape.

Sans assistant, la même chose se fait à la main :

```bash
npx openspec new change afficher-distance-routiere
npx openspec instructions proposal --change afficher-distance-routiere   # modèle et consignes
```

### 2. Relire et valider (étape humaine, essentielle)

C'est le moment où l'on corrige le **quoi** avant d'investir dans le **comment** :

```bash
npx openspec list                                  # changements en cours
npx openspec show afficher-distance-routiere       # vue d'ensemble du changement
npx openspec validate afficher-distance-routiere --strict
```

Points à vérifier :

- les exigences sont-elles testables, sans détail d'implémentation ?
- chaque exigence a-t-elle au moins un scénario, y compris les cas d'erreur ?
- une exigence existante est-elle modifiée (`MODIFIED`, bloc complet recopié) plutôt que
  redéclarée (`ADDED`) ?
- le hors-périmètre est-il explicite (section *Non-Goals* du design) ?

On corrige les fichiers directement, ou on demande à l'assistant de le faire. Les specs sont
commitées et peuvent faire l'objet d'une PR dédiée, avant toute ligne de code.

### 3. Implémenter

```text
/opsx:apply afficher-distance-routiere
```

L'assistant déroule `tasks.md` dans l'ordre et coche chaque tâche (`- [x]`) une fois vérifiée
(tests, build). Les tests sont écrits à partir des scénarios. Si l'implémentation révèle un
problème de spécification, **on met à jour la spec** (ou on utilise `/opsx:update`) plutôt que
de laisser le code diverger.

### 4. Archiver

Une fois le code relu et fusionnable :

```text
/opsx:archive afficher-distance-routiere
```

ou `npx openspec archive afficher-distance-routiere`. Les deltas sont **fusionnés dans
`openspec/specs/`**, qui décrit alors le nouveau comportement, et le dossier du changement est
déplacé dans `openspec/changes/archive/AAAA-MM-JJ-<nom>/` pour garder la trace des décisions.

Le code, les tests et l'archivage sont commités ensemble dans la même PR.

## Exemple : modifier une exigence existante

Supposons qu'on veuille afficher la distance en
miles en plus des kilomètres. Le delta `openspec/changes/<nom>/specs/calcul-distance/spec.md`
recopie l'exigence existante en entier et la modifie :

```markdown
## MODIFIED Requirements

### Requirement: Format d'affichage
La distance SHALL être affichée en français avec les noms des deux communes, en kilomètres
(...) puis, entre parenthèses, en miles arrondis à l'unité ; ...

#### Scenario: Grande distance
- **WHEN** la distance calculée entre Paris et Marseille vaut 660,48 km
- **THEN** le texte est « Paris → Marseille : 660 km (410 mi) à vol d'oiseau »

(... autres scénarios conservés ...)
```

Pour une nouvelle fonctionnalité indépendante (par exemple une carte), on crée plutôt une
**nouvelle capacité** (`specs/carte/spec.md` avec une section `## Purpose` et des
`## ADDED Requirements`).

## Commandes utiles

| Commande | Rôle |
| --- | --- |
| `npx openspec list` / `list --specs` | changements en cours / capacités existantes |
| `npx openspec show <nom>` | afficher un changement ou une spec |
| `npx openspec validate --all --strict` | vérifier le format de toutes les specs et changements |
| `npx openspec status --change <nom>` | avancement des artefacts d'un changement |
| `npx openspec view` | tableau de bord interactif |
| `npx openspec archive <nom>` | fusionner un changement terminé dans les specs |
| `npx openspec update` | régénérer les commandes `/opsx:*` après mise à jour d'OpenSpec |

Le CLI est installé comme dépendance de développement (`npm install`), d'où `npx openspec`.

## Bonnes pratiques

- **Un changement = une intention** (petit, relisible, nommé en kebab-case par ce qu'il apporte).
- **Les specs décrivent le comportement**, `design.md` les choix techniques : si l'on peut changer
  l'implémentation sans changer ce que voit l'utilisateur, ce n'est pas dans la spec.
- **Le contexte du projet** (stack, conventions, règles pour les tâches) vit dans
  `openspec/config.yaml` : l'enrichir plutôt que de le répéter dans chaque demande.
- **Ne jamais modifier `openspec/specs/` à la main pour un changement de comportement** : passer par
  un changement puis l'archiver, afin que l'historique explique chaque évolution.
- **Garder le lien spec ↔ tests** : un scénario ajouté = un test ajouté (même nom).

## Historique

Le premier changement, [`creer-application-calcul-distance`](openspec/changes/archive/2026-10-14-creer-application-calcul-distance/),
illustre le cycle complet : l'application a été entièrement supprimée puis reconstruite en
rédigeant d'abord proposition, specs, design et tâches (commit dédié), puis en générant le code
à partir de ces documents.
