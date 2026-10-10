#!/usr/bin/env python3
"""Plan safe, logical canonicalization of known equivalent exam questions.

This tool is intentionally read-only with respect to SQLite. It emits a report
by default and can optionally write a SQL proposal beneath this directory.
The proposal keeps legacy question and occurrence rows in place.
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
from collections import defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Iterable


HERE = Path(__file__).resolve().parent
DEFAULT_DATABASE = HERE.parents[2] / ".local" / "content" / "content.sqlite"
ALLOWED_COMPONENTS = {
    2025: {"QZ", "RW", "SX", "TY"},
    2026: {"QX", "RY", "SZ", "TW"},
    2027: {"QT", "RS"},
}
MATH_MARKERS = re.compile(
    r"(?:\\[A-Za-z]+|[$^_=<>+−±×÷√∑∫∞≤≥≠≈∝∂∆∇∈∉⊂∪∩∧∨→←↔])"
)


@dataclass
class Candidate:
    canonical_question_id: int
    canonical_slug: str
    alias_question_id: int
    alias_slug: str
    year: int
    component_codes: list[str]
    decision: str
    reasons: list[str]


def open_readonly(path: Path) -> sqlite3.Connection:
    uri = f"file:{path.resolve().as_posix()}?mode=ro"
    connection = sqlite3.connect(uri, uri=True)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only = ON")
    return connection


def table_exists(connection: sqlite3.Connection, name: str) -> bool:
    return connection.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (name,)
    ).fetchone() is not None


def assert_required_schema(connection: sqlite3.Connection) -> None:
    required = {
        "questions",
        "question_occurrences",
        "question_options",
        "question_parts",
        "question_assets",
        "question_stimuli",
        "canonical_question_relations",
        "papers",
        "paper_versions",
        "stages",
        "editions",
    }
    missing = sorted(name for name in required if not table_exists(connection, name))
    if missing:
        raise RuntimeError(f"Database schema is missing required tables: {', '.join(missing)}")


def find_question_references(connection: sqlite3.Connection) -> list[dict[str, str]]:
    """Report every declared FK into questions/options/parts/occurrences."""
    parents = {"questions", "question_options", "question_parts", "question_occurrences"}
    found: list[dict[str, str]] = []
    for row in connection.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ):
        child_table = row["name"]
        for fk in connection.execute(f'PRAGMA foreign_key_list("{child_table}")'):
            if fk["table"] in parents:
                found.append(
                    {
                        "child_table": child_table,
                        "child_column": fk["from"],
                        "parent_table": fk["table"],
                        "parent_column": fk["to"],
                        "on_delete": fk["on_delete"],
                    }
                )
    return sorted(found, key=lambda item: (item["parent_table"], item["child_table"], item["child_column"]))


def find_question_triggers(connection: sqlite3.Connection) -> list[dict[str, str]]:
    relevant_tables = {
        "questions",
        "question_occurrences",
        "question_options",
        "question_parts",
        "question_assets",
        "question_stimuli",
        "question_occurrence_options",
        "answer_keys",
        "answer_key_options",
        "canonical_answer_keys",
        "canonical_answer_key_options",
        "canonical_question_relations",
    }
    triggers: list[dict[str, str]] = []
    for row in connection.execute(
        "SELECT name, tbl_name, sql FROM sqlite_master WHERE type='trigger' ORDER BY name"
    ):
        if row["tbl_name"] in relevant_tables:
            triggers.append({"name": row["name"], "table": row["tbl_name"], "sql": row["sql"]})
    return triggers


def scoped_question_components(connection: sqlite3.Connection) -> tuple[dict[int, dict[str, Any]], dict[int, set[int]], dict[int, int]]:
    placeholders = ",".join("?" for _ in range(sum(map(len, ALLOWED_COMPONENTS.values()))))
    codes = [code for year_codes in ALLOWED_COMPONENTS.values() for code in sorted(year_codes)]
    scoped_sql = f"""
        SELECT DISTINCT q.id, q.slug, q.type, q.statement, q.image_path,
               e.year, pv.code
        FROM questions q
        JOIN question_occurrences qo ON qo.question_id=q.id
        JOIN papers p ON p.id=qo.paper_id
        JOIN stages st ON st.id=p.stage_id
        JOIN editions e ON e.id=st.edition_id
        JOIN paper_versions pv ON pv.id=qo.paper_version_id
        WHERE e.year IN (2025, 2026, 2027) AND pv.code IN ({placeholders})
    """
    scoped: dict[int, dict[str, Any]] = {}
    years: dict[int, int] = {}
    component_codes: dict[int, set[str]] = defaultdict(set)
    for row in connection.execute(scoped_sql, codes):
        expected = ALLOWED_COMPONENTS.get(row["year"], set())
        if row["code"] not in expected:
            continue
        question_id = row["id"]
        scoped[question_id] = dict(row)
        years[question_id] = row["year"]
        component_codes[question_id].add(row["code"])

    adjacency: dict[int, set[int]] = defaultdict(set)
    for relation in connection.execute(
        "SELECT question_id, related_question_id FROM canonical_question_relations WHERE relation_type='equivalent'"
    ):
        left, right = relation["question_id"], relation["related_question_id"]
        if left in scoped and right in scoped and years[left] == years[right]:
            adjacency[left].add(right)
            adjacency[right].add(left)

    groups: dict[int, set[int]] = {}
    visited: set[int] = set()
    for question_id in sorted(adjacency):
        if question_id in visited:
            continue
        stack = [question_id]
        component: set[int] = set()
        while stack:
            current = stack.pop()
            if current in visited:
                continue
            visited.add(current)
            component.add(current)
            stack.extend(adjacency[current] - visited)
        if len(component) > 1:
            groups[min(component)] = component
    return scoped, groups, years


def rows_for(connection: sqlite3.Connection, table: str, question_id: int) -> list[dict[str, Any]]:
    # Table names are fixed internal constants at call sites.
    return [dict(row) for row in connection.execute(f"SELECT * FROM {table} WHERE question_id=? ORDER BY 1", (question_id,))]


def option_signature(connection: sqlite3.Connection, question_id: int) -> list[tuple[Any, ...]]:
    return [tuple(row) for row in connection.execute(
        "SELECT code, text, position FROM question_options WHERE question_id=? ORDER BY code, position",
        (question_id,),
    )]


def asset_signature(connection: sqlite3.Connection, question_id: int) -> list[tuple[Any, ...]]:
    # Existence of any media is a deliberate review gate. IDs and placement are
    # not proof that two rendered assets are identical.
    assets = connection.execute(
        "SELECT asset_id, position FROM question_assets WHERE question_id=? ORDER BY position, asset_id",
        (question_id,),
    ).fetchall()
    stimuli = connection.execute(
        "SELECT stimulus_id, position FROM question_stimuli WHERE question_id=? ORDER BY position, stimulus_id",
        (question_id,),
    ).fetchall()
    return [tuple(row) for row in assets] + [("stimulus", *tuple(row)) for row in stimuli]


def evaluate_group(
    connection: sqlite3.Connection,
    ids: Iterable[int],
    scoped: dict[int, dict[str, Any]],
    years: dict[int, int],
) -> tuple[int, list[str]]:
    members = sorted(ids)
    canonical_id = members[0]
    records = [scoped[question_id] for question_id in members]
    reasons: list[str] = []

    if len({record["year"] for record in records}) != 1:
        reasons.append("cross_year_relation")
    if len({record["type"] for record in records}) != 1:
        reasons.append("question_type_conflict")
    if len({record["statement"] for record in records}) != 1:
        reasons.append("statement_mismatch")
    if any(MATH_MARKERS.search(record["statement"] or "") for record in records):
        reasons.append("mathematical_notation_requires_review")

    signatures = {question_id: option_signature(connection, question_id) for question_id in members}
    if len({json.dumps(value, ensure_ascii=False, sort_keys=True) for value in signatures.values()}) != 1:
        reasons.append("option_mismatch")
    if any(
        MATH_MARKERS.search(option[1] or "")
        for signature in signatures.values()
        for option in signature
    ):
        reasons.append("mathematical_notation_requires_review")

    if any(record["image_path"] for record in records):
        reasons.append("legacy_image_path_requires_review")
    if any(asset_signature(connection, question_id) for question_id in members):
        reasons.append("question_assets_or_stimuli_require_review")
    if any(rows_for(connection, "question_parts", question_id) for question_id in members):
        reasons.append("multipart_question_requires_review")

    return canonical_id, reasons


def build_plan(connection: sqlite3.Connection) -> tuple[list[Candidate], dict[str, Any]]:
    assert_required_schema(connection)
    scoped, groups, years = scoped_question_components(connection)
    candidates: list[Candidate] = []
    for ids in sorted(groups.values(), key=lambda group: min(group)):
        canonical_id, reasons = evaluate_group(connection, ids, scoped, years)
        canonical = scoped[canonical_id]
        codes = sorted({code for question_id in ids for code in (row["code"] for row in connection.execute(
            """SELECT DISTINCT pv.code FROM question_occurrences qo
               JOIN paper_versions pv ON pv.id=qo.paper_version_id WHERE qo.question_id=?""",
            (question_id,),
        ))})
        for alias_id in sorted(ids - {canonical_id}):
            alias = scoped[alias_id]
            candidates.append(Candidate(
                canonical_question_id=canonical_id,
                canonical_slug=canonical["slug"],
                alias_question_id=alias_id,
                alias_slug=alias["slug"],
                year=canonical["year"],
                component_codes=codes,
                decision="alias_and_archive" if not reasons else "skip",
                reasons=reasons.copy(),
            ))

    by_year: dict[str, dict[str, int]] = {}
    occurrence_counts = {
        row["year"]: row["occurrence_count"]
        for row in connection.execute(
            """SELECT e.year, COUNT(DISTINCT qo.id) AS occurrence_count
               FROM question_occurrences qo
               JOIN papers p ON p.id=qo.paper_id
               JOIN stages st ON st.id=p.stage_id
               JOIN editions e ON e.id=st.edition_id
               JOIN paper_versions pv ON pv.id=qo.paper_version_id
               WHERE e.year IN (2025, 2026, 2027) AND pv.code IN ("""
            + ",".join("?" for _ in range(sum(map(len, ALLOWED_COMPONENTS.values()))))
            + ") GROUP BY e.year",
            [code for year_codes in ALLOWED_COMPONENTS.values() for code in sorted(year_codes)],
        )
    }
    for year in ALLOWED_COMPONENTS:
        year_candidates = [candidate for candidate in candidates if candidate.year == year]
        scoped_count = sum(1 for qid in scoped if years[qid] == year)
        eligible_count = sum(candidate.decision == "alias_and_archive" for candidate in year_candidates)
        by_year[str(year)] = {
            "scoped_questions": scoped_count,
            "scoped_occurrences": occurrence_counts.get(year, 0),
            "equivalent_groups": len({candidate.canonical_question_id for candidate in year_candidates}),
            "linked_alias_rows": len(year_candidates),
            "eligible_alias_rows": eligible_count,
            "logical_canonical_questions_after_aliasing": scoped_count - eligible_count,
            "skipped_alias_rows": sum(candidate.decision == "skip" for candidate in year_candidates),
        }

    report: dict[str, Any] = {
        "database": "read-only",
        "scope": {str(year): sorted(codes) for year, codes in ALLOWED_COMPONENTS.items()},
        "counts": {
            "scoped_questions": len(scoped),
            "scoped_occurrences": sum(occurrence_counts.values()),
            "equivalent_groups": len({candidate.canonical_question_id for candidate in candidates}),
            "linked_alias_rows": len(candidates),
            "eligible_alias_rows": sum(candidate.decision == "alias_and_archive" for candidate in candidates),
            "logical_canonical_questions_after_aliasing": len(scoped) - sum(
                candidate.decision == "alias_and_archive" for candidate in candidates
            ),
            "skipped_alias_rows": sum(candidate.decision == "skip" for candidate in candidates),
            "by_year": by_year,
        },
        "foreign_keys_into_question_data": find_question_references(connection),
        "question_data_triggers": find_question_triggers(connection),
        "candidates": [asdict(candidate) for candidate in candidates],
    }
    return candidates, report


def sql_literal(value: Any) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, (int, float)):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def render_migration(candidates: list[Candidate], connection: sqlite3.Connection) -> str:
    eligible = [candidate for candidate in candidates if candidate.decision == "alias_and_archive"]
    lines = [
        "-- Proposal generated by tools/editorial/canonical/canonical_questions.py",
        "-- Review and apply through the main database integration workflow.",
        "-- This proposal does not delete or rewrite questions, occurrences, options, or answers.",
        "BEGIN IMMEDIATE;",
        "CREATE TABLE IF NOT EXISTS canonical_question_aliases (",
        "  alias_question_id INTEGER PRIMARY KEY REFERENCES questions(id),",
        "  alias_slug TEXT NOT NULL UNIQUE,",
        "  canonical_question_id INTEGER NOT NULL REFERENCES questions(id),",
        "  created_by TEXT NOT NULL DEFAULT 'canonical_question_consolidation'",
        ");",
        "CREATE INDEX IF NOT EXISTS canonical_question_aliases_canonical_id",
        "  ON canonical_question_aliases(canonical_question_id);",
        "CREATE TABLE IF NOT EXISTS canonical_question_archive (",
        "  question_id INTEGER PRIMARY KEY REFERENCES questions(id),",
        "  canonical_question_id INTEGER NOT NULL REFERENCES questions(id),",
        "  original_row_json TEXT NOT NULL,",
        "  archived_reason TEXT NOT NULL",
        ");",
    ]
    for candidate in eligible:
        row = connection.execute("SELECT * FROM questions WHERE id=?", (candidate.alias_question_id,)).fetchone()
        payload = json.dumps(dict(row), ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        lines.append(
            "INSERT INTO canonical_question_archive(question_id, canonical_question_id, original_row_json, archived_reason) VALUES ("
            f"{candidate.alias_question_id}, {candidate.canonical_question_id}, {sql_literal(payload)}, "
            f"{sql_literal('exact equivalent clone; legacy row retained')} ) "
            ";"
        )
        lines.append(
            "INSERT INTO canonical_question_aliases(alias_question_id, alias_slug, canonical_question_id) VALUES ("
            f"{candidate.alias_question_id}, {sql_literal(candidate.alias_slug)}, {candidate.canonical_question_id}) "
            ";"
        )
        lines.append(
            f"UPDATE questions SET status='archived' WHERE id={candidate.alias_question_id} AND status<>'archived';"
        )
    lines.append("COMMIT;")
    return "\n".join(lines) + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DEFAULT_DATABASE, help="SQLite input, opened read-only")
    parser.add_argument("--emit-sql", type=Path, help="write a reviewed migration proposal under this tool directory")
    args = parser.parse_args(argv)
    try:
        db_path = args.database.resolve(strict=True)
        connection = open_readonly(db_path)
        candidates, report = build_plan(connection)
        report["database_path"] = str(db_path)
        if args.emit_sql:
            output = args.emit_sql.resolve()
            if not output.is_relative_to(HERE):
                raise ValueError(f"SQL output must stay inside {HERE}")
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(render_migration(candidates, connection), encoding="utf-8")
            report["sql_proposal"] = str(output)
        print(json.dumps(report, ensure_ascii=False, indent=2))
        connection.close()
        return 0
    except (OSError, sqlite3.Error, RuntimeError, ValueError) as error:
        print(f"canonical question planning failed: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
