#!/usr/bin/env python3
"""Idempotently assemble an original, source-linked local preparation course.

Review lessons are visible for consultation, never silently promoted. Practice
requires an approved question, occurrence, and topic relationship.
"""
import argparse
from collections import defaultdict, deque
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import sqlite3
import re
from copy import deepcopy

ROOT = Path(__file__).resolve().parents[3]
SLUG = "unicamp-2027-primeira-fase"


def report_path(path):
    resolved = Path(path).resolve()
    try:
        return resolved.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def rows(db, sql, params=()):
    return [dict(row) for row in db.execute(sql, params)]


def validate_payload(db, payload):
    if payload.get("version") != 1:
        raise ValueError("Unsupported lesson package version")
    expected = {row["id"] for row in rows(db, """
        SELECT ct.id FROM curriculum_topics ct
        JOIN curriculum_topic_stages st ON st.curriculum_topic_id=ct.id
        JOIN stages s ON s.id=st.stage_id JOIN editions e ON e.id=s.edition_id
        WHERE e.year=2027 AND e.admission_process_id=1 AND s.id=11
        AND st.review_status='published'
    """)}
    lessons = payload.get("lessons", [])
    actual = [lesson["curriculum_topic_id"] for lesson in lessons]
    if len(actual) != len(set(actual)) or set(actual) != expected:
        raise ValueError(f"Exact official coverage required; missing={expected-set(actual)}, extra={set(actual)-expected}")
    for lesson in lessons:
        if lesson.get("review_status") not in ("draft", "review", "published"):
            raise ValueError("Explicit editorial status required")
        if len(lesson.get("sections", [])) < 3:
            raise ValueError("Concept, worked example, and review content required")
        if any(len(section.get("content", "").strip()) < 40 for section in lesson["sections"]):
            raise ValueError("Empty/template lesson section")
        if not lesson.get("source_document_ids"):
            raise ValueError("Source provenance required")
        for source_id in lesson["source_document_ids"]:
            if not db.execute("SELECT 1 FROM source_documents WHERE id=?", (source_id,)).fetchone():
                raise ValueError(f"Unknown source {source_id}")
        mapped = {row[0] for row in db.execute("""
            SELECT canonical_topic_id FROM curriculum_topic_canonical_topics
            WHERE curriculum_topic_id=? AND review_status='published'
        """, (lesson["curriculum_topic_id"],))}
        if not set(lesson.get("canonical_topic_ids", [])).issubset(mapped):
            raise ValueError("Lesson canonical targets must use verified program associations")


def apply_revisions(payload, revisions):
    """Apply explicit, versioned section edits without mutating the base package."""
    if revisions.get("version") != 1:
        raise ValueError("Unsupported lesson revision package version")
    merged = deepcopy(payload)
    lessons = {item["curriculum_topic_id"]: item for item in merged.get("lessons", [])}
    seen_versions = {}
    for revision in [*revisions.get("revisions", []), *revisions.get("followups", [])]:
        topic_id = revision.get("curriculum_topic_id")
        lesson = lessons.get(topic_id)
        if lesson is None:
            raise ValueError(f"Revision targets unknown curriculum topic {topic_id}")
        expected_version = revision.get("supersedes_version")
        if topic_id in seen_versions:
            if expected_version != lesson.get("editorial_version"):
                raise ValueError(f"Sequential revision for topic {topic_id} must supersede {lesson.get('editorial_version')}")
        elif expected_version is not None and expected_version != lesson.get("editorial_version"):
            raise ValueError(f"Stale base revision for topic {topic_id}: expected {lesson.get('editorial_version')}")
        if not revision.get("editorial_version"):
            raise ValueError(f"Revision version is required for topic {topic_id}")
        lesson["editorial_version"] = revision["editorial_version"]
        seen_versions[topic_id] = lesson["editorial_version"]
        if "estimated_minutes" in revision:
            lesson["estimated_minutes"] = revision["estimated_minutes"]
        if "review_status" in revision:
            lesson["review_status"] = revision["review_status"]
        lesson["source_document_ids"] = sorted(set(lesson.get("source_document_ids", [])) |
                                                set(revision.get("source_document_ids", [])))
        sections = {section["type"]: section for section in lesson.get("sections", [])}
        for update in revision.get("sections", []):
            section = sections.get(update.get("type"))
            if section is None:
                raise ValueError(f"Unknown section type {update.get('type')} for topic {topic_id}")
            if "replace_text" in update:
                source_text = update["replace_text"]
                if source_text not in section["content"]:
                    raise ValueError(f"Revision source text not found for topic {topic_id}/{update.get('type')}")
                section["content"] = section["content"].replace(source_text, update.get("replacement", ""), 1)
            elif update.get("append"):
                section["content"] = section["content"].rstrip() + "\n\n" + update["append"].strip()
            elif "content" in update:
                section["content"] = update["content"]
            if not section.get("content", "").strip():
                raise ValueError(f"Empty revision content for topic {topic_id}/{update.get('type')}")
            if "title" in update:
                section["title"] = update["title"]
            if "pedagogical_role" in update:
                section["pedagogical_role"] = update["pedagogical_role"]
    return merged


def apply_lesson_audits(payload, audit_batches):
    """Apply explicit editorial decisions from independently reviewed batches."""
    def next_patch_version(version):
        parts = version.split(".")
        if len(parts) != 3 or not all(part.isdigit() for part in parts):
            raise ValueError(f"Cannot automatically version non-semantic editorial version {version}")
        parts[2] = str(int(parts[2]) + 1)
        return ".".join(parts)

    merged = deepcopy(payload)
    lessons = {item["curriculum_topic_id"]: item for item in merged.get("lessons", [])}
    audited_topics = {}
    for batch in audit_batches:
        batch_format = batch.get("schema", batch.get("format"))
        first_review_formats = {"lesson-audit-batch/v1"}
        second_review_formats = {
            "lesson-independent-second-review/v1",
            "lesson-audit-second-review/v1",
            "saberes-unicamp-2027-sciences-second-editorial-review-v1",
        }
        correction_formats = {"lesson-post-review-corrections/v1"}
        supported_formats = first_review_formats | second_review_formats | correction_formats
        if batch_format not in supported_formats:
            raise ValueError("Unsupported lesson audit batch")
        is_second_review = batch_format in second_review_formats
        is_correction = batch_format in correction_formats
        decisions = batch.get("decisions", batch.get("items", []))
        if not decisions:
            raise ValueError("Lesson audit batch contains no decisions")
        seen_in_batch = set()
        for decision in decisions:
            topic_id = decision.get("curriculum_topic_id")
            if topic_id not in lessons:
                raise ValueError(f"Lesson audit targets unknown curriculum topic {topic_id}")
            if topic_id in seen_in_batch:
                raise ValueError(f"Duplicate decisions in one audit batch for topic {topic_id}")
            seen_in_batch.add(topic_id)
            if is_second_review and topic_id not in audited_topics:
                raise ValueError(f"Independent second review for topic {topic_id} has no applied first-review proposal")
            if is_correction and topic_id not in audited_topics:
                raise ValueError(f"Correction for topic {topic_id} requires a prior first and second review")
            if is_correction and audited_topics[topic_id].get("correction_pending_review"):
                raise ValueError(f"Correction for topic {topic_id} needs an independent review before another correction")
            if is_correction and not audited_topics[topic_id].get("second_review"):
                raise ValueError(f"Correction for topic {topic_id} requires a prior first and second review")
            if not is_second_review and topic_id in audited_topics:
                if not is_correction:
                    raise ValueError(f"Multiple first-review decisions for topic {topic_id}")
                if audited_topics[topic_id].get("correction_pending_review"):
                    raise ValueError(f"Correction for topic {topic_id} needs an independent review before another correction")
            lesson = lessons[topic_id]
            current = decision.get("current") or {}
            latest = decision.get("latest_proposal") or {}
            if is_second_review:
                reviewed_version = decision.get("reviewed_version")
                if reviewed_version:
                    version_tokens = set(re.findall(
                        r"(?<!\d)\d+\.\d+\.\d+(?!\d)", str(reviewed_version)))
                    if version_tokens and lesson.get("editorial_version") not in version_tokens:
                        raise ValueError(
                            f"Second review for topic {topic_id} does not cover package version "
                            f"{lesson.get('editorial_version')}: {reviewed_version}"
                        )
            else:
                expected_version = (latest.get("editorial_version") or decision.get("current_version")
                                   or current.get("editorial_version"))
                if expected_version and lesson.get("editorial_version") != expected_version:
                    raise ValueError(
                        f"Stale lesson audit for topic {topic_id}: "
                        f"expected {expected_version}, package has {lesson.get('editorial_version')}"
                    )

            status = (decision.get("proposed_status") or latest.get("review_status")
                      or decision.get("recommended_status") or current.get("review_status"))
            action = decision.get("decision")
            if is_second_review:
                if action in ("publish", "publish_candidate"):
                    action = "approve_as_is"
                elif action in ("revise", "revise/hold"):
                    action = "hold"
                if status is None:
                    status = "published" if action == "approve_as_is" else "review"
            if is_correction:
                if action != "revise" or decision.get("proposed_status") != "review":
                    raise ValueError(f"Post-review correction for topic {topic_id} must remain in review")
                expected_version = decision.get("current_version")
                if expected_version and lesson.get("editorial_version") != expected_version:
                    raise ValueError(
                        f"Stale correction for topic {topic_id}: expected {expected_version}, "
                        f"package has {lesson.get('editorial_version')}"
                    )
                version = decision.get("proposed_version")
                proposed = decision.get("proposed_sections")
                if not version or not isinstance(proposed, list):
                    raise ValueError(f"Correction for topic {topic_id} needs a version and complete replacement sections")
                by_type = {section.get("type"): section for section in proposed}
                if set(by_type) != {"theory", "example", "summary"} or len(by_type) != len(proposed):
                    raise ValueError(f"Correction for topic {topic_id} must replace theory, example and summary exactly once")
                for section in proposed:
                    if not section.get("title") or len(section.get("content", "").strip()) < 40:
                        raise ValueError(f"Incomplete corrected {section.get('type')} section for topic {topic_id}")
                lesson["sections"] = proposed
                lesson["editorial_version"] = version
                lesson["review_status"] = "review"
                lesson["source_document_ids"] = sorted(set(lesson.get("source_document_ids", [])) |
                                                        set(decision.get("source_document_ids", [])))
                audited_topics[topic_id].update({
                    "correction": True,
                    "correction_pending_review": True,
                    "second_review": False,
                    "version": version,
                })
                continue
            if action in ("approve_as_is", "publish_candidate"):
                status = status or "published"
                if status != "published":
                    raise ValueError(f"Approval for topic {topic_id} must explicitly set published")
                lesson["review_status"] = "published"
            elif action in ("revise", "hold"):
                if status not in ("draft", "review", "published"):
                    status = "review"
                if action == "revise":
                    version = (decision.get("proposed_version") or latest.get("editorial_version")
                               or current.get("editorial_version"))
                    if not version:
                        raise ValueError(f"A revision for topic {topic_id} needs an editorial version")
                    proposed = decision.get("proposed_sections")
                    if proposed is None:
                        replacements = decision.get("replacement_sections")
                        if isinstance(replacements, dict):
                            old_sections = {section["type"]: section for section in lesson.get("sections", [])}
                            proposed = []
                            for section_type in ("theory", "example", "summary"):
                                content = replacements.get(section_type)
                                if not isinstance(content, str):
                                    raise ValueError(f"Missing {section_type} replacement for topic {topic_id}")
                                previous = old_sections.get(section_type, {})
                                proposed.append({
                                    "type": section_type,
                                    "title": previous.get("title", section_type.title()),
                                    "content": content,
                                    "content_format": previous.get("content_format", "markdown"),
                                    "pedagogical_role": previous.get("pedagogical_role", "formalization"),
                                })
                    if not isinstance(proposed, list):
                        raise ValueError(f"Revision sections must be a list for topic {topic_id}")
                    by_type = {section.get("type"): section for section in proposed}
                    if set(by_type) != {"theory", "example", "summary"} or len(by_type) != len(proposed):
                        raise ValueError(f"Revision for topic {topic_id} must replace theory, example and summary exactly once")
                    for section in proposed:
                        if not section.get("title") or len(section.get("content", "").strip()) < 40:
                            raise ValueError(f"Incomplete {section.get('type')} section for topic {topic_id}")
                    if version == lesson.get("editorial_version"):
                        version = next_patch_version(version)
                    lesson["sections"] = proposed
                    lesson["editorial_version"] = version
                lesson["review_status"] = status
            else:
                raise ValueError(f"Unknown editorial decision for topic {topic_id}: {action}")

            evidence_ids = set(decision.get("source_document_ids", []))
            evidence_ids.update(latest.get("source_document_ids", []))
            for evidence in decision.get("evidence", []):
                source_id = evidence.get("source_document_id")
                if source_id is not None:
                    evidence_ids.add(source_id)
            lesson["source_document_ids"] = sorted(set(lesson.get("source_document_ids", [])) | evidence_ids)
            previous = audited_topics.get(topic_id, {})
            audited_topics[topic_id] = {**previous, "second_review": is_second_review,
                                        "version": lesson.get("editorial_version")}
            if is_second_review:
                audited_topics[topic_id]["correction_pending_review"] = False
    return merged


def equivalent_members(db):
    graph = defaultdict(set)
    for row in rows(db, "SELECT question_id,related_question_id FROM canonical_question_relations WHERE relation_type='equivalent'"):
        a, b = row["question_id"], row["related_question_id"]
        graph[a].add(b)
        graph[b].add(a)
    lookup = {}
    for node in graph:
        if node in lookup:
            continue
        queue, members = deque([node]), set()
        while queue:
            current = queue.popleft()
            if current in members:
                continue
            members.add(current)
            queue.extend(graph[current] - members)
        for member in members:
            lookup[member] = members
    return lookup


def practice_candidates(db):
    # One representative booklet per exam. Earlier approved content is only a
    # fallback for gaps; drafts from 2025 cannot enter the course practice.
    return rows(db, """
        SELECT qo.id,qo.question_id,qo.number,pv.code,e.year,
               qo.source_document_id,qo.source_page
        FROM question_occurrences qo JOIN questions q ON q.id=qo.question_id
        JOIN papers p ON p.id=qo.paper_id JOIN stages st ON st.id=p.stage_id
        JOIN editions e ON e.id=st.edition_id JOIN paper_versions pv ON pv.id=qo.paper_version_id
        WHERE qo.status='published' AND q.status='published'
        AND e.admission_process_id=1
        AND ((e.year=2027 AND pv.code='QT') OR (e.year=2026 AND pv.code='QX')
             OR (e.year=2025 AND pv.code='QZ') OR (e.year=2023 AND pv.code='QZ'))
        AND (SELECT ak.status FROM canonical_answer_keys ak WHERE ak.question_id=q.id
          AND (ak.occurrence_id=qo.id OR ak.occurrence_id IS NULL)
          ORDER BY (ak.occurrence_id IS NOT NULL) DESC,ak.version DESC,ak.id DESC LIMIT 1)='definitive'
        AND (SELECT ak.is_automatically_gradable FROM canonical_answer_keys ak WHERE ak.question_id=q.id
          AND (ak.occurrence_id=qo.id OR ak.occurrence_id IS NULL)
          ORDER BY (ak.occurrence_id IS NOT NULL) DESC,ak.version DESC,ak.id DESC LIMIT 1)=1
        ORDER BY CASE e.year WHEN 2027 THEN 0 WHEN 2026 THEN 1 WHEN 2025 THEN 2 ELSE 3 END,qo.number
    """)


def topic_practice_matches(db, topic_id, candidates, equivalents):
    topic_priority = {}
    for row in rows(db, """
        SELECT qt.question_id,
          MIN(CASE qt.relation_type WHEN 'primary' THEN 0 ELSE 1 END) AS relation_priority
        FROM question_canonical_topics qt
        JOIN curriculum_topic_canonical_topics ct ON ct.canonical_topic_id=qt.canonical_topic_id
        WHERE ct.curriculum_topic_id=?
          AND ct.review_status='published' AND ct.relation_type IN ('primary','secondary')
          AND qt.review_status='published' AND qt.relation_type IN ('primary','secondary')
        GROUP BY qt.question_id
    """, (topic_id,)):
        for question_id in equivalents.get(row["question_id"], {row["question_id"]}):
            topic_priority[question_id] = min(topic_priority.get(question_id, 2), row["relation_priority"])
    matching = [item for item in candidates if item["question_id"] in topic_priority]
    recent = [item for item in matching if item["year"] in (2025, 2026, 2027)]
    if recent:
        matching = recent
    matching.sort(key=lambda item: topic_priority[item["question_id"]])
    unique = []
    seen_families = set()
    for item in matching:
        family = min(equivalents.get(item["question_id"], {item["question_id"]}))
        if family in seen_families:
            continue
        seen_families.add(family)
        unique.append({**item, "relation_priority": topic_priority[item["question_id"]]})
    return unique


def select_practices(db, topic_id, candidates, equivalents, used_families=None,
                     preferred=None, include_all_approved=False):
    used = used_families or set()
    matching = topic_practice_matches(db, topic_id, candidates, equivalents)
    chosen = None
    if preferred:
        chosen = next((item for item in candidates
                       if item["year"] == preferred["year"]
                       and item["code"] == preferred["code"]
                       and item["number"] == preferred["number"]), None)
        if chosen is None:
            raise ValueError(f"Curated practice selection is not an approved candidate: {topic_id}/{preferred}")
        if chosen["question_id"] not in {item["question_id"] for item in matching}:
            raise ValueError(f"Curated practice selection lacks a published topic relation: {topic_id}/{preferred}")
        if preferred.get("source_page") is not None and chosen["source_page"] != preferred["source_page"]:
            raise ValueError(f"Curated practice source page changed: {topic_id}/{preferred}")
        if preferred.get("source_document_id") is not None and chosen["source_document_id"] != preferred["source_document_id"]:
            raise ValueError(f"Curated practice source document changed: {topic_id}/{preferred}")
        family = min(equivalents.get(chosen["question_id"], {chosen["question_id"]}))
        if family in used and not include_all_approved:
            raise ValueError(f"Curated practice selection duplicates an earlier question family: {topic_id}/{preferred}")
        chosen = {**chosen, "editorial_selection_reason": preferred["reason"]}
    if not matching:
        return []
    if not include_all_approved:
        if chosen:
            return [chosen]
        available = next((item for item in matching
                          if min(equivalents.get(item["question_id"], {item["question_id"]})) not in used),
                         matching[0])
        return [available]

    if chosen is None:
        chosen = next((item for item in matching
                       if min(equivalents.get(item["question_id"], {item["question_id"]})) not in used),
                      matching[0])
    ordered = [chosen]
    chosen_family = min(equivalents.get(chosen["question_id"], {chosen["question_id"]}))
    ordered.extend(item for item in matching
                   if item["question_id"] != chosen["question_id"]
                   and min(equivalents.get(item["question_id"], {item["question_id"]})) != chosen_family)
    return ordered


def select_practice(db, topic_id, candidates, equivalents, used_families=None, preferred=None):
    """Compatibility helper for callers that need the first practice item only."""
    selected = select_practices(db, topic_id, candidates, equivalents, used_families, preferred)
    return selected[0] if selected else None


def upsert(db, table, identity, values):
    where = " AND ".join(f"{key}=?" for key in identity)
    existing = db.execute(f"SELECT id FROM {table} WHERE {where}", tuple(identity.values())).fetchone()
    if existing:
        assignments = ",".join(f"{key}=?" for key in values)
        db.execute(f"UPDATE {table} SET {assignments} WHERE id=?", (*values.values(), existing[0]))
        return existing[0]
    columns = {**identity, **values}
    return db.execute(f"INSERT INTO {table} ({','.join(columns)}) VALUES ({','.join('?' for _ in columns)})", tuple(columns.values())).lastrowid


def lesson_review_description(status):
    return "Microaula introdutória original revisada." if status == "published" else "Conteúdo original em revisão editorial."


def assemble(db, payload, apply=False, practice_selections=None, practice_mode="curated"):
    if practice_mode not in ("curated", "all_approved_representatives"):
        raise ValueError(f"Unsupported practice selection mode: {practice_mode}")
    validate_payload(db, payload)
    equivalents = equivalent_members(db)
    candidates = practice_candidates(db)
    practice_selections = practice_selections or {}
    package = {item["curriculum_topic_id"]: item for item in payload["lessons"]}
    topics = rows(db, "SELECT id,label,topic_id,position FROM curriculum_topics WHERE curriculum_id=10 ORDER BY position,id")
    lessons_approved = all(item["review_status"] == "published" for item in package.values())
    course_review_description = "Microaulas introdutórias originais revisadas; não esgotam cada tema." if lessons_approved else "Há aulas originais em revisão editorial."
    report = {"course_slug": SLUG, "topics": len(topics), "lessons": 0, "practice_topics": 0,
              "gaps": [], "editorial_status": "published" if lessons_approved else "review", "booklets": ["2027/QT", "2026/QX", "2025/QZ"], "modules": []}
    if apply:
        course_id = upsert(db, "learning_courses", {"slug": SLUG}, {
            "title": "Unicamp 2027 — primeira fase: roteiro de estudo",
            "description": f"Tópicos oficiais. Conceito, exemplo, prática e revisão. Ordem recomendada, não obrigatória. {course_review_description} Questões de treino somente aprovadas.",
            "course_type": "specific", "domain": "exam_prep", "level": "ensino_medio", "is_published": 1})
        db.execute("INSERT OR IGNORE INTO learning_course_targets (learning_course_id,admission_process_id,edition_id) VALUES (?,1,11)", (course_id,))
    used_families = set()
    used_primary_families = set()
    for position, topic in enumerate(topics):
        lesson = package[topic["id"]]
        practices = select_practices(
            db, topic["id"], candidates, equivalents, used_primary_families,
            practice_selections.get(topic["id"]),
            include_all_approved=practice_mode == "all_approved_representatives",
        )
        if practices:
            report["practice_topics"] += 1
            for practice in practices:
                family = min(equivalents.get(practice["question_id"], {practice["question_id"]}))
                practice["shared"] = family in used_families
                used_families.add(family)
            used_primary_families.add(
                min(equivalents.get(practices[0]["question_id"], {practices[0]["question_id"]}))
            )
        else:
            report["gaps"].append({"curriculum_topic_id": topic["id"], "label": topic["label"], "reason": "No approved question in the representative booklet pool"})
        sections = lesson["sections"]
        concept = [s for s in sections if s.get("type") == "theory"]
        examples = [s for s in sections if s.get("type") == "example"]
        review = [s for s in sections if s not in concept and s not in examples]
        if not concept or not examples or not review:
            raise ValueError(f"Missing concept/example/review for {topic['id']}")
        report["lessons"] += 3
        report["modules"].append({
            "topic_id": topic["id"],
            "practice": practices[0] if practices else None,
            "practices": practices,
            "practice_selection_reason": practices[0].get("editorial_selection_reason") if practices else None,
        })
        if not apply:
            continue
        module_id = upsert(db, "learning_course_modules", {"learning_course_id": course_id, "slug": f"topico-{topic['id']}"}, {
            "title": topic["label"], "description": "Conceito → exemplo → questões → revisão." + (" Prática ainda indisponível: lacuna explícita." if not practices else ""), "position": position})
        db.execute("INSERT OR IGNORE INTO learning_course_topics (learning_course_id,topic_id) VALUES (?,?)", (course_id, topic["topic_id"]))
        for step, role, selected in [(0, "conceito", concept), (1, "exemplo", examples)]:
            title = {"conceito": "Entender o conceito", "exemplo": "Acompanhar um exemplo", "revisao": "Revisar erros e consolidar"}[role]
            lesson_id = upsert(db, "lessons", {"slug": f"unicamp-2027-{topic['id']}-{role}"}, {
                "content_key": f"lesson:unicamp-2027-{topic['id']}-{role}", "title": f"{topic['label']} — {title}",
                "intro": f"{lesson_review_description(lesson['review_status'])} Não é uma resolução oficial da Comvest.",
                "objective": title, "estimated_minutes": max(2, int(lesson.get("estimated_minutes", 9)) // 3),
                "editorial_version": lesson.get("editorial_version", "1.0.0"), "review_status": lesson["review_status"], "is_published": 1})
            for section_position, section in enumerate(selected):
                upsert(db, "lesson_sections", {"lesson_id": lesson_id, "position": section_position}, {
                    "type": section["type"], "title": section["title"], "content": section["content"],
                    "content_format": "markdown", "pedagogical_role": section.get("pedagogical_role", "formalization"), "blocks_json": "[]"})
            # Only these deterministic, importer-owned lessons are updated.
            db.execute("DELETE FROM lesson_sections WHERE lesson_id=? AND position>=?", (lesson_id, len(selected)))
            for source_id in lesson["source_document_ids"]:
                db.execute("INSERT OR IGNORE INTO lesson_sources (lesson_id,source_document_id) VALUES (?,?)", (lesson_id, source_id))
            db.execute("INSERT OR IGNORE INTO lesson_topics (lesson_id,curriculum_topic_id) VALUES (?,?)", (lesson_id, topic["id"]))
            for canonical_id in lesson.get("canonical_topic_ids", []):
                for legacy in db.execute("SELECT topic_id FROM canonical_topic_legacy_topics WHERE canonical_topic_id=?", (canonical_id,)).fetchall():
                    db.execute("INSERT OR IGNORE INTO lesson_topics (lesson_id,topic_id) VALUES (?,?)", (lesson_id, legacy[0]))
            upsert(db, "learning_course_items", {"module_id": module_id, "position": step}, {
                "item_type": "lesson", "title": title, "description": lesson_review_description(lesson["review_status"]),
                "lesson_id": lesson_id, "question_occurrence_id": None, "question_id": None, "assessment_set_id": None,
                "duration_minutes": max(2, int(lesson.get("estimated_minutes", 9)) // 3), "is_required": 1})
        if practices:
            for practice_position, practice in enumerate(practices, start=2):
                upsert(db, "learning_course_items", {"module_id": module_id, "position": practice_position}, {
                    "item_type": "practice", "title": f"Praticar questão {practice_position - 1}", "description": f"Unicamp {practice['year']} · {practice['code']} · questão {practice['number']}. Associação editorial aprovada; responder não implica domínio." + (f" Seleção editorial: {practice['editorial_selection_reason']}" if practice.get("editorial_selection_reason") else "") + (" Questão ligada a mais de um tópico; ao respondê-la, esta etapa também conta nos demais." if practice["shared"] else ""),
                    "question_occurrence_id": practice["id"], "lesson_id": None, "question_id": None, "assessment_set_id": None,
                    "duration_minutes": 5, "is_required": 1})
        else:
            # Keep the four-step roadmap coherent without leaving a stale,
            # unrelated practice question in the user's course.
            gap_slug = f"unicamp-2027-{topic['id']}-practice-gap"
            gap_lesson_id = upsert(db, "lessons", {"slug": gap_slug}, {
                "content_key": f"lesson:{gap_slug}", "title": f"{topic['label']} — prática em busca",
                "intro": "Nenhuma questão com associação específica aprovada foi localizada no acervo selecionado.",
                "objective": "Registrar a lacuna sem atribuir uma questão por semelhança incidental.",
                "estimated_minutes": 1, "editorial_version": "1.0.0", "review_status": "review", "is_published": 1})
            upsert(db, "lesson_sections", {"lesson_id": gap_lesson_id, "position": 0}, {
                "type": "summary", "title": "Lacuna editorial explícita",
                "content": "Esta etapa será substituída por uma questão quando houver um item cuja resolução realmente exercite este tópico. Questões de outra edição ou banca podem ser adicionadas após revisão de pertinência e fonte.",
                "content_format": "markdown", "pedagogical_role": "review", "blocks_json": "[]"})
            db.execute("DELETE FROM lesson_sections WHERE lesson_id=? AND position>=1", (gap_lesson_id,))
            db.execute("INSERT OR IGNORE INTO lesson_topics (lesson_id,curriculum_topic_id) VALUES (?,?)", (gap_lesson_id, topic["id"]))
            upsert(db, "learning_course_items", {"module_id": module_id, "position": 2}, {
                "item_type": "lesson", "title": "Prática ainda não validada",
                "description": "Lacuna editorial explícita; nenhuma questão não relacionada será apresentada como prática.",
                "question_occurrence_id": None, "lesson_id": gap_lesson_id, "question_id": None, "assessment_set_id": None,
                "duration_minutes": 1, "is_required": 0})
        review_position = 2 + len(practices) if practices else 3
        review_title = "Revisar erros e consolidar"
        review_lesson_id = upsert(db, "lessons", {"slug": f"unicamp-2027-{topic['id']}-revisao"}, {
            "content_key": f"lesson:unicamp-2027-{topic['id']}-revisao", "title": f"{topic['label']} — {review_title}",
            "intro": f"{lesson_review_description(lesson['review_status'])} Não é uma resolução oficial da Comvest.",
            "objective": review_title, "estimated_minutes": max(2, int(lesson.get("estimated_minutes", 9)) // 3),
            "editorial_version": lesson.get("editorial_version", "1.0.0"), "review_status": lesson["review_status"], "is_published": 1})
        for section_position, section in enumerate(review):
            upsert(db, "lesson_sections", {"lesson_id": review_lesson_id, "position": section_position}, {
                "type": section["type"], "title": section["title"], "content": section["content"],
                "content_format": "markdown", "pedagogical_role": section.get("pedagogical_role", "formalization"), "blocks_json": "[]"})
        db.execute("DELETE FROM lesson_sections WHERE lesson_id=? AND position>=?", (review_lesson_id, len(review)))
        for source_id in lesson["source_document_ids"]:
            db.execute("INSERT OR IGNORE INTO lesson_sources (lesson_id,source_document_id) VALUES (?,?)", (review_lesson_id, source_id))
        db.execute("INSERT OR IGNORE INTO lesson_topics (lesson_id,curriculum_topic_id) VALUES (?,?)", (review_lesson_id, topic["id"]))
        for canonical_id in lesson.get("canonical_topic_ids", []):
            for legacy in db.execute("SELECT topic_id FROM canonical_topic_legacy_topics WHERE canonical_topic_id=?", (canonical_id,)).fetchall():
                db.execute("INSERT OR IGNORE INTO lesson_topics (lesson_id,topic_id) VALUES (?,?)", (review_lesson_id, legacy[0]))
        upsert(db, "learning_course_items", {"module_id": module_id, "position": review_position}, {
            "item_type": "lesson", "title": review_title, "description": lesson_review_description(lesson["review_status"]),
            "lesson_id": review_lesson_id, "question_occurrence_id": None, "question_id": None, "assessment_set_id": None,
            "duration_minutes": max(2, int(lesson.get("estimated_minutes", 9)) // 3), "is_required": 1})
        db.execute("DELETE FROM learning_course_items WHERE module_id=? AND position>?", (module_id, review_position))
    if apply:
        db.execute("UPDATE learning_courses SET estimated_minutes=(SELECT SUM(i.duration_minutes) FROM learning_course_items i JOIN learning_course_modules m ON m.id=i.module_id WHERE m.learning_course_id=?) WHERE id=?", (course_id, course_id))
    report["distinct_practice_families"] = len(used_families)
    return report


def sync_course_practice_items(db, report):
    """Expand existing course practice steps without rewriting lesson content."""
    course_row = db.execute("SELECT id FROM learning_courses WHERE slug=?", (SLUG,)).fetchone()
    if course_row is None:
        raise ValueError("Guided course is missing; refusing to create it in practice-only mode")
    course_id = course_row[0]
    planned = 0
    for module in report["modules"]:
        topic_id = module["topic_id"]
        module_row = db.execute(
            "SELECT id FROM learning_course_modules WHERE learning_course_id=? AND slug=?",
            (course_id, f"topico-{topic_id}"),
        ).fetchone()
        if module_row is None:
            raise ValueError(f"Existing course module is missing for topic {topic_id}")
        module_id = module_row[0]
        item_rows = rows(db, """
            SELECT i.id,i.position,i.item_type,i.lesson_id,i.question_occurrence_id,l.slug AS lesson_slug
            FROM learning_course_items i LEFT JOIN lessons l ON l.id=i.lesson_id
            WHERE i.module_id=? ORDER BY i.position,i.id
        """, (module_id,))
        by_position = {item["position"]: item for item in item_rows}
        for position, role in ((0, "conceito"), (1, "exemplo")):
            item = by_position.get(position)
            if not item or item["item_type"] != "lesson" or item["lesson_slug"] != f"unicamp-2027-{topic_id}-{role}":
                raise ValueError(f"Course step {position} changed for topic {topic_id}; refusing practice-only sync")
        review_slug = f"unicamp-2027-{topic_id}-revisao"
        review_rows = [item for item in item_rows if item["lesson_slug"] == review_slug]
        if len(review_rows) != 1 or review_rows[0]["item_type"] != "lesson":
            raise ValueError(f"Review step is missing or ambiguous for topic {topic_id}")
        review_item = review_rows[0]
        current_practice = [item for item in item_rows if item["item_type"] == "practice"]
        current_practice.sort(key=lambda item: item["position"])
        selected_practices = module["practices"]
        if not selected_practices:
            raise ValueError(f"No approved representative practice exists for topic {topic_id}")
        current_ids = [item["question_occurrence_id"] for item in current_practice]
        target_by_id = {item["id"]: item for item in selected_practices}
        if len(target_by_id) != len(selected_practices) or any(item_id not in target_by_id for item_id in current_ids):
            raise ValueError(f"Existing practice is no longer an approved candidate for topic {topic_id}; refusing to replace it")
        if not current_practice or current_practice[0]["position"] != 2:
            raise ValueError(f"First practice step is missing for topic {topic_id}")
        if any(item["item_type"] not in ("lesson", "practice") for item in item_rows):
            raise ValueError(f"Unexpected course item type in topic {topic_id}")
        practice_positions = [item["position"] for item in current_practice]
        if practice_positions != list(range(2, 2 + len(current_practice))):
            raise ValueError(f"Existing practice positions are not contiguous for topic {topic_id}")
        if review_item["position"] <= current_practice[-1]["position"]:
            raise ValueError(f"Review step is not after practice for topic {topic_id}")
        current_id_set = set(current_ids)
        module["practices"] = [target_by_id[item_id] for item_id in current_ids] + [
            item for item in selected_practices if item["id"] not in current_id_set
        ]
        planned += len(module["practices"])

    for module in report["modules"]:
        topic_id = module["topic_id"]
        module_id = db.execute(
            "SELECT id FROM learning_course_modules WHERE learning_course_id=? AND slug=?",
            (course_id, f"topico-{topic_id}"),
        ).fetchone()[0]
        review_slug = f"unicamp-2027-{topic_id}-revisao"
        review_item = db.execute("""
            SELECT i.id FROM learning_course_items i JOIN lessons l ON l.id=i.lesson_id
            WHERE i.module_id=? AND l.slug=?
        """, (module_id, review_slug)).fetchone()
        target_practices = module["practices"]
        temporary_position = 100000 + topic_id
        db.execute("UPDATE learning_course_items SET position=? WHERE id=?", (temporary_position, review_item[0]))
        for practice_position, practice in enumerate(target_practices, start=2):
            description = (
                f"Unicamp {practice['year']} · {practice['code']} · questão {practice['number']}. "
                "Associação editorial aprovada; responder não implica domínio."
            )
            if practice.get("editorial_selection_reason"):
                description += f" Seleção editorial: {practice['editorial_selection_reason']}"
            if practice["shared"]:
                description += " Questão ligada a mais de um tópico; ao respondê-la, esta etapa também conta nos demais."
            upsert(db, "learning_course_items", {"module_id": module_id, "position": practice_position}, {
                "item_type": "practice", "title": f"Praticar questão {practice_position - 1}",
                "description": description, "question_occurrence_id": practice["id"],
                "lesson_id": None, "question_id": None, "assessment_set_id": None,
                "duration_minutes": 5, "is_required": 1,
            })
        next_position = 2 + len(target_practices)
        db.execute("""
            DELETE FROM learning_course_items
            WHERE module_id=? AND item_type='practice' AND position>=?
        """, (module_id, next_position))
        db.execute("UPDATE learning_course_items SET position=? WHERE id=?", (next_position, review_item[0]))
        db.execute("""
            UPDATE learning_course_modules
            SET description='Conceito → exemplo → questões → revisão.'
            WHERE id=?
        """, (module_id,))
    db.execute("""
        UPDATE learning_courses
        SET estimated_minutes=(
            SELECT SUM(i.duration_minutes)
            FROM learning_course_items i JOIN learning_course_modules m ON m.id=i.module_id
            WHERE m.learning_course_id=?
        ) WHERE id=?
    """, (course_id, course_id))
    return {"modules": len(report["modules"]), "practice_items": planned}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=ROOT / ".local/content/content.sqlite")
    parser.add_argument("--package", type=Path, default=ROOT / "content/editorial/unicamp-2027/lessons.json")
    parser.add_argument("--revisions", type=Path, default=ROOT / "content/editorial/unicamp-2027/lesson-revisions.json")
    parser.add_argument("--lesson-audit", type=Path, action="append", default=[],
                        help="Apply one explicit, versioned editorial audit batch (repeatable).")
    parser.add_argument("--practice-selections", type=Path, default=ROOT / "content/editorial/unicamp-2027/practice-selections.json")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--practice-only", action="store_true",
                        help="Apply only the approved practice-pool expansion; preserve lessons and module identities.")
    parser.add_argument("--journal", type=Path,
                        help="Write an application journal (required with --apply --practice-only).")
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    payload = json.loads(args.package.read_text())
    revision_sha256 = None
    if args.revisions.exists():
        revision_bytes = args.revisions.read_bytes()
        payload = apply_revisions(payload, json.loads(revision_bytes))
        revision_sha256 = hashlib.sha256(revision_bytes).hexdigest()
    audit_data = [(path, path.read_bytes()) for path in args.lesson_audit]
    audit_batches = [json.loads(contents) for _, contents in audit_data]
    if audit_batches:
        payload = apply_lesson_audits(payload, audit_batches)
    db = sqlite3.connect(str(args.database) if args.apply else f"file:{args.database}?mode=ro", uri=not args.apply)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys=ON")
    selection_bytes = args.practice_selections.read_bytes() if args.practice_selections.exists() else b""
    selection_data = json.loads(selection_bytes) if selection_bytes else {"version": 1, "selections": []}
    if selection_data.get("version") != 1:
        raise ValueError("Unsupported curated practice-selection package")
    practice_mode = selection_data.get("mode", "curated")
    if practice_mode not in ("curated", "all_approved_representatives"):
        raise ValueError(f"Unsupported practice selection mode: {practice_mode}")
    selection_rows = selection_data.get("selections", [])
    selection_ids = [item["curriculum_topic_id"] for item in selection_rows]
    if len(selection_ids) != len(set(selection_ids)):
        raise ValueError("A curriculum topic can have only one representative practice override")
    if any(not item.get("reason") or not item.get("source_page") for item in selection_rows):
        raise ValueError("Curated practice selections require a reason and source page")
    practice_selections = {item["curriculum_topic_id"]: item for item in selection_rows}
    report = assemble(db, payload, practice_selections=practice_selections, practice_mode=practice_mode)
    if args.apply:
        if args.practice_only and not args.journal:
            raise ValueError("--journal is required with --apply --practice-only")
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        backup = args.database.parent / "backups" / f"before-study-path-{stamp}.sqlite"
        backup.parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(backup) as target:
            db.backup(target)
        with db:
            if args.practice_only:
                report["practice_sync"] = sync_course_practice_items(db, report)
            else:
                report = assemble(db, payload, apply=True, practice_selections=practice_selections,
                                  practice_mode=practice_mode)
            if db.execute("PRAGMA foreign_key_check").fetchall():
                raise ValueError("Foreign key validation failed")
            if db.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                raise ValueError("Integrity validation failed")
        report["backup"] = report_path(backup)
    report["applied"] = args.apply
    report["practice_mode"] = practice_mode
    report["package_sha256"] = hashlib.sha256(args.package.read_bytes()).hexdigest()
    report["revision_package"] = report_path(args.revisions) if revision_sha256 else None
    report["revision_package_sha256"] = revision_sha256
    report["lesson_audits"] = [
        {"path": report_path(path), "sha256": hashlib.sha256(contents).hexdigest()}
        for path, contents in audit_data
    ]
    report["practice_selection_package"] = report_path(args.practice_selections) if selection_bytes else None
    report["practice_selection_package_sha256"] = hashlib.sha256(selection_bytes).hexdigest() if selection_bytes else None
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    if args.apply and args.practice_only:
        args.journal.parent.mkdir(parents=True, exist_ok=True)
        args.journal.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    db.close()


if __name__ == "__main__":
    main()
