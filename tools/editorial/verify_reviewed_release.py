#!/usr/bin/env python3
"""Verify a local reviewed release, bundled assets, identities and answer history."""
import argparse
import hashlib
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[2]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(baseline):
    main = ROOT / '.local/content/content.sqlite'
    built = ROOT / 'dist/data/content.sqlite'
    release = json.loads((ROOT / '.local/content/guided-study-release.json').read_text())
    checksum = digest(main)
    if checksum != digest(built) or checksum != release['database_sha256']:
        raise ValueError('Main, built SQLite and release checksum disagree')
    manifest_root = ROOT / '.local/content/staging/unicamp-2027-v1/offline-assets-2026-2027'
    assets = [json.loads(line) for line in (manifest_root / 'asset-manifest.jsonl').read_text().splitlines() if line.strip()]
    for asset in assets:
        for directory in (manifest_root / 'data', ROOT / 'dist/data'):
            file = (directory / asset['path']).resolve()
            if not file.is_relative_to(directory.resolve()) or not file.is_file() or digest(file) != asset['sha256']:
                raise ValueError(f'Asset mismatch: {file}')
    identities_checked = []
    with sqlite3.connect(f'file:{main}?mode=ro', uri=True) as db, sqlite3.connect(f'file:{baseline}?mode=ro', uri=True) as old:
        for database in (db, old):
            if database.execute('PRAGMA integrity_check').fetchall() != [('ok',)] or database.execute('PRAGMA foreign_key_check').fetchall():
                raise ValueError('Database integrity failed')
        with sqlite3.connect(f'file:{built}?mode=ro', uri=True) as output:
            if output.execute('PRAGMA integrity_check').fetchall() != [('ok',)] or output.execute('PRAGMA foreign_key_check').fetchall():
                raise ValueError('Built database integrity failed')
        for (table,) in old.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"):
            columns = old.execute(f'PRAGMA table_info("{table}")').fetchall()
            primary = [row[1] for row in sorted(columns, key=lambda row: row[5]) if row[5]]
            if primary:
                projection = ','.join(f'"{column}"' for column in primary)
                before = set(old.execute(f'SELECT {projection} FROM "{table}"'))
                after = set(db.execute(f'SELECT {projection} FROM "{table}"'))
                if not before <= after:
                    raise ValueError(f'Existing identities lost: {table}')
                identities_checked.append(table)
            elif db.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0] < old.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]:
                raise ValueError(f'Rows lost in unkeyed table: {table}')
        key_columns = [row[1] for row in old.execute('PRAGMA table_info(canonical_answer_keys)')]
        immutable_columns = [column for column in key_columns if column != 'is_automatically_gradable']
        projection = ','.join(f'"{column}"' for column in key_columns)
        before_rows = {row[0]: row for row in old.execute(f'SELECT {projection} FROM canonical_answer_keys')}
        after_rows = {row[0]: row for row in db.execute(f'SELECT {projection} FROM canonical_answer_keys')}
        if before_rows.keys() != after_rows.keys():
            raise ValueError('Answer-key identities changed during editorial review')
        flag_index = key_columns.index('is_automatically_gradable')
        immutable_indexes = [key_columns.index(column) for column in immutable_columns]
        gradability_changes = []
        for key_id, before in before_rows.items():
            after = after_rows[key_id]
            if tuple(before[index] for index in immutable_indexes) != tuple(after[index] for index in immutable_indexes):
                raise ValueError(f'Answer-key content/history changed: {key_id}')
            if before[flag_index] != after[flag_index]:
                if (before[flag_index], after[flag_index]) != (0, 1):
                    raise ValueError(f'Unexpected automatic-gradability change: {key_id}')
                gradability_changes.append(key_id)
        if gradability_changes:
            placeholders = ','.join('?' for _ in gradability_changes)
            eligible = {row[0] for row in db.execute(f'''SELECT k.id FROM canonical_answer_keys k
                JOIN question_occurrences qo ON qo.id=k.occurrence_id
                JOIN assessment_set_items i ON i.question_occurrence_id=qo.id
                JOIN question_options opt ON opt.question_id=qo.question_id
                JOIN canonical_answer_key_options map ON map.answer_key_id=k.id AND map.question_option_id=opt.id
                WHERE i.assessment_set_id=50 AND i.position<>53 AND k.status='definitive'
                  AND k.answer_type='single_choice' AND k.answer_value IN ('A','B','C','D')
                  AND k.max_points=1 AND k.is_automatically_gradable=1
                  AND (SELECT COUNT(*) FROM question_options o2 WHERE o2.question_id=qo.question_id)=4
                  AND (SELECT COUNT(*) FROM canonical_answer_key_options m2 WHERE m2.answer_key_id=k.id)=1
                  AND opt.code=k.answer_value AND k.version=(SELECT MAX(k2.version) FROM canonical_answer_keys k2 WHERE k2.occurrence_id=qo.id)''')}
            if set(gradability_changes) != eligible:
                raise ValueError('Gradability changes do not exactly match verified definitive QZ2025 keys')
        if db.execute("SELECT COUNT(*) FROM lessons WHERE slug LIKE 'unicamp-2027-%' AND review_status<>'published'").fetchone()[0]:
            raise ValueError('Introductory lesson package is not fully approved')
        cancelled = db.execute('SELECT status,is_automatically_gradable,answer_value FROM canonical_answer_keys WHERE id=53').fetchone()
        if cancelled != ('cancelled', 0, None):
            raise ValueError('Official cancellation was not preserved')
        if '(cid:' in db.execute('SELECT statement FROM questions WHERE id=2782').fetchone()[0]:
            raise ValueError('Known malformed formula was not repaired')
        registered = db.execute('SELECT version FROM content_releases ORDER BY id DESC LIMIT 1').fetchone()[0]
        if registered != release['version']:
            raise ValueError('Release version is stale')
    manifest = json.loads((manifest_root.parent / 'manifest.json').read_text())
    if manifest['publication']['localReleaseSha256'] != checksum:
        raise ValueError('Editorial manifest is stale')
    return {'version': release['version'], 'local_only': True, 'database_sha256': checksum,
            'integrity_check': 'ok', 'foreign_key_check': [], 'main_equals_build': True,
            'assets_verified_in_source_and_build': len(assets), 'preserved_identity_tables': identities_checked,
            'answer_key_content_and_version_history_unchanged': True,
            'qz2025_verified_gradability_flags_enabled': len(gradability_changes),
            'official_cancellation_preserved': True,
            'warning': 'Technical checks and reviewed introductory lessons do not approve every historical record or external resource.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--output', type=Path, default=ROOT / 'tools/editorial/review-closure/release-verification.json')
    args = parser.parse_args()
    report = verify(args.baseline)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()
