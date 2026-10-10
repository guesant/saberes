# Canonical question consolidation planner

This utility plans conservative, logical aliases for questions already connected
by `canonical_question_relations.relation_type = 'equivalent'`. The database is
opened with SQLite `mode=ro` and `query_only`; the utility has no apply mode.

The default scope is deliberately fixed:

| Edition | Paper versions |
| --- | --- |
| 2025 | QZ, RW, SX, TY |
| 2026 | QX, RY, SZ, TW |
| 2027 | QT, RS |

Use the repository database or pass another SQLite path:

```sh
python3 tools/editorial/canonical/canonical_questions.py
python3 tools/editorial/canonical/canonical_questions.py --database /path/to/content.sqlite
```

Output is JSON with candidate decisions, counts and declared foreign keys into
question, option, part and occurrence data. A row is eligible only when every
member of an existing equivalent component has the same exact statement and
type, identical ordered option codes/text/positions, no detected math notation,
no image path, no associated assets or stimuli, and no question parts. Any
uncertainty skips the whole component. No fuzzy matching is performed.

To write a proposed migration SQL file, choose a path beneath this directory:

```sh
python3 tools/editorial/canonical/canonical_questions.py \
  --emit-sql tools/editorial/canonical/proposed_aliases.sql
```

The SQL is an artifact for review by the main database integration owner. It
creates an alias table and a question-row archive, records the original legacy
row as JSON, and marks eligible duplicate question rows `archived`. It does not
delete a row or rewrite an occurrence, option, answer key, or dependent row.
Existing occurrence IDs and their gabaritos remain attached to their original
question and option IDs.

This is logical consolidation: the active canonical question is referenced by
aliases, while legacy question rows and their occurrence history remain in the
database. Existing application readers do not automatically follow aliases;
they must add alias resolution before the generated migration is applied, or
archived legacy slugs may stop rendering in readers that filter on published
status. The proposal also cannot verify image bytes or rich mathematical
rendering; any question with media or detected notation is intentionally
deferred for editorial review. The tool never changes `.local/content/content.sqlite`.

Run fixture tests with:

```sh
python3 -m unittest discover -s tools/editorial/canonical -p 'test_*.py'
```
