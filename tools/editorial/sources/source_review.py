#!/usr/bin/env python3
"""Read-only 2027 editorial review queue exporter and adjudication validator."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sqlite3
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable


HERE = Path(__file__).resolve().parent
REPOSITORY = HERE.parents[2]
DEFAULT_DATABASE = REPOSITORY / ".local" / "content" / "content.sqlite"
DEFAULT_EVIDENCE_ROOT = REPOSITORY / ".local" / "content" / "staging" / "unicamp-2027-v1"
DOCUMENTED_RESOURCE_IDS = (174, 179, 205, 218, 219, 220, 223, 225, 229, 240, 512, 514, 520, 522, 523, 527)
SHA256_PATTERN = re.compile(r"^[0-9a-f]{64}$")
UNRESOLVED_PROBLEM = re.compile(
    r"(?:remain(?:s|ed)? in review|keep in review|still in review|pending review|"
    r"needs_improvement|manter em revis[aã]o|permanece em revis[aã]o|"
    r"continua em revis[aã]o|segue em revis[aã]o|not approved|n[aã]o aprovado)",
    re.IGNORECASE,
)


def canonical_json(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def open_readonly(path: Path) -> sqlite3.Connection:
    connection = sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only=ON")
    return connection


def rows(connection: sqlite3.Connection, sql: str, params: Iterable[Any] = ()) -> list[dict[str, Any]]:
    return [dict(row) for row in connection.execute(sql, tuple(params))]


def artifact_mentions_resource(path: Path, resource_id: int) -> bool:
    if re.search(rf"(?<!\d){resource_id}(?!\d)", path.name):
        return True
    if path.suffix.lower() != ".jsonl":
        return False
    # These are already-curated audit artifacts. Inspect only selected IDs;
    # no network requests or broad website crawling occur.
    token = re.compile(rf'"(?:resourceId|resource_id)"\s*:\s*{resource_id}(?!\d)')
    try:
        with path.open("r", encoding="utf-8") as stream:
            return any(token.search(line) for line in stream)
    except (OSError, UnicodeError):
        return False


def artifact_evidence(root: Path, resource_id: int) -> list[dict[str, Any]]:
    if not root.is_dir():
        return []
    candidates = list(root.glob("resource-*.jsonl")) + list(root.glob("resource-audit-followup-*.md"))
    result = []
    for path in sorted(set(candidates)):
        if not artifact_mentions_resource(path, resource_id):
            continue
        result.append({
            "kind": "existing_editorial_audit_artifact",
            "locator": path.relative_to(REPOSITORY).as_posix() if path.is_relative_to(REPOSITORY) else str(path),
            "sha256": sha256_file(path),
        })
    return result


def source_document_evidence(
    connection: sqlite3.Connection,
    source_document_id: int | None,
    citation: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    if source_document_id is None:
        return []
    row = connection.execute("SELECT * FROM source_documents WHERE id=?", (source_document_id,)).fetchone()
    if row is None:
        return [{
            "kind": "missing_source_document_reference",
            "source_document_id": source_document_id,
            "locator": f"sqlite://source_documents/{source_document_id}",
            "sha256": sha256_bytes(canonical_json({"id": source_document_id, "citation": citation})),
        }]
    source = dict(row)
    content_hash = source.get("checksum") if isinstance(source.get("checksum"), str) and SHA256_PATTERN.fullmatch(source["checksum"]) else None
    material = {"source_document": source, "citation": citation or {}}
    return [{
        "kind": "source_document_record",
        "source_document_id": source_document_id,
        "locator": source.get("url") or f"sqlite://source_documents/{source_document_id}",
        "title": source.get("title"),
        "content_sha256": content_hash,
        "sha256": content_hash or sha256_bytes(canonical_json(material)),
        "hash_kind": "source_content" if content_hash else "source_metadata_and_citation",
        "citation": citation or {},
    }]


def note_evidence(locator: str, note: str | None) -> list[dict[str, Any]]:
    if not note:
        return []
    return [{"kind": "stored_editorial_note", "locator": locator, "sha256": sha256_bytes(note.encode("utf-8"))}]


def has_documented_problem(resource: dict[str, Any]) -> bool:
    return bool(UNRESOLVED_PROBLEM.search(resource.get("editorial_note") or ""))


def has_classification_problem(mapping: dict[str, Any]) -> bool:
    if mapping.get("relevance_status") == "not_relevant" or mapping.get("accessibility_status") == "needs_improvement":
        return True
    return bool(UNRESOLVED_PROBLEM.search(mapping.get("review_note") or ""))


def candidate_record(
    candidate_id: str,
    entity_type: str,
    entity_id: Any,
    current_state: dict[str, Any],
    evidence: list[dict[str, Any]],
    priority: str,
    reason: str,
) -> dict[str, Any]:
    fingerprint = sha256_bytes(canonical_json({"current_state": current_state, "source_evidence": evidence}))
    evidence_kinds = {item.get("kind") for item in evidence}
    if not evidence:
        evidence_status = "missing"
    elif evidence_kinds == {"associated_resource_record"}:
        evidence_status = "catalog_only"
    else:
        evidence_status = "linked"
    return {
        "record_type": "candidate",
        "schema_version": "source-review-candidate/v1",
        "candidate_id": candidate_id,
        "entity_type": entity_type,
        "entity_id": entity_id,
        "priority": priority,
        "reason": reason,
        "current_state": current_state,
        "source_evidence": evidence,
        "source_evidence_hashes": [item["sha256"] for item in evidence],
        "source_evidence_status": evidence_status,
        "evidence_set_sha256": sha256_bytes(canonical_json(evidence)),
        "current_state_hash": fingerprint,
        "approval_policy": "explicit_human_adjudication_required; HTTP status is not an approval signal",
    }


def require_stage(connection: sqlite3.Connection, stage_id: int | None) -> dict[str, Any]:
    if stage_id is None:
        row = connection.execute(
            """SELECT st.id, st.slug, st.name, st.kind, e.id edition_id, e.year,
                      ap.id admission_process_id, ap.slug admission_process_slug
               FROM stages st JOIN editions e ON e.id=st.edition_id
               JOIN admission_processes ap ON ap.id=e.admission_process_id
               WHERE e.year=2027 AND st.slug='primeira-fase' AND ap.slug='vestibular-unicamp'"""
        ).fetchone()
    else:
        row = connection.execute(
            """SELECT st.id, st.slug, st.name, st.kind, e.id edition_id, e.year,
                      ap.id admission_process_id, ap.slug admission_process_slug
               FROM stages st JOIN editions e ON e.id=st.edition_id
               JOIN admission_processes ap ON ap.id=e.admission_process_id WHERE st.id=?""",
            (stage_id,),
        ).fetchone()
    if row is None or row["year"] != 2027 or row["slug"] != "primeira-fase":
        raise ValueError("target must be the Unicamp 2027 primeira-fase stage")
    return dict(row)


def add_candidate(records: list[dict[str, Any]], record: dict[str, Any]) -> None:
    records.append(record)


def build_queue(
    connection: sqlite3.Connection,
    evidence_root: Path = DEFAULT_EVIDENCE_ROOT,
    stage_id: int | None = None,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    stage = require_stage(connection, stage_id)
    sid = stage["id"]
    edition_id = stage["edition_id"]
    records: list[dict[str, Any]] = []
    counts: dict[str, int] = {}

    targeted_resource_count = connection.execute(
        "SELECT COUNT(DISTINCT r.id) FROM resources r JOIN resource_targets t ON t.resource_id=r.id WHERE t.stage_id=?",
        (sid,),
    ).fetchone()[0]
    targeted_resources = rows(connection, """
        SELECT r.*
        FROM resources r JOIN resource_targets t ON t.resource_id=r.id AND t.stage_id=?
        ORDER BY r.id
    """, (sid,))
    published_targeted = [resource for resource in targeted_resources if resource["editorial_status"] == "published"]
    published_without_issue = sum(not has_documented_problem(resource) for resource in published_targeted)
    published_with_issue = len(published_targeted) - published_without_issue
    counts["targeted_resources"] = targeted_resource_count
    counts["published_resources_skipped_without_documented_problem"] = published_without_issue
    counts["published_resources_with_existing_problem_signal"] = published_with_issue

    exception_id_set = set(DOCUMENTED_RESOURCE_IDS)
    resources = [
        resource for resource in targeted_resources
        if resource["id"] in exception_id_set
        or (resource["editorial_status"] == "published" and has_documented_problem(resource))
    ]
    counts["documented_resource_exceptions_in_scope"] = sum(resource["id"] in exception_id_set for resource in resources)
    counts["documented_resource_exceptions_missing_or_out_of_scope"] = len(DOCUMENTED_RESOURCE_IDS) - counts["documented_resource_exceptions_in_scope"]
    counts["pending_resources_outside_documented_exception_set"] = sum(
        resource["editorial_status"] != "published" and resource["id"] not in exception_id_set
        for resource in targeted_resources
    )
    counts["published_problem_resources_added_to_queue"] = sum(
        resource["editorial_status"] == "published" and has_documented_problem(resource) for resource in resources
    )
    pending_resources = []
    for resource in resources:
        problem_signal = has_documented_problem(resource)
        if resource["editorial_status"] == "published" and not problem_signal:
            continue
        pending_resources.append(resource)
        evidence = source_document_evidence(connection, resource.get("source_document_id"))
        evidence.extend(note_evidence(f"sqlite://resources/{resource['id']}", resource.get("editorial_note")))
        evidence.extend(artifact_evidence(evidence_root, resource["id"]))
        add_candidate(records, candidate_record(
            f"resource:{resource['id']}", "resource", resource["id"], resource, evidence,
            "published_problem" if resource["editorial_status"] == "published" else "documented_exception",
            "Published resource has a documented unresolved problem." if resource["editorial_status"] == "published"
            else "Resource ID is listed in the existing editorial backlog exception set.",
        ))
    counts["resource_candidates"] = len(pending_resources)
    counts["documented_resource_ids_published_skipped_without_problem"] = sum(
        resource["id"] in exception_id_set and resource["editorial_status"] == "published" and not has_documented_problem(resource)
        for resource in resources
    )

    curriculum_topic_ids = [row[0] for row in connection.execute(
        """SELECT ct.id FROM curriculum_topics ct JOIN curricula c ON c.id=ct.curriculum_id
           WHERE c.edition_id=? ORDER BY ct.id""", (edition_id,)
    )]
    mappings = rows(connection, """
        SELECT DISTINCT rt.* FROM resource_topics rt
        JOIN resource_targets t ON t.resource_id=rt.resource_id AND t.stage_id=?
        ORDER BY rt.resource_id,rt.topic_id,rt.curriculum_topic_id
    """, (sid,))
    mapping_candidates = [
        mapping for mapping in mappings
        if mapping["review_status"] != "published" or has_classification_problem(mapping)
    ]
    counts["published_resource_topic_classifications_skipped_without_problem"] = sum(
        mapping["review_status"] == "published" and not has_classification_problem(mapping) for mapping in mappings
    )
    counts["documented_exception_resource_topic_classifications"] = sum(
        mapping["resource_id"] in exception_id_set for mapping in mapping_candidates
    )
    counts["direct_2027_curriculum_resource_topic_classifications"] = sum(
        mapping.get("curriculum_topic_id") in set(curriculum_topic_ids) for mapping in mapping_candidates
    )
    counts["review_or_draft_resource_topic_classifications"] = sum(
        mapping["review_status"] != "published" for mapping in mapping_candidates
    )
    counts["published_resource_topic_classifications_with_problem_signal"] = sum(
        mapping["review_status"] == "published" and has_classification_problem(mapping) for mapping in mapping_candidates
    )
    for mapping in mapping_candidates:
        resource_id = mapping["resource_id"]
        key = f"{resource_id}:{mapping.get('topic_id') or '-'}:{mapping.get('curriculum_topic_id') or '-'}"
        citation = {
            "source_page": mapping.get("source_page"),
            "source_excerpt": mapping.get("source_excerpt"),
            "curriculum_topic_id": mapping.get("curriculum_topic_id"),
        }
        evidence = source_document_evidence(connection, mapping.get("source_document_id"), citation)
        evidence.extend(note_evidence(f"sqlite://resource_topics/{key}", mapping.get("review_note")))
        evidence.extend(artifact_evidence(evidence_root, resource_id))
        associated_resource = connection.execute("SELECT * FROM resources WHERE id=?", (resource_id,)).fetchone()
        if associated_resource is not None:
            resource_snapshot = dict(associated_resource)
            evidence.append({
                "kind": "associated_resource_record",
                "locator": f"sqlite://resources/{resource_id}",
                "title": resource_snapshot.get("title"),
                "url": resource_snapshot.get("url"),
                "sha256": sha256_bytes(canonical_json(resource_snapshot)),
                "evidence_role": "catalog_identity_not_content",
            })
        add_candidate(records, candidate_record(
            f"resource_topic:{key}", "resource_topic", key, mapping, evidence,
            "documented_exception" if resource_id in exception_id_set else (
                "published_problem" if mapping["review_status"] == "published" else "stage_pending"
            ),
            "Classification is attached to a documented resource exception." if resource_id in exception_id_set
            else ("Published classification has a documented accessibility or relevance problem." if mapping["review_status"] == "published"
                  else "Resource classification for a resource targeted to the 2027 stage remains unpublished."),
        ))
    counts["resource_topic_classifications"] = len(mapping_candidates)

    curriculum_ids = [row[0] for row in connection.execute(
        "SELECT id FROM curricula WHERE edition_id=? ORDER BY id", (edition_id,)
    )]
    if curriculum_ids:
        curriculum_placeholders = ",".join("?" for _ in curriculum_ids)
        canonical_maps = rows(connection, f"""
            SELECT ctc.* FROM curriculum_topic_canonical_topics ctc
            JOIN curriculum_topics ct ON ct.id=ctc.curriculum_topic_id
            WHERE ct.curriculum_id IN ({curriculum_placeholders}) AND ctc.review_status<>'published'
            ORDER BY ctc.curriculum_topic_id,ctc.canonical_topic_id
        """, curriculum_ids)
        counts["published_curriculum_topic_canonical_classifications_skipped"] = connection.execute(f"""
            SELECT COUNT(*) FROM curriculum_topic_canonical_topics ctc
            JOIN curriculum_topics ct ON ct.id=ctc.curriculum_topic_id
            WHERE ct.curriculum_id IN ({curriculum_placeholders}) AND ctc.review_status='published'
        """, curriculum_ids).fetchone()[0]
        for mapping in canonical_maps:
            key = f"{mapping['curriculum_topic_id']}:{mapping['canonical_topic_id']}"
            citation = {"source_page": mapping.get("source_page"), "source_excerpt": mapping.get("source_excerpt")}
            evidence = source_document_evidence(connection, mapping.get("source_document_id"), citation)
            add_candidate(records, candidate_record(
                f"curriculum_topic_canonical:{key}", "curriculum_topic_canonical_topic", key, mapping, evidence,
                "stage_pending", "Unpublished curriculum-to-canonical-topic classification for this edition.",
            ))
        counts["curriculum_topic_canonical_classifications"] = len(canonical_maps)

    pending_stage_maps = rows(connection, """
        SELECT cts.* FROM curriculum_topic_stages cts
        JOIN curriculum_topics ct ON ct.id=cts.curriculum_topic_id
        JOIN curricula c ON c.id=ct.curriculum_id
        WHERE c.edition_id=? AND cts.stage_id=? AND cts.review_status<>'published'
        ORDER BY cts.curriculum_topic_id
    """, (edition_id, sid))
    for mapping in pending_stage_maps:
        key = f"{mapping['curriculum_topic_id']}:{mapping['stage_id']}"
        citation = {"source_page": mapping.get("source_page"), "source_excerpt": mapping.get("source_excerpt")}
        evidence = source_document_evidence(connection, mapping.get("source_document_id"), citation)
        add_candidate(records, candidate_record(
            f"curriculum_topic_stage:{key}", "curriculum_topic_stage", key, mapping, evidence,
            "stage_pending", "Unpublished curriculum-to-stage classification.",
        ))
    counts["curriculum_topic_stage_candidates"] = len(pending_stage_maps)
    counts["published_curriculum_topic_stage_classifications_skipped"] = connection.execute("""
        SELECT COUNT(*) FROM curriculum_topic_stages cts
        JOIN curriculum_topics ct ON ct.id=cts.curriculum_topic_id
        JOIN curricula c ON c.id=ct.curriculum_id
        WHERE c.edition_id=? AND cts.stage_id=? AND cts.review_status='published'
    """, (edition_id, sid)).fetchone()[0]

    question_ids = [row[0] for row in connection.execute("""
        SELECT DISTINCT qo.question_id FROM question_occurrences qo
        JOIN papers p ON p.id=qo.paper_id WHERE p.stage_id=? ORDER BY qo.question_id
    """, (sid,))]
    if question_ids:
        question_placeholders = ",".join("?" for _ in question_ids)
        question_topic_maps = rows(connection, f"""
            SELECT qct.*,q.slug question_slug,ct.slug canonical_topic_slug
            FROM question_canonical_topics qct
            JOIN questions q ON q.id=qct.question_id
            JOIN canonical_topics ct ON ct.id=qct.canonical_topic_id
            WHERE qct.question_id IN ({question_placeholders}) AND qct.review_status<>'published'
            ORDER BY qct.question_id,qct.canonical_topic_id
        """, question_ids)
        counts["published_question_canonical_classifications_skipped"] = connection.execute(f"""
            SELECT COUNT(*) FROM question_canonical_topics qct
            WHERE qct.question_id IN ({question_placeholders}) AND qct.review_status='published'
        """, question_ids).fetchone()[0]
        for mapping in question_topic_maps:
            key = f"{mapping['question_id']}:{mapping['canonical_topic_id']}"
            citation = {"source_page": mapping.get("source_page"), "source_excerpt": mapping.get("source_excerpt")}
            evidence = source_document_evidence(connection, mapping.get("source_document_id"), citation)
            occurrence_sources = rows(connection, """
                SELECT DISTINCT qo.source_document_id,qo.source_page
                FROM question_occurrences qo JOIN papers p ON p.id=qo.paper_id
                WHERE p.stage_id=? AND qo.question_id=? AND qo.source_document_id IS NOT NULL
                ORDER BY qo.source_document_id,qo.source_page
            """, (sid, mapping["question_id"]))
            for occurrence_source in occurrence_sources:
                evidence.extend(source_document_evidence(
                    connection, occurrence_source["source_document_id"],
                    {"source_page": occurrence_source["source_page"], "question_id": mapping["question_id"]},
                ))
            curriculum_sources = rows(connection, """
                SELECT DISTINCT cts.source_document_id,cts.source_page,cts.source_excerpt
                FROM curriculum_topic_canonical_topics ctc
                JOIN curriculum_topics ct ON ct.id=ctc.curriculum_topic_id
                JOIN curricula c ON c.id=ct.curriculum_id
                JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id=ct.id AND cts.stage_id=?
                WHERE c.edition_id=? AND ctc.canonical_topic_id=? AND cts.source_document_id IS NOT NULL
                ORDER BY cts.source_document_id,cts.source_page
            """, (sid, edition_id, mapping["canonical_topic_id"]))
            for curriculum_source in curriculum_sources:
                evidence.extend(source_document_evidence(
                    connection, curriculum_source["source_document_id"],
                    {"source_page": curriculum_source["source_page"], "source_excerpt": curriculum_source["source_excerpt"]},
                ))
            add_candidate(records, candidate_record(
                f"question_canonical_topic:{key}", "question_canonical_topic", key, mapping, evidence,
                "stage_pending", "Question-to-canonical-topic classification remains unpublished for a target-stage question.",
            ))
        counts["question_canonical_topic_classifications"] = len(question_topic_maps)
        counts["legacy_occurrence_topic_classifications_without_review_status"] = connection.execute(f"""
            SELECT COUNT(*) FROM question_topics qt
            JOIN question_occurrences qo ON qo.id=qt.question_occurrence_id
            JOIN papers p ON p.id=qo.paper_id
            WHERE p.stage_id=?
        """, (sid,)).fetchone()[0]
        counts["legacy_question_canonical_topics_without_review_status"] = connection.execute(f"""
            SELECT COUNT(*) FROM canonical_question_topics cqt
            WHERE cqt.question_id IN ({question_placeholders})
        """, question_ids).fetchone()[0]
    else:
        counts["published_question_canonical_classifications_skipped"] = 0
        counts["question_canonical_topic_classifications"] = 0
        counts["legacy_occurrence_topic_classifications_without_review_status"] = 0
        counts["legacy_question_canonical_topics_without_review_status"] = 0

    rules = rows(connection, """
        SELECT * FROM edition_regulatory_rules
        WHERE edition_id=? AND editorial_status<>'published'
        ORDER BY id
    """, (edition_id,))
    counts["published_regulatory_rules_skipped"] = connection.execute(
        "SELECT COUNT(*) FROM edition_regulatory_rules WHERE edition_id=? AND editorial_status='published'",
        (edition_id,),
    ).fetchone()[0]
    for rule in rules:
        rule_sources = rows(connection, """
            SELECT rs.source_document_id,rs.source_location,rs.source_order,sd.title,sd.url,sd.checksum
            FROM edition_regulatory_rule_sources rs
            LEFT JOIN source_documents sd ON sd.id=rs.source_document_id
            WHERE rs.rule_id=? ORDER BY rs.source_order,rs.source_document_id
        """, (rule["id"],))
        evidence = []
        for citation in rule_sources:
            evidence.extend(source_document_evidence(
                connection,
                citation["source_document_id"],
                {"source_location": citation["source_location"], "source_order": citation["source_order"]},
            ))
        evidence.extend(note_evidence(f"sqlite://edition_regulatory_rules/{rule['id']}", rule.get("notes")))
        add_candidate(records, candidate_record(
            f"edition_regulatory_rule:{rule['id']}", "edition_regulatory_rule", rule["id"],
            {"rule": rule, "sources": rule_sources}, evidence,
            "edition_rule_review", "Edition regulatory rule remains in review; source records and locations are attached.",
        ))
    counts["regulatory_rule_candidates"] = len(rules)

    counts["candidates_without_linked_source_evidence"] = sum(
        record["source_evidence_status"] == "missing" for record in records
    )
    counts["candidates_with_catalog_metadata_only"] = sum(
        record["source_evidence_status"] == "catalog_only" for record in records
    )

    records.sort(key=lambda record: (record["entity_type"], str(record["entity_id"])))
    summary = {
        "record_type": "manifest",
        "schema_version": "source-review-queue/v1",
        "target_stage": stage,
        "bounded_resource_ids": list(DOCUMENTED_RESOURCE_IDS),
        "counts": counts,
        "candidate_count": len(records),
        "policy": {
            "database_access": "read_only",
            "http_200_is_approval": False,
            "published_without_documented_problem": "skipped",
            "source_policy": "existing SQLite and local editorial evidence only; no website crawl",
        },
    }
    return summary, records


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    result = []
    with path.open("r", encoding="utf-8") as stream:
        for number, line in enumerate(stream, 1):
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError as error:
                raise ValueError(f"{path}:{number}: invalid JSON: {error.msg}") from error
            if not isinstance(row, dict):
                raise ValueError(f"{path}:{number}: each JSONL record must be an object")
            result.append(row)
    return result


def validate_adjudications(
    adjudications: list[dict[str, Any]],
    queue_records: list[dict[str, Any]],
    live_records: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    queue_by_id = {record.get("candidate_id"): record for record in queue_records if record.get("record_type") == "candidate"}
    live_by_id = {record.get("candidate_id"): record for record in live_records or []}
    issues: list[dict[str, Any]] = []
    seen: set[str] = set()
    required = {
        "candidate_id", "entity_type", "entity_id", "decision", "reviewer", "reviewed_at",
        "expected_current_state_hash", "rationale", "evidence",
    }
    allowed = required
    for index, adjudication in enumerate(adjudications, 1):
        prefix = f"adjudication[{index}]"
        extras = sorted(set(adjudication) - allowed)
        missing = sorted(required - set(adjudication))
        if extras:
            issues.append({"record": index, "error": "unknown_fields", "fields": extras})
        if missing:
            issues.append({"record": index, "error": "missing_fields", "fields": missing})
        candidate_id = adjudication.get("candidate_id")
        if not isinstance(candidate_id, str) or not candidate_id:
            issues.append({"record": index, "error": "candidate_id_required_as_string"})
            continue
        if candidate_id in seen:
            issues.append({"record": index, "candidate_id": candidate_id, "error": "duplicate_adjudication"})
        seen.add(candidate_id)
        candidate = queue_by_id.get(candidate_id)
        if candidate is None:
            issues.append({"record": index, "candidate_id": candidate_id, "error": "candidate_not_in_queue"})
            continue
        actual_queue_hash = sha256_bytes(canonical_json({
            "current_state": candidate.get("current_state"),
            "source_evidence": candidate.get("source_evidence"),
        }))
        if actual_queue_hash != candidate.get("current_state_hash"):
            issues.append({"record": index, "candidate_id": candidate_id, "error": "queue_candidate_hash_invalid"})
        if adjudication.get("entity_type") != candidate.get("entity_type") or str(adjudication.get("entity_id")) != str(candidate.get("entity_id")):
            issues.append({"record": index, "candidate_id": candidate_id, "error": "entity_identity_mismatch"})
        expected = adjudication.get("expected_current_state_hash")
        if not isinstance(expected, str) or not SHA256_PATTERN.fullmatch(expected):
            issues.append({"record": index, "candidate_id": candidate_id, "error": "invalid_expected_current_state_hash"})
        elif expected != candidate.get("current_state_hash"):
            issues.append({"record": index, "candidate_id": candidate_id, "error": "queue_state_hash_mismatch"})
        live = live_by_id.get(candidate_id)
        if live_records is not None and (live is None or live.get("current_state_hash") != expected):
            issues.append({"record": index, "candidate_id": candidate_id, "error": "stale_candidate_state"})
        if adjudication.get("decision") not in {"approve", "reject", "defer"}:
            issues.append({"record": index, "candidate_id": candidate_id, "error": "explicit_decision_required"})
        for field in ("reviewer", "reviewed_at", "rationale"):
            if not isinstance(adjudication.get(field), str) or not adjudication[field].strip():
                issues.append({"record": index, "candidate_id": candidate_id, "error": f"nonempty_{field}_required"})
        if isinstance(adjudication.get("reviewed_at"), str):
            try:
                timestamp = datetime.fromisoformat(adjudication["reviewed_at"].replace("Z", "+00:00"))
                if timestamp.tzinfo is None:
                    raise ValueError("timezone required")
            except ValueError:
                issues.append({"record": index, "candidate_id": candidate_id, "error": "reviewed_at_must_be_timezone_aware"})
        evidence = adjudication.get("evidence")
        if not isinstance(evidence, list) or not evidence:
            issues.append({"record": index, "candidate_id": candidate_id, "error": "explicit_evidence_required"})
            continue
        for evidence_index, item in enumerate(evidence, 1):
            if not isinstance(item, dict):
                issues.append({"record": index, "candidate_id": candidate_id, "error": f"evidence_{evidence_index}_must_be_object"})
                continue
            if set(item) != {"uri", "sha256", "finding"}:
                issues.append({"record": index, "candidate_id": candidate_id, "error": f"evidence_{evidence_index}_shape_invalid"})
            if not isinstance(item.get("uri"), str) or not item["uri"].strip():
                issues.append({"record": index, "candidate_id": candidate_id, "error": f"evidence_{evidence_index}_uri_required"})
            if not isinstance(item.get("sha256"), str) or not SHA256_PATTERN.fullmatch(item["sha256"]):
                issues.append({"record": index, "candidate_id": candidate_id, "error": f"evidence_{evidence_index}_sha256_invalid"})
            if not isinstance(item.get("finding"), str) or not item["finding"].strip():
                issues.append({"record": index, "candidate_id": candidate_id, "error": f"evidence_{evidence_index}_finding_required"})
    return {
        "schema_version": "source-adjudication-validation/v1",
        "valid": not issues,
        "adjudication_count": len(adjudications),
        "issues": issues,
        "database_writes": 0,
    }


def write_jsonl(path: Path, records: list[dict[str, Any]]) -> None:
    output = path.resolve()
    if not output.is_relative_to(HERE):
        raise ValueError(f"output must be written under {HERE}")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("".join(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n" for record in records), encoding="utf-8")


def command_export(args: argparse.Namespace) -> int:
    connection = open_readonly(args.database.resolve(strict=True))
    try:
        manifest, candidates = build_queue(connection, args.evidence_root.resolve(), args.stage_id)
        records = [manifest, *candidates]
        if args.output:
            write_jsonl(args.output, records)
        else:
            for record in records:
                print(json.dumps(record, ensure_ascii=False, sort_keys=True))
        return 0
    finally:
        connection.close()


def command_validate(args: argparse.Namespace) -> int:
    queue_records = read_jsonl(args.queue)
    adjudications = read_jsonl(args.adjudications)
    connection = open_readonly(args.database.resolve(strict=True))
    try:
        _, live_records = build_queue(connection, args.evidence_root.resolve(), args.stage_id)
    finally:
        connection.close()
    result = validate_adjudications(adjudications, queue_records, live_records)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["valid"] else 2


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(description=__doc__)
    commands = root.add_subparsers(dest="command", required=True)
    export = commands.add_parser("export", help="export a bounded JSONL review queue")
    export.add_argument("--database", type=Path, default=DEFAULT_DATABASE)
    export.add_argument("--evidence-root", type=Path, default=DEFAULT_EVIDENCE_ROOT)
    export.add_argument("--stage-id", type=int)
    export.add_argument("--output", type=Path, help="JSONL path; must remain under this tool directory")
    export.set_defaults(func=command_export)
    validate = commands.add_parser("validate", help="validate explicit adjudications against current live state")
    validate.add_argument("--database", type=Path, default=DEFAULT_DATABASE)
    validate.add_argument("--evidence-root", type=Path, default=DEFAULT_EVIDENCE_ROOT)
    validate.add_argument("--stage-id", type=int)
    validate.add_argument("--queue", type=Path, required=True)
    validate.add_argument("--adjudications", type=Path, required=True)
    validate.set_defaults(func=command_validate)
    return root


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    try:
        return args.func(args)
    except (OSError, sqlite3.Error, ValueError) as error:
        print(f"source review tool failed: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
