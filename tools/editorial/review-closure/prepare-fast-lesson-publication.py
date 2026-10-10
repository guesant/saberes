#!/usr/bin/env python3
"""Prepare and optionally apply independently reviewed Unicamp lesson patches.

The source database is the base package, so unrelated published lessons are
never rolled back to an older JSON export. Every changed row is guarded by an
exact expected state and the editorial review artifacts are hashed in the
application journal.
"""
import argparse
import importlib.util
import json
from pathlib import Path
import sqlite3
import sys

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "tools/editorial/course"))
import import_study_path as study_path  # noqa: E402


def load_current_payload(db):
    topics = db.execute("""
        SELECT DISTINCT lt.curriculum_topic_id
        FROM lessons l JOIN lesson_topics lt ON lt.lesson_id=l.id
        JOIN curriculum_topics ct ON ct.id=lt.curriculum_topic_id
        JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id=ct.id
        JOIN stages st ON st.id=cts.stage_id JOIN editions e ON e.id=st.edition_id
        WHERE e.year=2027 AND e.admission_process_id=1 AND st.id=11
          AND l.slug LIKE 'unicamp-2027-%'
        ORDER BY lt.curriculum_topic_id
    """).fetchall()
    lessons = []
    for (topic_id,) in topics:
        records = db.execute("""
            SELECT l.id,l.slug,l.content_key,l.title,l.intro,l.objective,l.audience,
                   l.level,l.estimated_minutes,l.editorial_version,l.review_status,
                   ls.id section_id,ls.type,ls.pedagogical_role,ls.title section_title,
                   ls.content,ls.content_format,ls.position
            FROM lessons l JOIN lesson_topics lt ON lt.lesson_id=l.id
            JOIN lesson_sections ls ON ls.lesson_id=l.id
            WHERE lt.curriculum_topic_id=? ORDER BY ls.position
        """, (topic_id,)).fetchall()
        by_type = {row[12]: row for row in records}
        if set(by_type) != {"theory", "example", "summary"}:
            raise ValueError(f"Expected theory/example/summary lessons for topic {topic_id}")
        identities = {(row[9], row[10]) for row in records}
        if len(identities) != 1:
            raise ValueError(f"Split lesson version/status for topic {topic_id}")
        sections = [{
            "type": kind, "pedagogical_role": row[13], "title": row[14],
            "content": row[15], "content_format": row[16], "position": row[17],
        } for kind, row in by_type.items()]
        lesson_ids = {kind: row[0] for kind, row in by_type.items()}
        sources = sorted({item[0] for lesson_id in lesson_ids.values() for item in db.execute(
            "SELECT source_document_id FROM lesson_sources WHERE lesson_id=?", (lesson_id,))})
        canonical = [item[0] for item in db.execute("""
            SELECT canonical_topic_id FROM curriculum_topic_canonical_topics
            WHERE curriculum_topic_id=? AND review_status='published'
        """, (topic_id,))]
        row = by_type["theory"]
        lessons.append({
            "curriculum_topic_id": topic_id, "slug": row[1], "content_key": row[2],
            "title": row[3], "intro": row[4], "objective": row[5],
            "audience": row[6], "level": row[7], "estimated_minutes": row[8],
            "editorial_version": row[9], "review_status": row[10],
            "sections": sections, "source_document_ids": sources,
            "canonical_topic_ids": canonical, "_db_lesson_ids_by_type": lesson_ids,
            "_db_section_ids_by_type": {kind: row[11] for kind, row in by_type.items()},
        })
    return {"version": 1, "lessons": lessons}


def load_module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_manifest(database, packages, reviews, manifest_path):
    db = sqlite3.connect(f"file:{database}?mode=ro", uri=True)
    db.row_factory = sqlite3.Row
    payload = load_current_payload(db)
    decisions = []
    for package_path, review_path in zip(packages, reviews):
        package_path = package_path.resolve()
        review_path = review_path.resolve()
        package = json.loads(package_path.read_text())
        review = json.loads(review_path.read_text())
        if review.get("format") not in {
            "lesson-independent-second-review/v1", "lesson-audit-second-review/v1"
        }:
            raise ValueError(f"Unsupported second-review artifact: {review_path}")
        before = payload
        payload = study_path.apply_revisions(payload, package)
        revised = {lesson["curriculum_topic_id"]: lesson for lesson in payload["lessons"]}
        prior = {lesson["curriculum_topic_id"]: lesson for lesson in before["lessons"]}
        review_items = {
            item["curriculum_topic_id"]: item
            for item in review.get("items", review.get("decisions", []))
        }
        targets = {item["curriculum_topic_id"] for item in package["revisions"]}
        if targets != set(review_items):
            raise ValueError(f"Second-review coverage mismatch: {package_path.name}")
        first_review = {"schema": "lesson-audit-batch/v1", "decisions": []}
        second_review = {"format": "lesson-independent-second-review/v1", "items": []}
        for topic_id in sorted(targets):
            lesson = revised[topic_id]
            current = prior[topic_id]
            latest = review_items[topic_id]
            if latest.get("reviewed_version") != lesson["editorial_version"]:
                raise ValueError(f"Stale independent review for topic {topic_id}")
            if latest.get("decision") not in ("publish_candidate", "approve_as_is", "publish"):
                raise ValueError(f"Topic {topic_id} is not approved by independent review")
            first_review["decisions"].append({
                "curriculum_topic_id": topic_id,
                "current_version": lesson["editorial_version"],
                "decision": "approve_as_is", "proposed_status": "published",
                "source_document_ids": lesson.get("source_document_ids", []),
            })
            second_review["items"].append({
                **latest, "curriculum_topic_id": topic_id,
                "reviewed_version": lesson["editorial_version"],
                "decision": "publish_candidate", "recommended_status": "published",
            })
        payload = study_path.apply_lesson_audits(payload, [first_review, second_review])
        study_path.validate_payload(db, payload)
        audited = {lesson["curriculum_topic_id"]: lesson for lesson in payload["lessons"]}
        for topic_id in sorted(targets):
            old, new = prior[topic_id], audited[topic_id]
            for section_type in ("theory", "example", "summary"):
                lesson_id = old["_db_lesson_ids_by_type"][section_type]
                old_lesson = dict(db.execute(
                    "SELECT id,editorial_version,review_status,is_published FROM lessons WHERE id=?",
                    (lesson_id,),
                ).fetchone())
                changes = {"editorial_version": new["editorial_version"],
                           "review_status": new["review_status"]}
                if any(old_lesson[k] != value for k, value in changes.items()):
                    decisions.append({
                        "table": "lessons", "key": {"id": old_lesson["id"]},
                        "expected": {k: old_lesson[k] for k in changes}, "changes": changes,
                        "reason": "Publicar uma microlição corrigida após conferência editorial e segunda revisão independente; os limites de escopo permanecem explícitos.",
                        "evidence": [
                            {"locator": package_path.relative_to(ROOT).as_posix(),
                             "detail": f"Patch editorial versionado para o tópico curricular {topic_id}."},
                            {"locator": review_path.relative_to(ROOT).as_posix(),
                             "detail": f"Segunda revisão independente aprovou a versão {new['editorial_version']}."},
                            {"locator": "sqlite://source_documents/148",
                             "detail": "Programa oficial da primeira fase de 2027, usado para delimitar o escopo curricular."},
                        ],
                    })
            new_sections = {section["type"]: section for section in new["sections"]}
            for section_type in ("theory", "example", "summary"):
                section_id = old["_db_section_ids_by_type"][section_type]
                old_section = db.execute(
                    "SELECT id,type,pedagogical_role,title,content,content_format FROM lesson_sections WHERE id=?",
                    (section_id,),
                ).fetchone()
                existing = dict(old_section)
                new_section = new_sections[section_type]
                changes = {field: new_section[field] for field in
                           ("type", "pedagogical_role", "title", "content", "content_format")
                           if existing[field] != new_section.get(field)}
                if changes:
                    decisions.append({
                        "table": "lesson_sections", "key": {"id": existing["id"]},
                        "expected": {field: existing[field] for field in changes},
                        "changes": changes,
                        "reason": f"Aplicar conteúdo revisado da seção {section_type}, versão {new['editorial_version']}, do tópico {topic_id}.",
                        "evidence": [
                            {"locator": package_path.relative_to(ROOT).as_posix(),
                             "detail": f"Texto revisado para a seção {section_type}."},
                            {"locator": review_path.relative_to(ROOT).as_posix(),
                             "detail": f"Versão {new['editorial_version']} conferida por segunda revisão independente."},
                        ],
                    })
    db.close()
    manifest = {
        "format": "editorial-review-decisions/v1",
        "scope": "Unicamp 2027 primeira fase: microlições corrigidas e independentemente revisadas",
        "decisions": decisions,
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    return len(decisions)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=ROOT / ".local/content/content.sqlite")
    parser.add_argument("--humanities", type=Path, required=True)
    parser.add_argument("--humanities-review", type=Path, required=True)
    parser.add_argument("--sciences", type=Path, required=True)
    parser.add_argument("--sciences-review", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--audit", type=Path, required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    count = make_manifest(args.database, [args.humanities, args.sciences],
                          [args.humanities_review, args.sciences_review], args.manifest)
    runner = load_module(ROOT / "tools/editorial/apply_review_decisions.py", "review_decisions")
    result = runner.execute(args.database, [args.manifest], apply=args.apply,
                            output=args.audit if args.apply else None)
    print(json.dumps({"generated_decisions": count, "applied": args.apply,
                      "application": result}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
