#!/usr/bin/env python3
"""Import a reviewed shared question stimulus into the local editorial SQLite DB.

Dry-run is the default. Pass --apply to create the stimulus and question links.
The import is idempotent by stimulus slug and preserves existing records.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = ROOT / "content/editorial/unicamp-2027/2027-qt-q57-q58-stimulus.json"
DEFAULT_DB = ROOT / ".local/content/content.sqlite"


class ImportErrorDetail(ValueError):
    pass


def validate_payload(conn: sqlite3.Connection, payload: dict[str, Any]) -> tuple[dict[str, Any], list[int]]:
    if payload.get("version") != 1:
        raise ImportErrorDetail("unsupported payload version")
    stimulus = payload.get("stimulus")
    question_ids = payload.get("question_ids")
    if not isinstance(stimulus, dict) or not isinstance(question_ids, list) or not question_ids:
        raise ImportErrorDetail("payload must contain a stimulus and question_ids")

    required = ("slug", "title", "content", "content_format", "source_document_id", "source_page")
    if any(stimulus.get(field) in (None, "") for field in required):
        raise ImportErrorDetail("stimulus is missing a required field")
    if stimulus["content_format"] not in ("markdown", "plain_text"):
        raise ImportErrorDetail("unsupported content_format")
    if len(set(question_ids)) != len(question_ids) or any(not isinstance(qid, int) for qid in question_ids):
        raise ImportErrorDetail("question_ids must be unique integers")

    source = conn.execute(
        "SELECT id FROM source_documents WHERE id = ?", (stimulus["source_document_id"],)
    ).fetchone()
    if source is None:
        raise ImportErrorDetail(f"source document {stimulus['source_document_id']} does not exist")

    for question_id in question_ids:
        if conn.execute("SELECT 1 FROM questions WHERE id = ?", (question_id,)).fetchone() is None:
            raise ImportErrorDetail(f"question {question_id} does not exist")
        occurrence = conn.execute(
            "SELECT 1 FROM question_occurrences WHERE question_id = ? AND source_document_id = ? "
            "AND source_page = ? LIMIT 1",
            (question_id, stimulus["source_document_id"], stimulus["source_page"] + 1),
        ).fetchone()
        if occurrence is None:
            raise ImportErrorDetail(
                f"question {question_id} has no occurrence on the expected following source page"
            )

    existing = conn.execute(
        "SELECT id, title, content, content_format, source_document_id, source_page "
        "FROM stimuli WHERE slug = ?", (stimulus["slug"],)
    ).fetchone()
    if existing is not None:
        expected = (
            stimulus["title"], stimulus["content"], stimulus["content_format"],
            stimulus["source_document_id"], stimulus["source_page"],
        )
        if tuple(existing[1:]) != expected:
            raise ImportErrorDetail("existing stimulus slug has conflicting content or provenance")

    return stimulus, question_ids


def import_stimulus(conn: sqlite3.Connection, payload: dict[str, Any], *, apply: bool) -> dict[str, Any]:
    stimulus, question_ids = validate_payload(conn, payload)
    existing = conn.execute("SELECT id FROM stimuli WHERE slug = ?", (stimulus["slug"],)).fetchone()
    stimulus_id = existing[0] if existing else None

    links_to_add: list[tuple[int, int, int]] = []
    for question_id in question_ids:
        linked = conn.execute(
            "SELECT 1 FROM question_stimuli WHERE question_id = ? AND stimulus_id = ?",
            (question_id, stimulus_id),
        ).fetchone() if stimulus_id is not None else None
        if linked:
            continue
        position = conn.execute(
            "SELECT COALESCE(MAX(position), -1) + 1 FROM question_stimuli WHERE question_id = ?",
            (question_id,),
        ).fetchone()[0]
        links_to_add.append((question_id, stimulus_id if stimulus_id is not None else -1, position))

    if not apply:
        return {
            "mode": "dry-run",
            "stimulus_slug": stimulus["slug"],
            "existing_stimulus_id": stimulus_id,
            "question_ids": question_ids,
            "links_to_add": [qid for qid, _, _ in links_to_add],
            "would_create_stimulus": stimulus_id is None,
        }

    conn.execute("BEGIN IMMEDIATE")
    try:
        if stimulus_id is None:
            cursor = conn.execute(
                "INSERT INTO stimuli (slug, title, content, content_format, source_document_id, source_page) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (stimulus["slug"], stimulus["title"], stimulus["content"], stimulus["content_format"],
                 stimulus["source_document_id"], stimulus["source_page"]),
            )
            stimulus_id = cursor.lastrowid

        added = []
        for question_id in question_ids:
            already_linked = conn.execute(
                "SELECT 1 FROM question_stimuli WHERE question_id = ? AND stimulus_id = ?",
                (question_id, stimulus_id),
            ).fetchone()
            if already_linked:
                continue
            position = conn.execute(
                "SELECT COALESCE(MAX(position), -1) + 1 FROM question_stimuli WHERE question_id = ?",
                (question_id,),
            ).fetchone()[0]
            conn.execute(
                "INSERT INTO question_stimuli (question_id, stimulus_id, position) VALUES (?, ?, ?)",
                (question_id, stimulus_id, position),
            )
            added.append(question_id)

        integrity = conn.execute("PRAGMA integrity_check").fetchone()[0]
        foreign_key_errors = conn.execute("PRAGMA foreign_key_check").fetchall()
        if integrity != "ok" or foreign_key_errors:
            raise ImportErrorDetail(f"post-import checks failed: integrity={integrity}, foreign_keys={foreign_key_errors}")
        conn.commit()
    except Exception:
        conn.rollback()
        raise

    return {
        "mode": "applied",
        "stimulus_id": stimulus_id,
        "stimulus_slug": stimulus["slug"],
        "question_ids": question_ids,
        "links_added": added,
    }


def create_backup(db_path: Path) -> Path:
    backup_dir = db_path.parent / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup_path = backup_dir / f"before-q57-q58-stimulus-{timestamp}.sqlite"
    with sqlite3.connect(db_path) as source, sqlite3.connect(backup_path) as target:
        source.backup(target)
    return backup_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--apply", action="store_true", help="write changes; default is dry-run")
    args = parser.parse_args()
    payload = json.loads(args.input.read_text(encoding="utf-8"))

    backup_path = create_backup(args.db) if args.apply else None
    with sqlite3.connect(args.db) as conn:
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        result = import_stimulus(conn, payload, apply=args.apply)
    if backup_path:
        result["backup"] = str(backup_path)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
