#!/usr/bin/env python3
"""Read-only bulk QA and explicitly reviewed import for exam PDF extractions.

The default command validates existing Docling Markdown and writes a JSON report.
Database writes require --apply plus a separately reviewed JSONL file.
"""

from __future__ import annotations

import argparse
from difflib import SequenceMatcher
import hashlib
import json
import os
import re
import shlex
import sqlite3
import subprocess
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


HERE = Path(__file__).resolve().parent
WORKSPACE = HERE.parents[2]
STAGING = WORKSPACE / ".local/content/staging/unicamp-2027-v1"
DEFAULT_DATABASE = WORKSPACE / ".local/content/content.sqlite"
DEFAULT_MANIFEST = STAGING / "docling-exam-review-2025-2027/manifest.json"
DEFAULT_BOOKLETS = "2025:QZ,2026:QX,2027:QT"
DEFAULT_OUTPUT = HERE / "bulk-qa-report.json"
DEFAULT_REPAIR_HISTORY = HERE / "published-repair-history.json"
HEADING = re.compile(r"^##\s*QUEST[ÃA]O\s+(\d+)\s*$", re.I | re.M)
OPTION_LINE = re.compile(r"^\s*(?:[-*]\s*)?([A-D])[).]\s+", re.M)
OPTION_INLINE = re.compile(r"(?<![A-Za-z0-9])([a-d])[).]\s+")
TABLE_ROW = re.compile(r"^\s*\|([^\n]*)\|\s*$", re.M)
TABLE_LABEL = re.compile(r"^[A-Da-d][).]$")
REVIEW_MARKUP = re.compile(r"[_*`$]|\\(?:\(|\[|[A-Za-z]+)")
PDF_CID_ARTIFACT = re.compile(r"\(cid:\d+\)", re.I)
IMAGE_MARKER = re.compile(r"<!--\s*image\s*-->", re.I)


def classify_option_extraction(issues: list[str], extracted_codes: list[str],
                               expected_codes: list[str], stem: str) -> list[str]:
    """Keep image-only options reviewable without mislabeling them as missing A-D text.

    This does not approve the options or infer their content. The item remains a QA
    issue and requires a human visual comparison with the source PDF.
    """
    result = list(issues)
    if (expected_codes == ["A", "B", "C", "D"] and not extracted_codes
            and IMAGE_MARKER.search(stem)):
        result = [issue for issue in result if issue not in {
            "options_not_exactly_A_to_D", "extracted_option_codes_do_not_match_database"
        }]
        result.append("image_only_alternatives_require_visual_review")
    return sorted(set(result))


def has_pdf_cid_artifact(value: str) -> bool:
    """Detect unresolved PDF character-map tokens rather than passing them as prose."""
    return bool(PDF_CID_ARTIFACT.search(value))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def clean(value: str) -> str:
    # Preserve source characters: Markdown punctuation can encode math/subscripts.
    return re.sub(r"\s+", " ", value).strip()


def normalize_for_similarity(value: str) -> str:
    """Normalize layout noise for triage; this is not proof of textual equivalence."""
    value = re.sub(r"(?<=\w)-\s*(?:\r?\n)\s*(?=\w)", "", value)
    value = unicodedata.normalize("NFKC", value).casefold()
    return " ".join("".join(char if char.isalnum() else " " for char in value).split())


def text_similarity(left: str, right: str) -> float | None:
    """Return a normalized similarity score for prioritization, never approval."""
    normalized_left = normalize_for_similarity(left)
    normalized_right = normalize_for_similarity(right)
    if not normalized_left or not normalized_right:
        return None
    return round(SequenceMatcher(None, normalized_left, normalized_right, autojunk=False).ratio(), 3)


def compare_extracted_text(extracted_stem: str, database_stem: str,
                          extracted_options: dict[str, str],
                          database_options: dict[str, str]) -> dict[str, Any]:
    stem_score = text_similarity(extracted_stem, database_stem)
    option_scores = {
        code: text_similarity(extracted_options.get(code, ""), database_options.get(code, ""))
        for code in sorted(set(extracted_options) | set(database_options))
    }
    available_scores = [score for score in option_scores.values() if score is not None]
    if stem_score is None:
        triage = "insufficient_extracted_text"
    elif len(available_scores) != len(database_options):
        triage = "partial_text_or_image_content"
    elif stem_score < 0.7 or any(score < 0.65 for score in available_scores):
        triage = "low_text_overlap"
    elif stem_score >= 0.85 and all(score >= 0.8 for score in available_scores):
        triage = "strong_text_overlap"
    else:
        triage = "intermediate_text_overlap"
    return {
        "statementSimilarity": stem_score,
        "optionSimilarities": option_scores,
        "triage": triage,
        "isApproval": False,
    }


def option_label_groups(matches: list[re.Match[str]]) -> list[list[re.Match[str]]]:
    """Keep only contiguous A, B, C, D label runs; ignore isolated prose tokens."""
    groups: list[list[re.Match[str]]] = []
    i = 0
    while i < len(matches):
        if matches[i].group(1).upper() != "A":
            i += 1
            continue
        group = [matches[i]]
        next_code = "B"
        j = i + 1
        while j < len(matches) and matches[j].group(1).upper() == next_code:
            group.append(matches[j])
            next_code = chr(ord(next_code) + 1)
            j += 1
        if len(group) >= 2:
            groups.append(group)
            i = j
        else:
            i += 1
    return groups


def parse_questions(markdown: str) -> tuple[dict[int, dict[str, Any]], list[str]]:
    found: dict[int, dict[str, Any]] = {}
    issues: list[str] = []
    headings = list(HEADING.finditer(markdown))
    numbers = [int(match.group(1)) for match in headings]
    if numbers != list(range(1, len(numbers) + 1)):
        issues.append("question_order_or_numbering_not_contiguous")
    for index, heading in enumerate(headings):
        number = int(heading.group(1))
        end = headings[index + 1].start() if index + 1 < len(headings) else len(markdown)
        body = markdown[heading.end():end]
        local_issues: list[str] = []
        table_options: dict[str, str] = {}
        table_spans: list[tuple[int, int]] = []
        table_group_count = 0
        previous_table_row_end: int | None = None
        for row in TABLE_ROW.finditer(body):
            cells = [cell.strip() for cell in row.group(1).split("|")]
            if not cells or not TABLE_LABEL.fullmatch(cells[0]):
                continue
            code = cells[0][0].upper()
            content = clean(" | ".join(cells[1:]))
            gap = body[previous_table_row_end:row.start()] if previous_table_row_end is not None else ""
            gap_lines = [line.strip() for line in gap.splitlines() if line.strip()]
            if previous_table_row_end is None or any(not line.startswith("|") for line in gap_lines):
                table_group_count += 1
            table_spans.append(row.span())
            previous_table_row_end = row.end()
            if code in table_options:
                local_issues.append(f"duplicate_option_label_{code}_in_table")
            else:
                table_options[code] = content
        plain_body = list(body)
        for start, stop in table_spans:
            plain_body[start:stop] = " " * (stop - start)
        plain_body = "".join(plain_body)
        all_inline_matches = sorted(
            [*OPTION_LINE.finditer(plain_body), *OPTION_INLINE.finditer(plain_body)],
            key=lambda match: match.start(),
        )
        inline_groups = option_label_groups(all_inline_matches)
        inline_options = inline_groups[0] if inline_groups else []
        if table_options and inline_groups:
            spill_codes = ";".join("".join(m.group(1).upper() for m in group) for group in inline_groups)
            local_issues.append(f"spill_option_labels_before_or_outside_table:{spill_codes}")
        elif len(inline_groups) > 1:
            local_issues.append("duplicate_or_spill_option_label_groups")
        if table_group_count > 1:
            local_issues.append("multiple_option_tables")

        if table_options:
            values = table_options
            first_option_start = min((match.start() for match in inline_options), default=min(a for a, _ in table_spans))
            stem = clean(body[:first_option_start])
        else:
            values: dict[str, str] = {}
            for oi, item in enumerate(inline_options):
                stop = inline_options[oi + 1].start() if oi + 1 < len(inline_options) else len(plain_body)
                code = item.group(1).upper()
                if code in values:
                    local_issues.append(f"duplicate_option_label_{code}")
                else:
                    values[code] = clean(plain_body[item.end():stop])
            stem = clean(plain_body[:inline_options[0].start()] if inline_options else plain_body)
        if number in found:
            local_issues.append("duplicate_question_heading")
        else:
            found[number] = {"stem": stem, "options": values, "issues": local_issues}
        codes = sorted(values)
        if codes != ["A", "B", "C", "D"]:
            local_issues.append("options_not_exactly_A_to_D")
        if any(not text for text in values.values()):
            local_issues.append("empty_option")
        if not stem:
            local_issues.append("empty_stem")
        if number in found:
            found[number]["issues"] = sorted(set(local_issues))
    if len(headings) != 72:
        issues.append(f"question_count_{len(headings)}_expected_72")
    return found, issues


def parse_selection(value: str) -> set[tuple[int, str]]:
    selected: set[tuple[int, str]] = set()
    for item in value.split(","):
        year, sep, code = item.strip().partition(":")
        if not sep or not year.isdigit() or not code:
            raise ValueError("--booklets must look like 2025:QZ,2026:QX")
        selected.add((int(year), code.upper()))
    return selected


def connect_readonly(path: Path) -> sqlite3.Connection:
    uri = path.resolve().as_uri() + "?mode=ro"
    db = sqlite3.connect(uri, uri=True)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA query_only=ON")
    return db


def db_records(db: sqlite3.Connection, source_id: int) -> list[dict[str, Any]]:
    rows = db.execute(
        """SELECT o.id occurrence_id,o.question_id,o.number,o.original_number,o.source_page,
                  o.status occurrence_status,q.slug,q.statement,q.status question_status
           FROM question_occurrences o JOIN questions q ON q.id=o.question_id
           WHERE o.source_document_id=? ORDER BY o.number,o.id""", (source_id,)
    ).fetchall()
    result = []
    for row in rows:
        item = dict(row)
        options = db.execute(
            "SELECT id,code,text FROM question_options WHERE question_id=? ORDER BY position,id",
            (item["question_id"],),
        ).fetchall()
        item["options"] = {str(opt["code"]).upper(): dict(opt) for opt in options}
        keys = db.execute(
            """SELECT k.id,k.status FROM canonical_answer_keys k
               WHERE k.question_id=? AND (k.occurrence_id IS NULL OR k.occurrence_id=?)
               ORDER BY k.version DESC,k.id DESC""",
            (item["question_id"], item["occurrence_id"]),
        ).fetchall()
        key_info = []
        for key in keys:
            codes = [r[0] for r in db.execute(
                """SELECT o.code FROM canonical_answer_key_options x
                   JOIN question_options o ON o.id=x.question_option_id
                   WHERE x.answer_key_id=? ORDER BY o.position,o.code""", (key["id"],)
            )]
            key_info.append({"id": key["id"], "status": key["status"], "optionCodes": codes})
        item["answerKeys"] = key_info
        result.append(item)
    return result


def run_extractor(command_text: str, pdf: Path, output: Path, page_limit: str, config: str) -> None:
    argv = shlex.split(command_text)
    if not argv:
        raise ValueError("empty extraction command")
    replacements = {"pdf": str(pdf), "output": str(output), "page_limit": page_limit}
    if not any("{pdf}" in part for part in argv) or not any("{output}" in part for part in argv):
        raise ValueError("extract command must include {pdf} and {output}; {page_limit} is optional")
    expanded = [part.format(**replacements) for part in argv]
    subprocess.run(expanded, check=True, cwd=WORKSPACE)
    if not output.is_file():
        raise RuntimeError(f"extractor did not create {output}")
    output.with_suffix(output.suffix + ".config.sha256").write_text(config + "\n", encoding="utf-8")


def extraction_paths(booklet: dict[str, Any], manifest_path: Path, cache: Path,
                     command: str) -> tuple[Path, Path, Path, str, str]:
    pdf = (manifest_path.parent.parent / booklet["source"]).resolve()
    if not pdf.is_file():
        raise FileNotFoundError(f"source PDF missing: {pdf}")
    source_hash = sha256(pdf)
    config = json.dumps({"cmd": command, "sourceSha256": source_hash, "pageLimit": "all"}, sort_keys=True)
    config_hash = hashlib.sha256(config.encode()).hexdigest()
    target = cache / str(booklet["edition"]) / str(booklet["booklet"]) / f"{config_hash}.md"
    sample = target.with_name(target.stem + ".calibration-2-pages.md")
    return pdf, target, sample, source_hash, config_hash


def calibrate_extractor(booklet: dict[str, Any], manifest_path: Path, cache: Path,
                        command: str) -> dict[str, Any]:
    pdf, target, sample, source_hash, config_hash = extraction_paths(booklet, manifest_path, cache, command)
    config = json.dumps({"cmd": command, "sourceSha256": source_hash, "pageLimit": "all"}, sort_keys=True)
    calibration_config = config + "|calibration-pages=2"
    stamp = sample.with_suffix(sample.suffix + ".config.sha256")
    sample.parent.mkdir(parents=True, exist_ok=True)
    if not (sample.is_file() and stamp.is_file() and stamp.read_text().strip() == calibration_config):
        run_extractor(command, pdf, sample, "2", calibration_config)
    if not sample.stat().st_size:
        raise RuntimeError(f"two-page calibration output is empty: {sample}")
    return {"edition": int(booklet["edition"]), "booklet": str(booklet["booklet"]).upper(),
            "sourcePdfSha256": source_hash, "commandConfigSha256": config_hash,
            "samplePath": str(sample), "sampleSha256": sha256(sample),
            "awaitingHumanReview": True}


def verify_calibration_approvals(booklets: list[dict[str, Any]], manifest_path: Path, cache: Path,
                                command: str, approval_path: Path) -> None:
    approval_doc = json.loads(approval_path.read_text(encoding="utf-8"))
    approvals = {(int(row["edition"]), str(row["booklet"]).upper()): row
                 for row in approval_doc.get("approvals", [])}
    for booklet in booklets:
        key = (int(booklet["edition"]), str(booklet["booklet"]).upper())
        _, _, sample, source_hash, config_hash = extraction_paths(booklet, manifest_path, cache, command)
        stamp = sample.with_suffix(sample.suffix + ".config.sha256")
        if not sample.is_file() or not stamp.is_file():
            raise ValueError(f"missing two-page calibration for {key}; run once with --calibrate")
        row = approvals.get(key)
        if not row or row.get("approved") is not True or not row.get("reviewer"):
            raise ValueError(f"calibration for {key} lacks explicit approval and reviewer")
        expected = (source_hash, config_hash, sha256(sample))
        received = (row.get("sourcePdfSha256"), row.get("commandConfigSha256"), row.get("sampleSha256"))
        if received != expected:
            raise ValueError(f"calibration approval for {key} does not match source/config/sample hashes")


def maybe_extract(booklet: dict[str, Any], manifest_path: Path, cache: Path,
                  command: str | None) -> tuple[Path | None, str | None]:
    if not command:
        return None, None
    try:
        pdf, target, _, source_hash, _ = extraction_paths(booklet, manifest_path, cache, command)
    except FileNotFoundError:
        return None, "source_pdf_missing"
    conf = json.dumps({"cmd": command, "sourceSha256": source_hash, "pageLimit": "all"}, sort_keys=True)
    stamp = target.with_suffix(target.suffix + ".config.sha256")
    if target.is_file() and stamp.is_file() and stamp.read_text().strip() == conf:
        return target, None
    target.parent.mkdir(parents=True, exist_ok=True)
    run_extractor(command, pdf, target, "all", conf)
    return target, None


def validate(args: argparse.Namespace) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    manifest_path = args.manifest.resolve()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    selected = parse_selection(args.booklets)
    db = connect_readonly(args.database)
    candidates: list[dict[str, Any]] = []
    summaries = []
    for booklet in manifest.get("booklets", []):
        identity = (int(booklet["edition"]), str(booklet["booklet"]).upper())
        if identity not in selected:
            continue
        structural: list[str] = []
        source_pdf = (manifest_path.parent.parent / str(booklet["source"])).resolve()
        if source_pdf.is_file():
            actual_hash = sha256(source_pdf)
            if actual_hash != booklet.get("sourceSha256"):
                structural.append("source_pdf_hash_mismatch")
        else:
            actual_hash = None
            structural.append("source_pdf_missing")
        markdown_path, extract_error = maybe_extract(booklet, manifest_path, args.cache, args.extract_command)
        if extract_error:
            structural.append(extract_error)
        if markdown_path is None:
            markdown_path = (manifest_path.parent / str(booklet["edition"]) / str(booklet["markdown"])).resolve()
        if markdown_path.is_file():
            extracted, parse_issues = parse_questions(markdown_path.read_text(encoding="utf-8"))
            structural.extend(parse_issues)
        else:
            extracted = {}
            structural.append("docling_markdown_missing")
        db_rows = db_records(db, int(booklet["sourceDocumentId"]))
        by_num = {int(row["number"]): row for row in db_rows}
        if len(db_rows) != 72:
            structural.append(f"database_occurrence_count_{len(db_rows)}_expected_72")
        if sorted(by_num) != list(range(1, 73)):
            structural.append("database_occurrence_order_not_1_to_72")
        missing, extra = sorted(set(by_num) - set(extracted)), sorted(set(extracted) - set(by_num))
        if missing:
            structural.append("database_occurrences_missing_from_extraction")
        if extra:
            structural.append("extracted_questions_without_database_occurrence")
        for number in sorted(set(by_num) & set(extracted)):
            row, got = by_num[number], extracted[number]
            expected_codes = sorted(row["options"])
            observed_codes = sorted(got["options"])
            issues = classify_option_extraction(
                list(got.get("issues", [])), observed_codes, expected_codes, got["stem"]
            )
            if expected_codes != ["A", "B", "C", "D"]:
                issues.append("database_options_not_exactly_A_to_D")
            elif observed_codes != expected_codes and "image_only_alternatives_require_visual_review" not in issues:
                issues.append("extracted_option_codes_do_not_match_database")
            if has_pdf_cid_artifact(row["statement"]) or any(
                    has_pdf_cid_artifact(option["text"]) for option in row["options"].values()):
                issues.append("database_pdf_cid_glyph_artifact_requires_visual_repair")
            if not row["answerKeys"]:
                issues.append("canonical_answer_key_missing")
            for key in row["answerKeys"]:
                bad = sorted(set(key["optionCodes"]) - set(expected_codes))
                if bad:
                    issues.append(f"answer_key_{key['id']}_references_unknown_options:{','.join(bad)}")
                if key["status"] not in ("definitive", "provisional", "cancelled"):
                    issues.append(f"answer_key_{key['id']}_invalid_status")
            review_flags = sorted({"math_or_markdown_punctuation_requires_visual_review" for text in
                                   [got["stem"], *got["options"].values()] if REVIEW_MARKUP.search(text)})
            text_comparison = compare_extracted_text(
                got["stem"], row["statement"], got["options"],
                {code: option["text"] for code, option in row["options"].items()},
            )
            candidate = {
                "kind": "question_candidate", "edition": identity[0], "booklet": identity[1],
                "sourceDocumentId": int(booklet["sourceDocumentId"]),
                "sourcePdfSha256": actual_hash, "occurrenceId": int(row["occurrence_id"]),
                "questionId": int(row["question_id"]), "bookletNumber": number,
                "originalNumber": row["original_number"], "pdfPage": row["source_page"],
                "questionStatus": row["question_status"], "occurrenceStatus": row["occurrence_status"],
                "expectedOptionCodes": expected_codes, "extractedOptionCodes": observed_codes,
                "extractedStem": got["stem"], "extractedOptions": got["options"],
                "textComparison": text_comparison,
                "answerKeys": row["answerKeys"], "issues": issues, "reviewFlags": review_flags,
                "humanApprovalRequired": True,
            }
            candidates.append(candidate)
        figures = []
        for fig in booklet.get("figures", []):
            relative = Path(str(booklet["booklet"])) / "figures" / str(fig.get("file", ""))
            image_path = manifest_path.parent / str(identity[0]) / relative
            figure_hash = sha256(image_path) if image_path.is_file() else None
            pages = [int(p.get("page")) for p in fig.get("provenance", []) if p.get("page") is not None]
            figures.append({"file": str(image_path), "exists": image_path.is_file(),
                            "sha256": figure_hash, "expectedSha256": fig.get("sha256"),
                            "hashMatches": figure_hash == fig.get("sha256"), "pages": pages,
                            "candidateQuestionNumbers": [r["bookletNumber"] for r in candidates
                                if r["edition"] == identity[0] and r["booklet"] == identity[1]
                                and r["pdfPage"] in pages], "requiresVisualAssociation": True})
        if any(not f["exists"] or not f["hashMatches"] for f in figures):
            structural.append("figure_manifest_missing_or_hash_mismatch")
        summaries.append({"kind": "booklet_summary", "edition": identity[0], "booklet": identity[1],
                          "sourceDocumentId": int(booklet["sourceDocumentId"]),
                          "sourcePdfSha256": actual_hash, "databaseOccurrenceCount": len(db_rows),
                          "extractedQuestionCount": len(extracted),
                          "questionCandidates": sum(1 for c in candidates
                              if c["edition"] == identity[0] and c["booklet"] == identity[1]),
                          "figureCount": len(figures), "figureCandidates": figures,
                          "structuralIssues": sorted(set(structural)),
                          "questionIssueCount": sum(bool(c["issues"]) for c in candidates
                              if c["edition"] == identity[0] and c["booklet"] == identity[1]),
                          "textComparisonTriage": {
                              status: sum(1 for c in candidates
                                          if c["edition"] == identity[0] and c["booklet"] == identity[1]
                                          and c["textComparison"]["triage"] == status)
                              for status in ("strong_text_overlap", "intermediate_text_overlap",
                                             "low_text_overlap", "partial_text_or_image_content",
                                             "insufficient_extracted_text")
                          },
                          "validationPassed": not structural and not any(c["issues"] for c in candidates
                              if c["edition"] == identity[0] and c["booklet"] == identity[1])})
    db.close()
    missed = selected - {(s["edition"], s["booklet"]) for s in summaries}
    for year, code in sorted(missed):
        summaries.append({"kind": "booklet_summary", "edition": year, "booklet": code,
                          "structuralIssues": ["booklet_missing_from_manifest"], "validationPassed": False})
    report = {"format": "bulk-pdf-qa-import/v1", "generatedAt": datetime.now(timezone.utc).isoformat(),
              "databasePath": str(args.database.resolve()), "databaseSha256": sha256(args.database),
              "manifestPath": str(manifest_path), "manifestSha256": sha256(manifest_path),
              "booklets": summaries, "candidateCount": len(candidates),
              "exceptions": [{"edition": c["edition"], "booklet": c["booklet"],
                              "question": c["bookletNumber"], "issues": c["issues"],
                              "reviewFlags": c["reviewFlags"]}
                             for c in candidates if c["issues"] or c["reviewFlags"]],
              "validationPassed": bool(summaries) and all(s.get("validationPassed") for s in summaries),
              "databaseModified": False, "humanApprovalRequired": True,
              "policy": "Docling candidates never auto-approve and cannot replace published corrected text."}
    return report, candidates


def apply_reviewed(args: argparse.Namespace, report: dict[str, Any]) -> int:
    if not args.reviewed:
        raise ValueError("--apply requires --reviewed JSONL containing explicit human approvals")
    if not report["validationPassed"]:
        raise ValueError("refusing apply: current batch validation has structural or question issues")
    records = [json.loads(line) for line in args.reviewed.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not records:
        raise ValueError("review file is empty")
    validated: dict[tuple[int, str, int], dict[str, Any]] = {}
    # Re-read the same source candidates and bind every approval to one exact row.
    fresh_report, fresh_candidates = validate(args)
    if fresh_report["databaseSha256"] != report["databaseSha256"]:
        raise ValueError("database changed between validation and apply")
    for candidate in fresh_candidates:
        validated[(candidate["sourceDocumentId"], candidate["booklet"], candidate["questionId"])] = candidate
    db_path = args.database.resolve()
    backup = db_path.with_name(db_path.name + ".pre-pdf-import-" + datetime.now().strftime("%Y%m%d-%H%M%S") + ".bak")
    if backup.exists():
        raise ValueError(f"backup already exists: {backup}")
    src = sqlite3.connect(db_path)
    dest = sqlite3.connect(backup)
    try:
        src.backup(dest)
    finally:
        dest.close()
    db = sqlite3.connect(db_path)
    try:
        db.execute("BEGIN IMMEDIATE")
        if sha256(db_path) != report["databaseSha256"]:
            raise ValueError("database changed before the apply transaction acquired its write lock")
        for item in records:
            if item.get("approved") is not True or not item.get("reviewer"):
                raise ValueError("every apply row requires approved=true and a non-empty reviewer")
            if item.get("sourcePdfSha256") not in {b["sourcePdfSha256"] for b in report["booklets"]}:
                raise ValueError("reviewed row source hash does not match this batch")
            if item.get("field") not in ("statement", "option"):
                raise ValueError("only statement and option fields are importable")
            if item.get("field") not in item.get("reviewedFields", []):
                raise ValueError("field must be explicitly listed in reviewedFields")
            candidate = validated.get((int(item["sourceDocumentId"]), str(item["booklet"]).upper(), int(item["questionId"])))
            if not candidate or candidate["sourcePdfSha256"] != item["sourcePdfSha256"]:
                raise ValueError("reviewed row does not match its exact question candidate and source hash")
            if candidate["issues"]:
                raise ValueError("candidate with structural issues cannot be imported")
            if not set(candidate["reviewFlags"]).issubset(set(item.get("reviewedFlags", []))):
                raise ValueError("reviewedFlags must explicitly acknowledge every candidate review flag")
            if item["field"] == "statement":
                candidate_value = candidate["extractedStem"]
            else:
                code = str(item.get("optionCode", "")).upper()
                if code not in candidate["extractedOptions"]:
                    raise ValueError("reviewed option code is absent from the candidate")
                candidate_value = candidate["extractedOptions"][code]
            if item.get("value") != candidate_value:
                raise ValueError("approved value must exactly match the reviewed candidate field")
            existing = db.execute("SELECT status FROM questions WHERE id=?", (item["questionId"],)).fetchone()
            if not existing or existing[0] == "published":
                raise ValueError("published or missing question cannot be overwritten by Docling")
            if item["field"] == "statement":
                db.execute("UPDATE questions SET statement=? WHERE id=?", (item["value"], item["questionId"]))
            else:
                code = str(item.get("optionCode", "")).upper()
                db.execute("UPDATE question_options SET text=? WHERE question_id=? AND upper(code)=?",
                           (item["value"], item["questionId"], code))
                if db.execute("SELECT changes()").fetchone()[0] != 1:
                    raise ValueError("option update did not match exactly one existing option")
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
    print(f"Applied {len(records)} reviewed field(s); backup: {backup}")
    return 0


def repair_id(record: dict[str, Any]) -> str:
    payload = json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def text_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def load_repair_history(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"format": "pdf-published-repair-history/v1", "history": []}
    doc = json.loads(path.read_text(encoding="utf-8"))
    if doc.get("format") != "pdf-published-repair-history/v1" or not isinstance(doc.get("history"), list):
        raise ValueError(f"invalid repair history sidecar: {path}")
    return doc


def repair_source_map(manifest_path: Path) -> dict[int, dict[str, Any]]:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    result: dict[int, dict[str, Any]] = {}
    for booklet in manifest.get("booklets", []):
        source_id = int(booklet["sourceDocumentId"])
        if source_id in result:
            raise ValueError(f"manifest has duplicate sourceDocumentId {source_id}")
        pdf = (manifest_path.parent.parent / str(booklet["source"])).resolve()
        result[source_id] = {**booklet, "pdfPath": pdf}
    return result


def read_repair_current(db: sqlite3.Connection, record: dict[str, Any]) -> tuple[str, str]:
    occurrence = db.execute(
        """SELECT o.question_id,o.source_document_id,q.status question_status,q.statement
           FROM question_occurrences o JOIN questions q ON q.id=o.question_id
           WHERE o.id=?""", (record["occurrenceId"],)
    ).fetchone()
    if not occurrence:
        raise ValueError("unmatched occurrenceId")
    if int(occurrence["question_id"]) != int(record["questionId"]):
        raise ValueError("occurrenceId does not belong to questionId")
    if int(occurrence["source_document_id"] or -1) != int(record["sourceDocumentId"]):
        raise ValueError("occurrenceId does not belong to sourceDocumentId")
    field = str(record["field"])
    if field == "statement":
        return str(occurrence["question_status"]), str(occurrence["statement"])
    match = re.fullmatch(r"option:([A-D])", field)
    if not match:
        raise ValueError("field must be 'statement' or an exact option label such as 'option:C'")
    rows = db.execute("SELECT text FROM question_options WHERE question_id=? AND code=?",
                      (record["questionId"], match.group(1))).fetchall()
    if len(rows) != 1:
        raise ValueError("option field does not match exactly one option on the question")
    return str(occurrence["question_status"]), str(rows[0]["text"])


def validate_repair_record(db: sqlite3.Connection, record: dict[str, Any],
                           sources: dict[int, dict[str, Any]], history_ids: set[str]) -> dict[str, Any]:
    required = ("sourceDocumentId", "occurrenceId", "questionId", "sourcePdfSha256", "field",
                "expectedCurrentValue", "expectedCurrentSha256", "newValue", "reason", "evidence", "reviewer")
    missing = [key for key in required if key not in record or record[key] in (None, "")]
    if missing:
        raise ValueError("missing required repair fields: " + ",".join(missing))
    for key in ("expectedCurrentValue", "expectedCurrentSha256", "newValue", "reason", "evidence", "reviewer", "sourcePdfSha256"):
        if not isinstance(record[key], str) or not record[key].strip():
            raise ValueError(f"repair field {key} must be a non-empty string")
    if record.get("approved") is not True:
        raise ValueError("published question repair requires explicit approved=true review")
    source_id = int(record["sourceDocumentId"])
    source = sources.get(source_id)
    if not source:
        raise ValueError("sourceDocumentId is unmatched in the extraction manifest")
    if record["sourcePdfSha256"] != source.get("sourceSha256"):
        raise ValueError("sourcePdfSha256 does not match the manifest source")
    pdf_path = source["pdfPath"]
    if not pdf_path.is_file() or sha256(pdf_path) != record["sourcePdfSha256"]:
        raise ValueError("source PDF is missing or its SHA-256 does not match")
    current_repair_id = repair_id(record)
    status, current = read_repair_current(db, record)
    if status != "published":
        raise ValueError(f"sidecar published-repair workflow requires published status (found {status})")
    if current_repair_id in history_ids:
        if current != record["newValue"]:
            raise ValueError("repair history says applied, but current field no longer equals newValue")
        return {"repairId": current_repair_id, "status": "already_applied", "field": record["field"]}
    if current != record["expectedCurrentValue"]:
        raise ValueError("stale expectedCurrentValue")
    if text_hash(current) != record["expectedCurrentSha256"]:
        raise ValueError("stale expectedCurrentSha256")
    if current == record["newValue"]:
        raise ValueError("newValue already equals current value without matching history; refusing ambiguous repeat")
    return {"repairId": current_repair_id, "status": "ready", "field": record["field"]}


def apply_repair_field(db: sqlite3.Connection, record: dict[str, Any]) -> None:
    match = re.fullmatch(r"option:([A-D])", str(record["field"]))
    if record["field"] == "statement":
        db.execute("UPDATE questions SET statement=? WHERE id=? AND status='published'",
                   (record["newValue"], record["questionId"]))
    elif match:
        db.execute("""UPDATE question_options SET text=? WHERE question_id=? AND code=?
                   AND EXISTS (SELECT 1 FROM questions q WHERE q.id=question_options.question_id AND q.status='published')""",
                   (record["newValue"], record["questionId"], match.group(1)))
    else:
        raise ValueError("invalid exact field")
    if db.execute("SELECT changes()").fetchone()[0] != 1:
        raise ValueError("repair update did not match exactly one published field")


def write_repair_history(path: Path, history: dict[str, Any]) -> None:
    write_json_durable(path, history)


def write_json_durable(path: Path, document: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    with temporary.open("w", encoding="utf-8") as stream:
        stream.write(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temporary, path)
    directory_fd = os.open(path.parent, os.O_RDONLY)
    try:
        os.fsync(directory_fd)
    finally:
        os.close(directory_fd)


def pending_journal_path(history_path: Path) -> Path:
    return history_path.with_name(history_path.name + ".pending.json")


def remove_pending_journal(path: Path) -> None:
    if path.exists():
        path.unlink()
        directory_fd = os.open(path.parent, os.O_RDONLY)
        try:
            os.fsync(directory_fd)
        finally:
            os.close(directory_fd)


def recover_pending_repair(database: Path, history_path: Path) -> dict[str, Any] | None:
    pending_path = pending_journal_path(history_path)
    if not pending_path.is_file():
        return None
    pending = json.loads(pending_path.read_text(encoding="utf-8"))
    if pending.get("format") != "pdf-published-repair-pending/v1" or not pending.get("records"):
        raise ValueError(f"invalid pending repair journal; preserve for manual recovery: {pending_path}")
    db = connect_readonly(database)
    try:
        states = []
        for item in pending["records"]:
            record = item["record"]
            _, current = read_repair_current(db, record)
            if current == record["newValue"]:
                states.append("committed")
            elif current == record["expectedCurrentValue"] and text_hash(current) == record["expectedCurrentSha256"]:
                states.append("not_committed")
            else:
                states.append("diverged")
    finally:
        db.close()
    if all(state == "not_committed" for state in states):
        remove_pending_journal(pending_path)
        return {"recovery": "discarded_uncommitted_journal", "databaseModified": False}
    if not all(state == "committed" for state in states):
        raise RuntimeError(f"pending repair journal has mixed or divergent database values; manual recovery required: {pending_path}")
    history = load_repair_history(history_path)
    known = {entry["repairId"] for entry in history["history"]}
    history["history"].extend(
        {"repairId": item["repairId"], "appliedAt": pending["appliedAt"],
         "record": item["record"], "backupPath": pending["backupPath"]}
        for item in pending["records"] if item["repairId"] not in known
    )
    write_repair_history(history_path, history)
    remove_pending_journal(pending_path)
    return {"recovery": "completed_committed_history", "databaseModified": False,
            "historyPath": str(history_path), "recoveredRepairs": len(pending["records"])}


def run_repair_plan(database: Path, manifest_path: Path, plan_path: Path,
                    history_path: Path, *, apply: bool = False) -> dict[str, Any]:
    records = [json.loads(line) for line in plan_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not records:
        raise ValueError("repair plan is empty")
    recovery = recover_pending_repair(database.resolve(), history_path) if apply else None
    history = load_repair_history(history_path)
    history_ids = {entry["repairId"] for entry in history["history"]}
    sources = repair_source_map(manifest_path.resolve())
    seen_targets: set[tuple[int, int, str]] = set()
    for record in records:
        target = (int(record.get("sourceDocumentId", -1)), int(record.get("occurrenceId", -1)), str(record.get("field", "")))
        if target in seen_targets:
            raise ValueError(f"duplicate target in one repair batch: {target}")
        seen_targets.add(target)

    db_path = database.resolve()
    if not apply:
        db = connect_readonly(db_path)
        try:
            outcomes = [validate_repair_record(db, row, sources, history_ids) for row in records]
        finally:
            db.close()
        return {"format": "pdf-published-repair-plan/v1", "mode": "dry-run",
                "databaseModified": False, "repairCount": len(records), "outcomes": outcomes,
                "allReadyOrAlreadyApplied": all(row["status"] in ("ready", "already_applied") for row in outcomes)}

    # Idempotent all-applied reruns need no backup or write transaction.
    readonly = connect_readonly(db_path)
    try:
        preflight = [validate_repair_record(readonly, row, sources, history_ids) for row in records]
    finally:
        readonly.close()
    if all(row["status"] == "already_applied" for row in preflight):
        return {"format": "pdf-published-repair-plan/v1", "mode": "apply", "databaseModified": False,
                "repairCount": len(records), "outcomes": preflight, "idempotentReplay": True,
                "recovery": recovery}

    backup = db_path.with_name(db_path.name + ".pre-published-pdf-repair-" +
                               datetime.now().strftime("%Y%m%d-%H%M%S-%f") + ".bak")
    src = sqlite3.connect(db_path)
    backup_db = sqlite3.connect(backup)
    try:
        src.backup(backup_db)
    finally:
        backup_db.close()
        src.close()

    ready_records = [row for row, result in zip(records, preflight) if result["status"] == "ready"]
    applied_at = datetime.now(timezone.utc).isoformat()
    pending_path = pending_journal_path(history_path)
    if pending_path.exists():
        raise RuntimeError(f"pending repair journal already exists; recover it first: {pending_path}")
    pending = {"format": "pdf-published-repair-pending/v1",
               "batchId": hashlib.sha256("\n".join(repair_id(row) for row in ready_records).encode()).hexdigest(),
               "appliedAt": applied_at, "backupPath": str(backup),
               "records": [{"repairId": repair_id(row), "record": row} for row in ready_records]}
    write_json_durable(pending_path, pending)

    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    applied: list[dict[str, Any]] = []
    outcomes: list[dict[str, Any]] = []
    committed = False
    try:
        db.execute("BEGIN IMMEDIATE")
        for row in records:
            result = validate_repair_record(db, row, sources, history_ids)
            outcomes.append(result)
            if result["status"] == "already_applied":
                continue
            apply_repair_field(db, row)
            applied.append(row)
        db.commit()
        committed = True
    except Exception:
        if db.in_transaction:
            db.rollback()
            remove_pending_journal(pending_path)
        raise
    finally:
        db.close()

    if committed and applied:
        known = {entry["repairId"] for entry in history["history"]}
        history["history"].extend({"repairId": repair_id(row), "appliedAt": applied_at,
                                   "record": row, "backupPath": str(backup)} for row in applied
                                  if repair_id(row) not in known)
        write_repair_history(history_path, history)
        remove_pending_journal(pending_path)
    return {"format": "pdf-published-repair-plan/v1", "mode": "apply", "databaseModified": bool(applied),
            "repairCount": len(records), "outcomes": outcomes, "backupPath": str(backup) if applied else None,
            "historyPath": str(history_path) if applied else None, "idempotentReplay": not applied,
            "recovery": recovery}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DEFAULT_DATABASE)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--booklets", default=DEFAULT_BOOKLETS, help="comma-separated YEAR:CODE pairs")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--dry-run", action="store_true", help="explicitly force read-only validation")
    parser.add_argument("--apply", action="store_true", help="apply separately reviewed fields transactionally")
    parser.add_argument("--reviewed", type=Path, help="human-approved JSONL, required with --apply")
    parser.add_argument("--extract-command", help="argv template with {pdf} and {output}; optional {page_limit}")
    parser.add_argument("--cache", type=Path, default=HERE / "cache")
    parser.add_argument("--calibrate", action="store_true", help="create two-page samples only; review before full extraction")
    parser.add_argument("--calibration-approval", type=Path,
                        help="JSON approval file binding reviewer approval to source, config, and sample hashes")
    parser.add_argument("--repair-plan", type=Path, help="explicit reviewed published-field repair JSONL")
    parser.add_argument("--apply-repairs", action="store_true", help="apply --repair-plan with backup and transaction")
    parser.add_argument("--repair-history", type=Path, default=DEFAULT_REPAIR_HISTORY,
                        help="sidecar JSON history appended after a committed repair batch")
    args = parser.parse_args(argv)
    if (args.apply or args.apply_repairs) and args.dry_run:
        parser.error("apply modes and --dry-run are mutually exclusive")
    if args.calibrate and not args.extract_command:
        parser.error("--calibrate requires --extract-command")
    if args.calibrate and args.calibration_approval:
        parser.error("--calibrate creates samples only; use --calibration-approval on a later full run")
    if not args.database.is_file() or not args.manifest.is_file():
        parser.error("database and manifest must exist")
    if args.repair_plan:
        if args.apply or args.reviewed or args.extract_command or args.calibrate or args.calibration_approval:
            parser.error("published repair mode is separate from extraction and the legacy --apply workflow")
        result = run_repair_plan(args.database, args.manifest, args.repair_plan,
                                 args.repair_history, apply=args.apply_repairs)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0 if result.get("allReadyOrAlreadyApplied", True) else 1
    if args.apply_repairs:
        parser.error("--apply-repairs requires --repair-plan")
    if args.calibrate:
        manifest_doc = json.loads(args.manifest.read_text(encoding="utf-8"))
        selected = parse_selection(args.booklets)
        selected_booklets = [b for b in manifest_doc.get("booklets", [])
                             if (int(b["edition"]), str(b["booklet"]).upper()) in selected]
        calibration_rows = [calibrate_extractor(b, args.manifest.resolve(), args.cache, args.extract_command)
                            for b in selected_booklets]
        if args.output.exists():
            parser.error(f"refusing to overwrite report: {args.output}")
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps({"format": "pdf-extraction-calibration/v1",
                                           "status": "awaiting_human_review",
                                           "calibrations": calibration_rows}, ensure_ascii=False, indent=2) + "\n",
                               encoding="utf-8")
        print(f"Created {len(calibration_rows)} two-page calibration sample(s); full extraction was not run.")
        print(f"Calibration review report: {args.output}")
        return 0
    if args.extract_command:
        if not args.calibration_approval or not args.calibration_approval.is_file():
            parser.error("full extraction requires --calibration-approval; first run --calibrate and review its samples")
        manifest_doc = json.loads(args.manifest.read_text(encoding="utf-8"))
        selected = parse_selection(args.booklets)
        selected_booklets = [b for b in manifest_doc.get("booklets", [])
                             if (int(b["edition"]), str(b["booklet"]).upper()) in selected]
        verify_calibration_approvals(selected_booklets, args.manifest.resolve(), args.cache,
                                     args.extract_command, args.calibration_approval)
    report, candidates = validate(args)
    if args.apply:
        return apply_reviewed(args, report)
    if args.output.exists():
        parser.error(f"refusing to overwrite report: {args.output}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("x", encoding="utf-8") as stream:
        for record in [report, *report["booklets"], *candidates]:
            stream.write(json.dumps(record, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"QA report: {args.output}")
    return 0 if report["validationPassed"] else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, RuntimeError, sqlite3.Error, OSError, subprocess.CalledProcessError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(2)
