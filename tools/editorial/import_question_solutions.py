#!/usr/bin/env python3
"""Import original, source-checked solution batches without silently publishing them.

Dry-run is the default.  The import verifies each 2027 QT occurrence and its
definitive answer key, stores the solution's editorial state, and is idempotent.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB = ROOT / ".local/content/content.sqlite"
DEFAULT_BATCHES = [
    ROOT / "content/editorial/unicamp-2027/simulado-2027-qt-solutions-01-36.json",
    ROOT / "content/editorial/unicamp-2027/simulado-2027-qt-solutions-37-72.json",
]
REQUIRED_COLUMNS = {
    "question_solutions": {"editorial_status", "editorial_version", "authorship"}
}


class SolutionImportError(ValueError):
    pass


def check_schema(conn: sqlite3.Connection) -> None:
    for table, required in REQUIRED_COLUMNS.items():
        actual = {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}
        missing = required - actual
        if missing:
            raise SolutionImportError(
                f"{table} lacks editorial columns {sorted(missing)}; apply the additive migration first"
            )


def load_batches(paths: list[Path]) -> list[dict[str, Any]]:
    solutions = []
    for path in paths:
        batch = json.loads(path.read_text(encoding="utf-8"))
        if batch.get("version") != 1 or not isinstance(batch.get("solutions"), list):
            raise SolutionImportError(f"unsupported solution package: {path}")
        solutions.extend(batch["solutions"])
    return solutions


def apply_editorial_reviews(
    solutions: list[dict[str, Any]],
    review_paths: list[Path],
    correction_paths: list[Path],
    final_review_paths: list[Path] | None = None,
) -> list[dict[str, Any]]:
    """Compose source-backed review decisions and corrections without dropping provenance."""
    by_number = {item["number"]: dict(item) for item in solutions}
    if len(by_number) != len(solutions):
        raise SolutionImportError("duplicate question positions in solution batches")

    decisions: dict[int, str] = {}
    for path in review_paths:
        batch = json.loads(path.read_text(encoding="utf-8"))
        items = batch.get("items")
        if not isinstance(items, list) or not items:
            raise SolutionImportError(f"unsupported solution review package: {path}")
        for review in items:
            number = review.get("number")
            if number not in by_number or number in decisions:
                raise SolutionImportError(f"duplicate or unknown reviewed position {number}")
            source = by_number[number]
            if (review.get("question_id"), review.get("occurrence_id"),
                    str(review.get("answer", "")).upper()) != (
                    source["question_id"], source["occurrence_id"],
                    str(source["answer_value"]).upper()):
                raise SolutionImportError(f"review identity or answer disagrees for question {number}")
            decision = review.get("decision")
            if decision not in ("publish", "revise", "hold"):
                raise SolutionImportError(f"unsupported editorial decision for question {number}: {decision}")
            decisions[number] = decision
            source["review_status"] = "published" if decision == "publish" else "review"

    if review_paths and set(decisions) != set(by_number):
        missing = sorted(set(by_number) - set(decisions))
        raise SolutionImportError(f"solution reviews do not cover all imported positions: {missing}")

    corrections: dict[int, dict[str, Any]] = {}
    for path in correction_paths:
        batch = json.loads(path.read_text(encoding="utf-8"))
        items = batch.get("solutions")
        if not isinstance(items, list) or not items:
            raise SolutionImportError(f"unsupported solution correction package: {path}")
        for correction in items:
            number = correction.get("number")
            if number not in by_number or number in corrections:
                raise SolutionImportError(f"duplicate or unknown corrected position {number}")
            if decisions.get(number) not in ("revise", "hold"):
                raise SolutionImportError(f"question {number} has no review decision requiring correction")
            original = by_number[number]
            for field in ("question_id", "occurrence_id", "source_page", "answer_value"):
                if correction.get(field) != original.get(field):
                    raise SolutionImportError(f"correction changes source identity or answer for question {number}")
            if correction.get("review_status") != "review":
                raise SolutionImportError(f"corrected question {number} must remain in review")
            if correction.get("authorship") != "original_editorial":
                raise SolutionImportError(f"corrected question {number} lacks editorial authorship")
            if not {335, 337}.issubset(set(correction.get("source_document_ids", []))):
                raise SolutionImportError(f"corrected question {number} lacks official sources")
            if not correction.get("title") or not correction.get("content", "").strip():
                raise SolutionImportError(f"corrected question {number} has empty content")
            original.update(correction)
            original["editorial_version"] = correction.get("editorial_version", "1.0.1")
            original["review_status"] = "review"
            corrections[number] = correction

    unresolved_corrections = {
        number for number, decision in decisions.items()
        if decision in ("revise", "hold")
    } - set(corrections)
    if unresolved_corrections:
        raise SolutionImportError(
            f"review-requested corrections are missing for positions {sorted(unresolved_corrections)}"
        )

    final_decisions: dict[int, str] = {}
    for path in final_review_paths or []:
        batch = json.loads(path.read_text(encoding="utf-8"))
        items = batch.get("items")
        if not isinstance(items, list) or not items:
            raise SolutionImportError(f"unsupported final solution review package: {path}")
        for review in items:
            number = review.get("number")
            if number not in corrections or number in final_decisions:
                raise SolutionImportError(f"final review must target one corrected position exactly once: {number}")
            current = by_number[number]
            if (review.get("question_id"), review.get("occurrence_id"),
                    str(review.get("answer", "")).upper()) != (
                    current["question_id"], current["occurrence_id"],
                    str(current["answer_value"]).upper()):
                raise SolutionImportError(f"final review identity or answer disagrees for question {number}")
            decision = review.get("decision")
            if decision not in ("publish", "revise", "hold"):
                raise SolutionImportError(f"unsupported final review decision for question {number}")
            final_decisions[number] = decision
            current["review_status"] = "published" if decision == "publish" else "review"
    if final_review_paths and set(final_decisions) != set(corrections):
        raise SolutionImportError("final review must cover every corrected solution")

    return [by_number[number] for number in sorted(by_number)]


def validate_solutions(conn: sqlite3.Connection, solutions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    check_schema(conn)
    if not solutions:
        raise SolutionImportError("no solutions supplied")
    question_ids = [item.get("question_id") for item in solutions]
    occurrence_ids = [item.get("occurrence_id") for item in solutions]
    numbers = [item.get("number") for item in solutions]
    if len(question_ids) != len(set(question_ids)):
        raise SolutionImportError("canonical question appears more than once in the batches")
    if len(occurrence_ids) != len(set(occurrence_ids)):
        raise SolutionImportError("occurrence appears more than once in the batches")
    if sorted(numbers) != list(range(1, 73)):
        raise SolutionImportError("the representative QT set must contain each original position exactly once")

    verified = []
    for item in solutions:
        for field in ("question_id", "occurrence_id", "number", "title", "content", "source_page", "answer_value"):
            if item.get(field) is None or item.get(field) == "":
                raise SolutionImportError(f"solution {item.get('number')} is missing {field}")
        if item.get("authorship") != "original_editorial":
            raise SolutionImportError(f"solution {item['number']} must be identified as original editorial work")
        if item.get("review_status") not in ("draft", "review", "published"):
            raise SolutionImportError(f"solution {item['number']} has no valid editorial status")
        if not {335, 337}.issubset(set(item.get("source_document_ids", []))):
            raise SolutionImportError(f"solution {item['number']} must cite the official booklet and definitive key")

        occurrence = conn.execute("""
            SELECT qo.question_id, qo.number, qo.source_document_id, qo.source_page,
                   pv.code, e.year, e.admission_process_id
            FROM question_occurrences qo
            JOIN papers p ON p.id=qo.paper_id
            JOIN paper_versions pv ON pv.id=qo.paper_version_id
            JOIN stages st ON st.id=p.stage_id
            JOIN editions e ON e.id=st.edition_id
            WHERE qo.id=?
        """, (item["occurrence_id"],)).fetchone()
        if occurrence is None:
            raise SolutionImportError(f"occurrence {item['occurrence_id']} is absent")
        if (occurrence[0], occurrence[1], occurrence[2], occurrence[3], occurrence[4], occurrence[5], occurrence[6]) != (
            item["question_id"], item["number"], 335, item["source_page"], "QT", 2027, 1
        ):
            raise SolutionImportError(f"solution {item['number']} does not match its official QT occurrence")

        key = conn.execute("""
            SELECT answer_value, source_document_id FROM canonical_answer_keys
            WHERE question_id=? AND occurrence_id=? AND status='definitive'
            ORDER BY version DESC, id DESC LIMIT 1
        """, (item["question_id"], item["occurrence_id"])).fetchone()
        if key is None or key[0] is None:
            raise SolutionImportError(f"solution {item['number']} has no definitive occurrence-specific answer")
        if key[0].strip().upper() != str(item["answer_value"]).strip().upper() or key[1] != 337:
            raise SolutionImportError(f"solution {item['number']} disagrees with the official definitive key")
        verified.append(item)
    return verified


def existing_match(conn: sqlite3.Connection, item: dict[str, Any]) -> int | None:
    matches = conn.execute("""
        SELECT id, title, content, source_document_id, editorial_status, editorial_version, authorship
        FROM question_solutions WHERE question_id=? ORDER BY position
    """, (item["question_id"],)).fetchall()
    for row in matches:
        if row[1] == item["title"] and row[2] == item["content"] and row[3] == 335:
            if row[5] != item.get("editorial_version", "1.0.0") or row[6] != item["authorship"]:
                raise SolutionImportError(f"existing solution {row[0]} has conflicting editorial metadata")
            if row[4] != item["review_status"] and not (row[4] == "review" and item["review_status"] == "published"):
                raise SolutionImportError(f"existing solution {row[0]} cannot be downgraded or reclassified")
            return row[0]
    if matches:
        raise SolutionImportError(f"question {item['question_id']} already has a different solution; refusing to overwrite")
    return None


def import_solutions(conn: sqlite3.Connection, solutions: list[dict[str, Any]], *, apply: bool) -> dict[str, Any]:
    checked = validate_solutions(conn, solutions)
    existing = {item["number"]: existing_match(conn, item) for item in checked}
    pending = [item for item in checked if existing[item["number"]] is None]
    existing_by_number = {item["number"]: existing[item["number"]] for item in checked}
    if not apply:
        return {
            "mode": "dry-run",
            "verified_occurrences": len(checked),
            "existing_identical": len(checked) - len(pending),
            "would_insert": len(pending),
            "editorial_states": {state: sum(item["review_status"] == state for item in checked)
                                 for state in ("draft", "review", "published")},
        }

    conn.execute("BEGIN IMMEDIATE")
    inserted = []
    try:
        for item in pending:
            position = conn.execute(
                "SELECT COALESCE(MAX(position), -1) + 1 FROM question_solutions WHERE question_id=?",
                (item["question_id"],),
            ).fetchone()[0]
            conn.execute("""
                INSERT INTO question_solutions
                  (question_id,title,content,content_format,position,source_document_id,
                   editorial_status,editorial_version,authorship)
                VALUES (?,?,?,?,?,?,?,?,?)
            """, (
                item["question_id"], item["title"], item["content"], "markdown", position, 335,
                item["review_status"], item.get("editorial_version", "1.0.0"), item["authorship"],
            ))
            inserted.append(item["question_id"])
        promoted = []
        for item in checked:
            row_id = existing_by_number[item["number"]]
            if row_id is None or item["review_status"] != "published":
                continue
            cursor = conn.execute(
                "UPDATE question_solutions SET editorial_status='published' WHERE id=? AND editorial_status='review'",
                (row_id,),
            )
            if cursor.rowcount:
                promoted.append(item["question_id"])
        if conn.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
            raise SolutionImportError("SQLite integrity_check failed")
        if conn.execute("PRAGMA foreign_key_check").fetchall():
            raise SolutionImportError("SQLite foreign_key_check failed")
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    return {
        "mode": "applied",
        "verified_occurrences": len(checked),
        "inserted_questions": inserted,
        "promoted_questions": promoted,
        "already_present": len(checked) - len(pending),
    }


def make_backup(db_path: Path) -> Path:
    backup_dir = db_path.parent / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup_path = backup_dir / f"before-qt-2027-solutions-{stamp}.sqlite"
    with sqlite3.connect(db_path) as source, sqlite3.connect(backup_path) as target:
        source.backup(target)
    return backup_path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DEFAULT_DB)
    parser.add_argument("--batch", type=Path, action="append", default=[])
    parser.add_argument("--second-review", type=Path, action="append", default=[],
                        help="Compose a complete, explicit second-review package (repeatable).")
    parser.add_argument("--correction", type=Path, action="append", default=[],
                        help="Apply a reviewed correction package while keeping those solutions in review.")
    parser.add_argument("--final-review", type=Path, action="append", default=[],
                        help="Compose independent review of corrected solutions (repeatable).")
    parser.add_argument("--apply", action="store_true", help="write after backup; default is dry-run")
    args = parser.parse_args()
    batch_paths = args.batch or DEFAULT_BATCHES
    solutions = load_batches(batch_paths)
    if args.second_review or args.correction or args.final_review:
        solutions = apply_editorial_reviews(
            solutions, args.second_review, args.correction, args.final_review
        )
    backup = make_backup(args.database) if args.apply else None
    with sqlite3.connect(args.database) as conn:
        conn.execute("PRAGMA foreign_keys=ON")
        result = import_solutions(conn, solutions, apply=args.apply)
    if backup:
        result["backup"] = str(backup)
    result["batch_sha256"] = {str(path): __import__("hashlib").sha256(path.read_bytes()).hexdigest()
                              for path in batch_paths}
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
