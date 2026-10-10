#!/usr/bin/env python3
"""Remove extracted question images that are now replaced by source PDF pages.

Dry-run by default. `--apply` first creates a recoverable SQLite and asset backup,
then removes only image links whose question has a locally bundled source PDF and
page. Assets still referenced elsewhere are retained.
"""

from __future__ import annotations

import argparse
import json
import shutil
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DB = ROOT / ".local/content/content.sqlite"
DEFAULT_ASSET_ROOT = ROOT / ".local/content/staging/unicamp-2027-v1/offline-assets-2026-2027/data"
DEFAULT_SOURCE_ROOT = ROOT / ".local/content/staging/unicamp-2027-v1"
DEFAULT_MANIFEST = ROOT / ".local/content/staging/unicamp-2027-v1/offline-assets-2026-2027/asset-manifest.jsonl"
DEFAULT_BACKUP_ROOT = ROOT / ".local/content/backups"


def references_to_content_assets(connection: sqlite3.Connection, asset_id: int) -> list[dict[str, Any]]:
    references: list[dict[str, Any]] = []
    tables = connection.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).fetchall()

    for (table_name,) in tables:
        if table_name == "content_assets":
            continue
        foreign_keys = connection.execute(f'PRAGMA foreign_key_list("{table_name}")').fetchall()
        for foreign_key in foreign_keys:
            referenced_table = foreign_key[2]
            referenced_column = foreign_key[4] or "id"
            if referenced_table != "content_assets":
                continue
            column = foreign_key[3]
            safe_table = table_name.replace('"', '""')
            safe_column = column.replace('"', '""')
            count = connection.execute(
                f'SELECT COUNT(*) FROM "{safe_table}" WHERE "{safe_column}" = ?',
                (asset_id,),
            ).fetchone()[0]
            if count:
                references.append({"table": table_name, "column": column, "count": count})

    return references


def question_has_local_pdf_page(connection: sqlite3.Connection, question_id: int) -> bool:
    return connection.execute(
        """
        SELECT 1
        FROM question_occurrences qo
        LEFT JOIN papers p ON p.id = qo.paper_id
        LEFT JOIN paper_versions pv ON pv.id = qo.paper_version_id
        WHERE qo.question_id = ?
          AND qo.source_page IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM content_assets pdf
            WHERE pdf.source_document_id = COALESCE(qo.source_document_id, pv.source_document_id, p.source_document_id)
              AND lower(pdf.media_type) = 'application/pdf'
          )
        LIMIT 1
        """,
        (question_id,),
    ).fetchone() is not None


def build_plan(connection: sqlite3.Connection) -> dict[str, Any]:
    links = connection.execute(
        """
        SELECT qa.question_id, qa.asset_id, a.path, a.media_type
        FROM question_assets qa
        JOIN content_assets a ON a.id = qa.asset_id
        WHERE a.media_type LIKE 'image/%'
          AND EXISTS (
            SELECT 1
            FROM question_occurrences qo
            LEFT JOIN papers p ON p.id = qo.paper_id
            LEFT JOIN paper_versions pv ON pv.id = qo.paper_version_id
            WHERE qo.question_id = qa.question_id
              AND qo.source_page IS NOT NULL
              AND EXISTS (
                SELECT 1
                FROM content_assets pdf
                WHERE pdf.source_document_id = COALESCE(qo.source_document_id, pv.source_document_id, p.source_document_id)
                  AND lower(pdf.media_type) = 'application/pdf'
              )
          )
        ORDER BY qa.asset_id, qa.question_id
        """
    ).fetchall()

    candidate_asset_ids = {int(row[1]) for row in links}
    link_rows = [
        {"question_id": int(row[0]), "asset_id": int(row[1]), "path": str(row[2]), "media_type": str(row[3])}
        for row in links
    ]

    stimulus_links: list[dict[str, int]] = []

    # Some extracted crops were linked only to shared stimuli, not directly to
    # question_assets. Replace those too, but only when every owning question
    # has a local PDF page.
    crop_assets = connection.execute(
        "SELECT id, path FROM content_assets WHERE media_type LIKE 'image/%' AND path LIKE '%/question-assets/%'"
    ).fetchall()
    for asset_id, path in crop_assets:
        owners = connection.execute(
            """
            SELECT question_id FROM question_assets WHERE asset_id = ?
            UNION
            SELECT qs.question_id
            FROM stimulus_assets sa
            JOIN question_stimuli qs ON qs.stimulus_id = sa.stimulus_id
            WHERE sa.asset_id = ?
            """,
            (asset_id, asset_id),
        ).fetchall()
        owner_ids = [int(owner[0]) for owner in owners]
        if owner_ids and all(question_has_local_pdf_page(connection, owner_id) for owner_id in owner_ids):
            candidate_asset_ids.add(int(asset_id))
            for (stimulus_id,) in connection.execute(
                "SELECT stimulus_id FROM stimulus_assets WHERE asset_id = ?",
                (asset_id,),
            ).fetchall():
                stimulus_owners = connection.execute(
                    "SELECT question_id FROM question_stimuli WHERE stimulus_id = ?",
                    (stimulus_id,),
                ).fetchall()
                if stimulus_owners and all(
                    question_has_local_pdf_page(connection, int(owner[0]))
                    for owner in stimulus_owners
                ):
                    stimulus_links.append({"stimulus_id": int(stimulus_id), "asset_id": int(asset_id)})

    # All bundled official-PDF page renders and simulator question screenshots
    # are now redundant: the UI opens the original PDF at its recorded page.
    # Remove these image assets only when their owners have a local PDF page,
    # or when they are already orphaned; preserve assets with other consumers.
    page_images = connection.execute(
        """
        SELECT id, path FROM content_assets
        WHERE media_type LIKE 'image/%'
          AND (path LIKE 'official-pdfs/%' OR path LIKE 'official-simulator-images/%')
        ORDER BY id
        """
    ).fetchall()
    for asset_id, path in page_images:
        asset_id = int(asset_id)
        references = references_to_content_assets(connection, asset_id)
        if any(reference["table"] not in ("question_assets", "stimulus_assets") for reference in references):
            continue

        question_owners = connection.execute(
            """
            SELECT question_id FROM question_assets WHERE asset_id = ?
            UNION
            SELECT qs.question_id
            FROM stimulus_assets sa
            JOIN question_stimuli qs ON qs.stimulus_id = sa.stimulus_id
            WHERE sa.asset_id = ?
            """,
            (asset_id, asset_id),
        ).fetchall()
        if question_owners and not all(
            question_has_local_pdf_page(connection, int(owner[0])) for owner in question_owners
        ):
            continue

        candidate_asset_ids.add(asset_id)
        for (question_id,) in connection.execute(
            "SELECT question_id FROM question_assets WHERE asset_id = ?", (asset_id,)
        ).fetchall():
            link = {"question_id": int(question_id), "asset_id": asset_id}
            if link not in link_rows:
                link_rows.append(link)
        for (stimulus_id,) in connection.execute(
            "SELECT stimulus_id FROM stimulus_assets WHERE asset_id = ?", (asset_id,)
        ).fetchall():
            owners = connection.execute(
                "SELECT question_id FROM question_stimuli WHERE stimulus_id = ?", (stimulus_id,)
            ).fetchall()
            if owners and all(
                question_has_local_pdf_page(connection, int(owner[0])) for owner in owners
            ):
                link = {"stimulus_id": int(stimulus_id), "asset_id": asset_id}
                if link not in stimulus_links:
                    stimulus_links.append(link)

    candidate_asset_ids = sorted(candidate_asset_ids)

    planned_question_counts: dict[int, int] = {}
    for link in link_rows:
        planned_question_counts[link["asset_id"]] = planned_question_counts.get(link["asset_id"], 0) + 1
    planned_stimulus_counts: dict[int, int] = {}
    for link in stimulus_links:
        planned_stimulus_counts[link["asset_id"]] = planned_stimulus_counts.get(link["asset_id"], 0) + 1

    assets_to_delete: list[dict[str, Any]] = []
    shared_assets: list[dict[str, Any]] = []
    for asset_id in candidate_asset_ids:
        asset = connection.execute(
            "SELECT id, path, media_type, source_document_id, checksum FROM content_assets WHERE id = ?",
            (asset_id,),
        ).fetchone()
        if asset is None:
            continue

        references = references_to_content_assets(connection, asset_id)
        remaining = [
            reference
            for reference in references
            if (
                reference["table"] == "question_assets"
                and reference["count"] > planned_question_counts.get(asset_id, 0)
            )
            or (
                reference["table"] == "stimulus_assets"
                and reference["count"] > planned_stimulus_counts.get(asset_id, 0)
            )
            or reference["table"] not in ("question_assets", "stimulus_assets")
        ]
        if remaining:
            shared_assets.append({"id": asset_id, "path": str(asset[1]), "references": remaining})
        else:
            assets_to_delete.append(
                {
                    "id": asset_id,
                    "path": str(asset[1]),
                    "media_type": str(asset[2]),
                    "source_document_id": asset[3],
                    "checksum": asset[4],
                }
            )

    return {
        "question_asset_links": link_rows,
        "stimulus_asset_links": stimulus_links,
        "assets_to_delete": assets_to_delete,
        "shared_assets_retained": shared_assets,
    }


def safe_path(root: Path, relative: str) -> Path:
    path = (root / relative).resolve()
    path.relative_to(root.resolve())
    return path


def copy_file_if_present(source: Path, destination: Path) -> int:
    if not source.is_file():
        return 0
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
    return source.stat().st_size


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DEFAULT_DB)
    parser.add_argument("--asset-root", type=Path, default=DEFAULT_ASSET_ROOT)
    parser.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE_ROOT)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--backup-root", type=Path, default=DEFAULT_BACKUP_ROOT)
    parser.add_argument("--apply", action="store_true", help="Create backup and perform the removal")
    args = parser.parse_args()

    connection = sqlite3.connect(args.database)
    connection.row_factory = sqlite3.Row
    plan = build_plan(connection)

    removable_paths = {asset["path"] for asset in plan["assets_to_delete"]}
    files = []
    for relative in sorted(removable_paths):
        copies = []
        for label, root in (("offline_assets", args.asset_root), ("source_staging", args.source_root)):
            source = safe_path(root, relative)
            if source.is_file():
                copies.append({"location": label, "path": str(source), "bytes": source.stat().st_size})
        files.extend(copies)

    plan["manifest_paths_to_remove"] = sorted(removable_paths)
    plan["files_to_remove"] = files
    plan["question_asset_link_count"] = len(plan["question_asset_links"])
    plan["asset_file_count"] = len(removable_paths)
    plan["physical_file_count"] = len(files)
    plan["physical_bytes"] = sum(item["bytes"] for item in files)

    if not args.apply:
        print(json.dumps(plan, indent=2, ensure_ascii=False))
        return 0

    if not args.database.is_file() or not args.manifest.is_file():
        raise FileNotFoundError("Database or asset manifest is missing; refusing to apply.")

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup_dir = args.backup_root / f"pdfjs-question-images-{stamp}"
    backup_dir.mkdir(parents=True, exist_ok=False)

    backup_connection = sqlite3.connect(backup_dir / "content.sqlite")
    connection.backup(backup_connection)
    backup_connection.close()
    shutil.copy2(args.manifest, backup_dir / "asset-manifest.jsonl")

    for asset in plan["assets_to_delete"]:
        relative = asset["path"]
        for label, root in (("offline_assets", args.asset_root), ("source_staging", args.source_root)):
            source = safe_path(root, relative)
            if source.is_file():
                destination_root = backup_dir / label
                destination = safe_path(destination_root, relative)
                copy_file_if_present(source, destination)

    try:
        connection.execute("BEGIN IMMEDIATE")
        for link in plan["question_asset_links"]:
            connection.execute(
                "DELETE FROM question_assets WHERE question_id = ? AND asset_id = ?",
                (link["question_id"], link["asset_id"]),
            )
        for link in plan["stimulus_asset_links"]:
            connection.execute(
                "DELETE FROM stimulus_assets WHERE stimulus_id = ? AND asset_id = ?",
                (link["stimulus_id"], link["asset_id"]),
            )

        deleted_asset_ids: list[int] = []
        for asset in plan["assets_to_delete"]:
            if references_to_content_assets(connection, asset["id"]):
                raise RuntimeError(f"Asset {asset['id']} still has database references after unlinking.")
            connection.execute("DELETE FROM content_assets WHERE id = ?", (asset["id"],))
            deleted_asset_ids.append(asset["id"])

        connection.commit()
    except Exception:
        connection.rollback()
        shutil.rmtree(backup_dir)
        raise

    for relative in removable_paths:
        for root in (args.asset_root, args.source_root):
            source = safe_path(root, relative)
            if source.is_file():
                source.unlink()

    kept_lines = []
    for line in args.manifest.read_text(encoding="utf-8").splitlines():
        record = json.loads(line)
        if record.get("path") not in removable_paths:
            kept_lines.append(json.dumps(record, ensure_ascii=False, separators=(",", ":")))
    args.manifest.write_text("\n".join(kept_lines) + ("\n" if kept_lines else ""), encoding="utf-8")

    plan["deleted_asset_ids"] = deleted_asset_ids
    plan["backup_dir"] = str(backup_dir)
    plan["applied_at"] = datetime.now(timezone.utc).isoformat()
    report_path = backup_dir / "removal-report.json"
    report_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    connection.close()
    print(json.dumps({key: plan[key] for key in (
        "question_asset_link_count",
        "asset_file_count",
        "physical_file_count",
        "physical_bytes",
        "shared_assets_retained",
        "backup_dir",
        "deleted_asset_ids",
    )}, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
