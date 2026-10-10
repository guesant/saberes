#!/usr/bin/env python3
"""Bundle already-downloaded source PDFs, without changing editorial approval."""
import hashlib
import json
from pathlib import Path
import shutil
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
SOURCES = ROOT / '.local/content/staging/unicamp-2027-v1'
BUNDLE = SOURCES / 'offline-assets-2026-2027'


def main():
    manifest = BUNDLE / 'asset-manifest.jsonl'
    records = [json.loads(line) for line in manifest.read_text().splitlines() if line.strip()]
    known = {record['path'] for record in records}
    with sqlite3.connect(f'file:{ROOT / ".local/content/content.sqlite"}?mode=ro', uri=True) as db:
        db.row_factory = sqlite3.Row
        rows = db.execute('''SELECT a.*, sd.title, sd.url, sd.provider, sd.kind,
            sd.is_official, sd.reuse_status, sd.rights_note
            FROM content_assets a LEFT JOIN source_documents sd ON sd.id=a.source_document_id
            WHERE lower(a.media_type)='application/pdf' ORDER BY a.id''').fetchall()
    additions = []
    for row in rows:
        if row['path'] in known:
            continue
        source = (SOURCES / row['path']).resolve()
        target = (BUNDLE / 'data' / row['path']).resolve()
        if not source.is_relative_to(SOURCES.resolve()) or not target.is_relative_to((BUNDLE / 'data').resolve()):
            raise ValueError('Unsafe asset path')
        checksum = hashlib.sha256(source.read_bytes()).hexdigest()
        if not row['checksum'] or checksum != row['checksum']:
            raise ValueError(f"Unverified PDF: {row['path']}")
        additions.append((source, target, {
            'format': 'offline-content-asset/v1', 'path': row['path'],
            'appUrlSuffix': 'data/' + row['path'], 'contentAssetId': row['id'],
            'mediaType': row['media_type'], 'altText': row['alt_text'],
            'sourceDocumentId': row['source_document_id'], 'sourceTitle': row['title'],
            'sourceUrl': row['url'], 'provider': row['provider'], 'sourceKind': row['kind'],
            'officialSource': bool(row['is_official']), 'editorialStatus': 'review',
            'rightsReview': row['rights_note'] or row['reuse_status'],
            'sha256': checksum, 'bytes': source.stat().st_size,
        }))
    for source, target, record in additions:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        records.append(record)
    manifest.write_text(''.join(json.dumps(record, ensure_ascii=False, sort_keys=True) + '\n' for record in records))
    print(json.dumps({'added': len(additions), 'database_modified': False}))


if __name__ == '__main__':
    main()
