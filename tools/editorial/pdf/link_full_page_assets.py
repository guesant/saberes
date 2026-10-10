#!/usr/bin/env python3
"""Create/apply a reversible, source-page-based image fallback for exam questions.

The plan only links an already-imported full-page PNG to canonical questions that
have no question asset at all. It never creates or duplicates question records.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import sqlite3
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DB = ROOT / ".local/content/content.sqlite"
TARGET_TITLES = (
    "Vestibular Unicamp 2025 — prova da 1ª fase, modelos Q e Z",
    "Vestibular Unicamp 2026 — prova da 1ª fase, modelos Q e X",
    "Simulado Unicamp 2026 — caderno Q/T (preparação para o Vestibular 2027)",
)
PAGE_FILE = re.compile(r"-page-(\d+)\.png$", re.IGNORECASE)


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def db_sha256(path: Path) -> str:
    return file_sha256(path)


def page_number(path: str) -> int | None:
    match = PAGE_FILE.search(path)
    return int(match.group(1)) if match else None


def existing_asset_path(asset_path: str) -> Path | None:
    candidates = (
        ROOT / "dist/data" / asset_path,
        ROOT / ".local/content/staging/offline-assets-2026-2027/data" / asset_path,
        ROOT / ".local/content/staging/unicamp-2027-v1/offline-assets-2026-2027/data" / asset_path,
    )
    return next((candidate for candidate in candidates if candidate.is_file()), None)


def build_plan(database: Path) -> dict[str, Any]:
    with sqlite3.connect(f"file:{database}?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row
        plan: dict[str, Any] = {
            "format": "full-page-question-assets/v1",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "database_before_sha256": db_sha256(database),
            "targets": [],
            "insertions": [],
            "unmapped_questions": [],
        }
        for title in TARGET_TITLES:
            docs = db.execute("SELECT id,title FROM source_documents WHERE title=?", (title,)).fetchall()
            if len(docs) != 1:
                raise ValueError(f"Expected exactly one source document for {title!r}; found {len(docs)}")
            doc = docs[0]
            assets_by_page: dict[int, sqlite3.Row] = {}
            for asset in db.execute(
                """SELECT id,path,alt_text,checksum,media_type FROM content_assets
                   WHERE source_document_id=? AND path LIKE '%/page-images/%'
                   ORDER BY path""", (doc["id"],)
            ):
                number = page_number(asset["path"])
                if number is not None:
                    assets_by_page[number] = asset

            occurrences = db.execute(
                """SELECT qo.id occurrence_id,qo.question_id,qo.number,qo.source_page,
                          qo.occurrence_key,q.slug
                   FROM question_occurrences qo JOIN questions q ON q.id=qo.question_id
                   WHERE qo.source_document_id=? ORDER BY qo.number,qo.id""", (doc["id"],)
            ).fetchall()
            plan["targets"].append({
                "source_document_id": doc["id"], "title": doc["title"],
                "question_occurrences": len(occurrences), "page_assets": len(assets_by_page),
            })
            for occurrence in occurrences:
                if occurrence["source_page"] is None:
                    plan["unmapped_questions"].append({
                        "source_document_id": doc["id"], "occurrence_key": occurrence["occurrence_key"],
                        "question_id": occurrence["question_id"], "reason": "source_page_missing",
                    })
                    continue
                asset = assets_by_page.get(occurrence["source_page"])
                if asset is None:
                    plan["unmapped_questions"].append({
                        "source_document_id": doc["id"], "occurrence_key": occurrence["occurrence_key"],
                        "question_id": occurrence["question_id"], "source_page": occurrence["source_page"],
                        "reason": "page_image_missing",
                    })
                    continue
                path = existing_asset_path(asset["path"])
                if path is None:
                    raise ValueError(f"Page image is missing from the local release/staging bundle: {asset['path']}")
                actual_hash = file_sha256(path)
                if asset["checksum"] and actual_hash.lower() != asset["checksum"].lower():
                    raise ValueError(f"Checksum mismatch for page image: {asset['path']}")
                has_question_asset = db.execute(
                    "SELECT 1 FROM question_assets WHERE question_id=? LIMIT 1",
                    (occurrence["question_id"],),
                ).fetchone()
                if has_question_asset:
                    continue
                already_planned = any(
                    item["question_id"] == occurrence["question_id"]
                    for item in plan["insertions"]
                )
                if already_planned:
                    continue
                position = db.execute(
                    "SELECT COALESCE(MAX(position),-1)+1 FROM question_assets WHERE question_id=?",
                    (occurrence["question_id"],),
                ).fetchone()[0]
                plan["insertions"].append({
                    "question_id": occurrence["question_id"], "asset_id": asset["id"],
                    "position": position, "source_document_id": doc["id"],
                    "occurrence_id": occurrence["occurrence_id"],
                    "occurrence_key": occurrence["occurrence_key"],
                    "question_slug": occurrence["slug"], "source_page": occurrence["source_page"],
                    "asset_path": asset["path"], "asset_sha256": actual_hash,
                    "alt_text": asset["alt_text"],
                    "reason": "Full-page source image fallback; it may include neighboring questions and is not a question crop.",
                })
        plan["summary"] = {
            "links_to_add": len(plan["insertions"]),
            "unmapped_questions": len(plan["unmapped_questions"]),
            "questions_skipped_because_they_already_have_an_asset": sum(
                item["question_occurrences"] for item in plan["targets"]
            ) - len(plan["insertions"]) - len(plan["unmapped_questions"]),
        }
        return plan


def apply_plan(database: Path, plan_path: Path, audit_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    if plan.get("format") != "full-page-question-assets/v1":
        raise ValueError("Unsupported plan format")
    if audit_path.exists():
        raise ValueError(f"Audit output already exists: {audit_path}")

    with sqlite3.connect(database) as db:
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA foreign_keys=ON")
        present = 0
        for item in plan["insertions"]:
            row = db.execute(
                "SELECT position FROM question_assets WHERE question_id=? AND asset_id=?",
                (item["question_id"], item["asset_id"]),
            ).fetchone()
            if row is not None:
                if row["position"] != item["position"]:
                    raise ValueError(f"Existing link conflicts with plan for question {item['question_id']}")
                present += 1
        current_hash = db_sha256(database)
        if current_hash != plan["database_before_sha256"] and present != len(plan["insertions"]):
            raise ValueError("Database changed since planning; regenerate the plan rather than applying stale positions")

        backup = ROOT / ".local/content/backups" / (
            "content.sqlite.before-page-assets-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ") + ".sqlite"
        )
        backup.parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(backup) as target:
            db.backup(target)

        added = 0
        db.execute("BEGIN IMMEDIATE")
        try:
            for item in plan["insertions"]:
                if db.execute(
                    "SELECT 1 FROM question_assets WHERE question_id=? AND asset_id=?",
                    (item["question_id"], item["asset_id"]),
                ).fetchone():
                    continue
                # Recheck that the full-page asset and question occur together in the cited source/page.
                valid = db.execute(
                    """SELECT 1 FROM question_occurrences qo JOIN content_assets ca
                         ON ca.source_document_id=qo.source_document_id
                       WHERE qo.id=? AND qo.question_id=? AND qo.source_document_id=?
                         AND qo.source_page=? AND ca.id=? AND ca.path=?
                         AND ca.path LIKE '%/page-images/%'""",
                    (item["occurrence_id"], item["question_id"], item["source_document_id"],
                     item["source_page"], item["asset_id"], item["asset_path"]),
                ).fetchone()
                if not valid:
                    raise ValueError(f"Source/page provenance no longer matches question {item['question_id']}")
                db.execute(
                    "INSERT INTO question_assets(question_id,asset_id,position) VALUES(?,?,?)",
                    (item["question_id"], item["asset_id"], item["position"]),
                )
                added += 1
            if db.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                raise ValueError("SQLite integrity_check failed")
            if db.execute("PRAGMA foreign_key_check").fetchall():
                raise ValueError("SQLite foreign_key_check failed")
            db.commit()
        except Exception:
            db.rollback()
            raise

    audit = {
        **plan,
        "applied": True,
        "links_added": added,
        "links_already_present": present,
        "backup": str(backup),
        "database_after_sha256": db_sha256(database),
        "finished_at": datetime.now(timezone.utc).isoformat(),
    }
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return audit


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DEFAULT_DB)
    parser.add_argument("--plan-out", type=Path, help="Create a dry-run plan JSON")
    parser.add_argument("--apply-plan", type=Path, help="Apply a previously generated plan")
    parser.add_argument("--audit-out", type=Path, help="Durable application journal (required with --apply-plan)")
    args = parser.parse_args()
    if args.apply_plan:
        if not args.audit_out:
            parser.error("--audit-out is required with --apply-plan")
        result = apply_plan(args.database, args.apply_plan, args.audit_out)
        print(json.dumps({"applied": result["applied"], "links_added": result["links_added"],
                          "links_already_present": result["links_already_present"],
                          "database_after_sha256": result["database_after_sha256"]}))
        return
    if not args.plan_out:
        parser.error("Provide --plan-out for a dry run or --apply-plan to apply")
    plan = build_plan(args.database)
    args.plan_out.parent.mkdir(parents=True, exist_ok=True)
    args.plan_out.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"plan": str(args.plan_out), **plan["summary"]}))


if __name__ == "__main__":
    main()
