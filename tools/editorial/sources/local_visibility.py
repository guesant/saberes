#!/usr/bin/env python3
"""Audit local editorial visibility flags without approving or training content.

Default mode is a read-only audit. ``--apply`` only changes ``is_published``
on the fixed visibility-only allowlist below, after an explicit confirmation
token and a verified SQLite backup. Editorial status, question status, source
reuse rights, assessment publication, and training flags are never modified.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import sys
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


HERE = Path(__file__).resolve().parent
REPOSITORY = HERE.parents[2]
DEFAULT_DATABASE = REPOSITORY / ".local" / "content" / "content.sqlite"
CONFIRMATION = "SET-IS_PUBLISHED-1-ONLY"
EXCLUDED_VISIBILITY_REASONS = {
    "assessment_sets": "direct assessment/exam listing gate; enabling it makes an assessment available",
    "learning_courses": "course detail returns nested learning items and question references; may expose training content",
    "questions": "uses editorial status as a question-reader/training gate; never changed",
    "question_occurrences": "uses editorial status as an occurrence/training gate; never changed",
    "papers": "official exam-paper structure; broader publication can affect question/assessment routes",
    "stages": "official exam-stage metadata; broader publication can affect question/assessment routes",
    "editions": "official edition metadata; publication has broader catalog effects",
    "admission_processes": "official admissions-process metadata; publication has broader catalog effects",
    "organizers": "official organizer metadata; publication has broader catalog effects",
    "universities": "official institution metadata; publication has broader catalog effects",
}

# These flags are consumed as visibility/listing gates in the local content
# repository. They do not alter editorial_status/review_status or create a
# practice/assessment session. Courses and assessment sets are intentionally
# excluded because publishing a course exposes its items and publishing an
# assessment makes an exercise/exam available.
SAFE_VISIBILITY_TABLES = ("resources", "lessons", "learning_maps", "study_plans")

# These are not visibility switches for this tool. Values that are not the
# public/approved value are reported with their full primary keys, but left
# untouched because they express editorial review, answer readiness, rights,
# or can enable question/assessment training.
EDITORIAL_GATES: tuple[tuple[str, str, tuple[Any, ...], str], ...] = (
    ("resources", "editorial_status", ("published",), "resource approval; not changed"),
    ("lessons", "review_status", ("published",), "lesson editorial review; not changed"),
    ("resource_topics", "review_status", ("published",), "resource-topic editorial review; not changed"),
    ("question_canonical_topics", "review_status", ("published",), "question classification review; not changed"),
    ("curriculum_topic_canonical_topics", "review_status", ("published",), "curriculum mapping review; not changed"),
    ("curriculum_topic_stages", "review_status", ("published",), "stage mapping review; not changed"),
    ("questions", "status", ("published",), "question editorial/training gate; not changed"),
    ("question_occurrences", "status", ("published",), "occurrence editorial/training gate; not changed"),
    ("assessment_sets", "is_published", (1,), "assessment/training availability; not changed"),
    ("assessment_blueprints", "status", ("published",), "assessment blueprint state; not changed"),
    ("canonical_topics", "status", ("published",), "canonical topic editorial state; not changed"),
    ("canonical_answer_keys", "status", ("definitive",), "answer-key readiness; not changed"),
)

TARGET_TABLES = ("resources", "lessons", "learning_courses", "learning_maps", "study_plans", "source_documents", "questions", "question_occurrences")


def _quote(identifier: str) -> str:
    if not identifier.replace("_", "").isalnum():
        raise ValueError(f"unsafe SQL identifier: {identifier}")
    return '"' + identifier.replace('"', '""') + '"'


def open_readonly(path: Path) -> sqlite3.Connection:
    connection = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only=ON")
    return connection


def _tables(connection: sqlite3.Connection) -> set[str]:
    return {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")}


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _columns(connection: sqlite3.Connection, table: str) -> set[str]:
    return {row["name"] for row in connection.execute(f"PRAGMA table_info({_quote(table)})")}


def _primary_key(connection: sqlite3.Connection, table: str) -> list[str]:
    info = list(connection.execute(f"PRAGMA table_info({_quote(table)})"))
    return [row["name"] for row in sorted((row for row in info if row["pk"]), key=lambda row: row["pk"])]


def _keys(connection: sqlite3.Connection, table: str, where: str, params: tuple[Any, ...] = ()) -> list[Any]:
    columns = _primary_key(connection, table)
    if not columns:
        return []
    selection = ", ".join(_quote(column) for column in columns)
    rows = connection.execute(f"SELECT {selection} FROM {_quote(table)} WHERE {where} ORDER BY {selection}", params)
    result: list[Any] = []
    for row in rows:
        result.append(row[0] if len(columns) == 1 else dict(row))
    return result


def _counts(connection: sqlite3.Connection, table: str, column: str) -> dict[str, int]:
    result: dict[str, int] = {}
    for row in connection.execute(
        f"SELECT {_quote(column)} value, COUNT(*) amount FROM {_quote(table)} GROUP BY {_quote(column)} ORDER BY {_quote(column)}"
    ):
        result[str(row["value"])] = int(row["amount"])
    return result


def audit_database(path: Path) -> dict[str, Any]:
    """Return a read-only inventory, including every hidden primary key."""
    with closing(open_readonly(path)) as connection:
        table_names = _tables(connection)
        visibility_inventory: list[dict[str, Any]] = []
        for table in sorted(table_names):
            if "is_published" not in _columns(connection, table):
                continue
            hidden_ids = _keys(connection, table, "is_published = 0")
            total = int(connection.execute(f"SELECT COUNT(*) FROM {_quote(table)}").fetchone()[0])
            visibility_inventory.append({
                "table": table,
                "flag": "is_published",
                "total": total,
                "visible_count": total - len(hidden_ids),
                "hidden_count": len(hidden_ids),
                "hidden_ids": hidden_ids,
                "apply_eligible": table in SAFE_VISIBILITY_TABLES,
                "reason": (
                    "visibility-only allowlist; changes this flag only"
                    if table in SAFE_VISIBILITY_TABLES
                    else EXCLUDED_VISIBILITY_REASONS.get(
                        table,
                        "excluded: not explicitly verified as a visibility-only, non-training flag",
                    )
                ),
            })

        targets: dict[str, Any] = {}
        for table in TARGET_TABLES:
            if table not in table_names:
                targets[table] = {"present": False}
                continue
            columns = _columns(connection, table)
            record: dict[str, Any] = {
                "present": True,
                "row_count": int(connection.execute(f"SELECT COUNT(*) FROM {_quote(table)}").fetchone()[0]),
            }
            if "is_published" in columns:
                record["is_published_hidden_ids"] = _keys(connection, table, "is_published = 0")
            if table == "source_documents":
                record["visibility_flag"] = None
                record["note"] = "reuse_status is rights/reuse metadata, not a visibility flag; it is never changed"
                if "reuse_status" in columns:
                    record["reuse_status_counts"] = _counts(connection, table, "reuse_status")
                    record["unknown_reuse_ids"] = _keys(connection, table, "reuse_status = 'unknown'")
            if table in ("resources", "lessons"):
                status_column = "editorial_status" if table == "resources" else "review_status"
                if status_column in columns:
                    record["editorial_status_counts"] = _counts(connection, table, status_column)
                    record["not_published_status_ids"] = _keys(
                        connection, table, f"{_quote(status_column)} <> 'published'"
                    )
                    record["editorial_status_note"] = "reported only; never changed by --apply"
            if table in ("questions", "question_occurrences") and "status" in columns:
                record["status_counts"] = _counts(connection, table, "status")
                record["not_published_status_ids"] = _keys(connection, table, "status <> 'published'")
                record["status_note"] = "editorial/training gate; never changed by --apply"
            targets[table] = record

        editorial_gates: list[dict[str, Any]] = []
        for table, column, public_values, reason in EDITORIAL_GATES:
            if table not in table_names or column not in _columns(connection, table):
                continue
            placeholders = ", ".join("?" for _ in public_values)
            hidden = _keys(connection, table, f"{_quote(column)} NOT IN ({placeholders})", public_values)
            editorial_gates.append({
                "table": table,
                "flag": column,
                "public_value": list(public_values),
                "counts": _counts(connection, table, column),
                "nonpublic_count": len(hidden),
                "nonpublic_primary_keys": hidden,
                "reason": reason,
            })

        changes = []
        for table in SAFE_VISIBILITY_TABLES:
            if table not in table_names or "is_published" not in _columns(connection, table):
                continue
            ids = _keys(connection, table, "is_published = 0")
            changes.append({"table": table, "column": "is_published", "from": 0, "to": 1, "count": len(ids), "ids": ids})

        return {
            "schema_version": "local-visibility-audit/v1",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "database": str(path.resolve()),
            "database_sha256": _sha256_file(path),
            "database_mode": "read-only",
            "visibility_flag_inventory": visibility_inventory,
            "target_tables": targets,
            "editorial_and_training_gates": editorial_gates,
            "dry_run_plan": {
                "tables": list(SAFE_VISIBILITY_TABLES),
                "changes": changes,
                "fields_touched": ["is_published"],
                "fields_never_touched": ["status", "editorial_status", "review_status", "reuse_status", "tri_enabled", "is_automatically_gradable"],
            },
        }


def _backup_database(database: Path, destination: Path) -> None:
    destination = destination.resolve()
    if destination.exists():
        raise FileExistsError(f"backup path already exists: {destination}")
    if not destination.parent.is_dir():
        raise FileNotFoundError(f"backup parent directory does not exist: {destination.parent}")
    if destination.suffix.lower() not in (".sqlite", ".sqlite3", ".db"):
        raise ValueError("backup file must use .sqlite, .sqlite3, or .db extension")
    # O_EXCL protects against accidentally replacing an existing backup.
    fd = destination.open("xb")
    fd.close()
    try:
        with closing(sqlite3.connect(destination)) as backup:
            # Take the snapshot from a separate read-only handle. apply_visibility
            # already holds BEGIN IMMEDIATE on the writer, so no concurrent writer
            # can race between this backup and the subsequent updates.
            with closing(open_readonly(database)) as source:
                source.backup(backup)
            result = backup.execute("PRAGMA integrity_check").fetchone()[0]
            if result != "ok":
                raise sqlite3.DatabaseError(f"backup integrity check failed: {result}")
    except Exception:
        # Keep the failed artifact for inspection/recovery; never silently remove it.
        raise


def _table_fingerprint(connection: sqlite3.Connection, table: str, omit_visibility_flag: bool = False) -> str:
    columns = [row["name"] for row in connection.execute(f"PRAGMA table_info({_quote(table)})")]
    if omit_visibility_flag and "is_published" in columns:
        columns.remove("is_published")
    if not columns:
        return hashlib.sha256(b"empty-schema").hexdigest()
    selection = ", ".join(_quote(column) for column in columns)
    pk = [column for column in _primary_key(connection, table) if column in columns]
    order = " ORDER BY " + ", ".join(_quote(column) for column in pk) if pk else ""
    encoded_rows = []
    for row in connection.execute(f"SELECT {selection} FROM {_quote(table)}{order}"):
        values = [({"blob_hex": value.hex()} if isinstance(value, bytes) else value) for value in row]
        encoded_rows.append(json.dumps(values, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))
    if not pk:
        encoded_rows.sort()
    digest = hashlib.sha256()
    for row in encoded_rows:
        digest.update(len(row).to_bytes(8, "big"))
        digest.update(row)
    return digest.hexdigest()


def _verify_only_allowlisted_flags_changed(
    connection: sqlite3.Connection,
    backup_path: Path,
    changed_ids: dict[str, list[Any]],
) -> None:
    with closing(open_readonly(backup_path)) as backup:
        before_tables = _tables(backup)
        after_tables = _tables(connection)
        if before_tables != after_tables:
            raise sqlite3.DatabaseError("schema/table set changed during visibility update")
        for table in sorted(before_tables):
            may_change_flag = table in SAFE_VISIBILITY_TABLES and "is_published" in _columns(connection, table)
            if _table_fingerprint(backup, table, may_change_flag) != _table_fingerprint(connection, table, may_change_flag):
                raise sqlite3.DatabaseError(f"unexpected data change outside allowlisted visibility flag: {table}")
        for table, ids in changed_ids.items():
            for identifier in ids:
                if isinstance(identifier, dict):
                    clause = " AND ".join(f"{_quote(column)} = ?" for column in identifier)
                    params = tuple(identifier[column] for column in identifier)
                else:
                    pk = _primary_key(connection, table)
                    if len(pk) != 1:
                        raise sqlite3.DatabaseError(f"expected a single-column primary key for {table}")
                    clause, params = f"{_quote(pk[0])} = ?", (identifier,)
                current = connection.execute(
                    f"SELECT is_published FROM {_quote(table)} WHERE {clause}", params
                ).fetchone()
                original = backup.execute(
                    f"SELECT is_published FROM {_quote(table)} WHERE {clause}", params
                ).fetchone()
                if current is None or original is None or current[0] != 1 or original[0] != 0:
                    raise sqlite3.DatabaseError(f"unexpected visibility value after update: {table} {identifier}")


def apply_visibility(path: Path, backup_path: Path, confirmation: str) -> dict[str, Any]:
    """Set only allowlisted is_published flags in one transaction."""
    if confirmation != CONFIRMATION:
        raise PermissionError(f"apply requires --confirm {CONFIRMATION}")
    database = path.resolve()
    backup = backup_path.resolve()
    if database == backup:
        raise ValueError("backup path must differ from database path")

    connection = sqlite3.connect(database, timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        connection.execute("PRAGMA foreign_keys=ON")
        connection.execute("BEGIN IMMEDIATE")
        _backup_database(database, backup)
        tables = _tables(connection)
        changes: list[dict[str, Any]] = []
        changed_ids: dict[str, list[Any]] = {}
        for table in SAFE_VISIBILITY_TABLES:
            if table not in tables or "is_published" not in _columns(connection, table):
                continue
            ids = _keys(connection, table, "is_published = 0")
            if not ids:
                continue
            # Table names are from a hard-coded allowlist; the update changes no
            # editorial or training state and never deletes rows.
            cursor = connection.execute(f"UPDATE {_quote(table)} SET is_published = 1 WHERE is_published = 0")
            if cursor.rowcount != len(ids):
                raise sqlite3.DatabaseError(f"row count changed while updating {table}")
            changed_ids[table] = ids
            changes.append({"table": table, "column": "is_published", "count": cursor.rowcount, "ids": ids})
        _verify_only_allowlisted_flags_changed(connection, backup, changed_ids)
        connection.commit()
        return {
            "mode": "apply",
            "database": str(database),
            "backup": str(backup),
            "changes": changes,
            "fields_touched": ["is_published"],
            "deletions": 0,
        }
    except Exception:
        if connection.in_transaction:
            connection.rollback()
        raise
    finally:
        connection.close()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DEFAULT_DATABASE)
    parser.add_argument("--output", type=Path, help="write audit JSON (must be inside tools/editorial/sources)")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--dry-run", action="store_true", help="read-only audit; this is also the default")
    mode.add_argument("--apply", action="store_true", help="apply only allowlisted visibility flags")
    parser.add_argument("--backup", type=Path, help="new SQLite backup path; required with --apply")
    parser.add_argument("--confirm", help=f"required exact confirmation token: {CONFIRMATION}")
    args = parser.parse_args(argv)

    try:
        if args.apply:
            if args.output:
                raise ValueError("--output is only valid for read-only audit/dry-run")
            if not args.backup:
                raise ValueError("--apply requires --backup with a new backup filename")
            result = apply_visibility(args.database, args.backup, args.confirm or "")
        else:
            if args.backup or args.confirm:
                raise ValueError("--backup/--confirm require --apply")
            result = audit_database(args.database)
            result["mode"] = "dry-run"

        rendered = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        if args.output:
            destination = args.output.resolve()
            if HERE.resolve() not in destination.parents:
                raise ValueError("--output must be inside tools/editorial/sources")
            destination.write_text(rendered, encoding="utf-8")
            print(json.dumps({"mode": "dry-run", "output": str(destination), "rows": len(result["visibility_flag_inventory"])}, ensure_ascii=False))
        else:
            sys.stdout.write(rendered)
        return 0
    except Exception as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
