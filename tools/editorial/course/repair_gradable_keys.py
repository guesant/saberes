#!/usr/bin/env python3
"""Repair a missing technical flag, never an answer or editorial approval.

Limited to the representative 2026 booklet and already approved historical
fallbacks. Requires a definitive sourced single-choice key and an exact matching
option reference. Cancelled, provisional and unpublished items are excluded.
"""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]


def candidates(db):
    return [dict(row) for row in db.execute("""
        SELECT ak.id,ak.question_id,ak.occurrence_id,ak.version,ak.answer_value,
               ak.source_document_id,e.year,pv.code
        FROM canonical_answer_keys ak
        JOIN question_occurrences qo ON qo.id=ak.occurrence_id AND qo.question_id=ak.question_id
        JOIN questions q ON q.id=ak.question_id
        JOIN paper_versions pv ON pv.id=qo.paper_version_id
        JOIN papers p ON p.id=qo.paper_id JOIN stages st ON st.id=p.stage_id
        JOIN editions e ON e.id=st.edition_id
        JOIN source_documents sd ON sd.id=ak.source_document_id
        WHERE ((e.year=2026 AND pv.code='QX') OR (e.year=2023 AND pv.code='QZ'))
          AND e.admission_process_id=1 AND q.status='published' AND qo.status='published'
          AND q.type IN ('single_choice','multiple_choice') AND ak.answer_type='single_choice'
          AND ak.status='definitive' AND ak.is_automatically_gradable=0
          AND ak.question_part_id IS NULL
          AND ak.id=(SELECT latest.id FROM canonical_answer_keys latest
                     WHERE latest.question_id=ak.question_id AND latest.occurrence_id=qo.id
                     AND latest.question_part_id IS NULL ORDER BY latest.version DESC,latest.id DESC LIMIT 1)
          AND (SELECT COUNT(*) FROM question_options opt WHERE opt.question_id=q.id)=4
          AND (SELECT COUNT(*) FROM question_options opt WHERE opt.question_id=q.id AND opt.code IN ('A','B','C','D'))=4
          AND (SELECT COUNT(*) FROM canonical_answer_key_options ako WHERE ako.answer_key_id=ak.id)=1
          AND EXISTS (SELECT 1 FROM canonical_answer_key_options ako
                      JOIN question_options opt ON opt.id=ako.question_option_id
                      WHERE ako.answer_key_id=ak.id AND opt.question_id=q.id AND opt.code=ak.answer_value)
        ORDER BY ak.id
    """)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=ROOT / ".local/content/content.sqlite")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    db = sqlite3.connect(str(args.database) if args.apply else f"file:{args.database}?mode=ro", uri=not args.apply)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys=ON")
    items = candidates(db)
    report = {"operation": "repair-missing-single-choice-gradable-flag", "applied": args.apply,
              "answer_values_changed": 0, "editorial_statuses_changed": 0, "count": len(items), "keys": items}
    if args.apply and items:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        backup = args.database.parent / "backups" / f"before-gradable-flag-{stamp}.sqlite"
        backup.parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(backup) as target:
            db.backup(target)
        with db:
            db.executemany("UPDATE canonical_answer_keys SET is_automatically_gradable=1 WHERE id=? AND is_automatically_gradable=0", [(item["id"],) for item in items])
            if db.execute("PRAGMA foreign_key_check").fetchall():
                raise ValueError("Foreign key check failed")
        report["backup"] = str(backup)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    db.close()


if __name__ == "__main__":
    main()
