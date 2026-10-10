#!/usr/bin/env python3
"""Version the authoritative SQLite locally, verifying every bundled asset first."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
ASSETS = ROOT / '.local/content/staging/unicamp-2027-v1/offline-assets-2026-2027'


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def schema_version(db):
    version = db.execute('PRAGMA user_version').fetchone()[0]
    latest = db.execute('SELECT MAX(schema_version) FROM content_releases').fetchone()[0]
    # A migration intentionally makes the working database newer than the
    # last release. Release creation is the operation that reconciles them;
    # only a database older than an already-recorded release is unsafe.
    if version <= 0 or (latest is not None and latest > version):
        raise ValueError('SQLite schema is older than the latest recorded release')
    return version


def editorial_summary(db):
    course = db.execute("SELECT id FROM learning_courses WHERE slug='unicamp-2027-primeira-fase'").fetchone()
    if not course:
        raise ValueError('Guided study course missing')
    counts = db.execute('''SELECT COUNT(DISTINCT m.id),COUNT(i.id),
        COUNT(DISTINCT i.lesson_id),SUM(CASE WHEN i.item_type='practice' THEN 1 ELSE 0 END)
        FROM learning_course_modules m LEFT JOIN learning_course_items i ON i.module_id=m.id
        WHERE m.learning_course_id=?''', (course[0],)).fetchone()
    statuses = db.execute('''SELECT l.review_status,COUNT(DISTINCT l.id) FROM lessons l
        JOIN learning_course_items i ON i.lesson_id=l.id JOIN learning_course_modules m ON m.id=i.module_id
        WHERE m.learning_course_id=? GROUP BY l.review_status''', (course[0],)).fetchall()
    return {'modules': counts[0], 'steps': counts[1], 'lessons': counts[2],
            'practice_steps': counts[3], 'lesson_states': dict(statuses)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--version', required=True)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    database = ROOT / '.local/content/content.sqlite'
    records = [json.loads(line) for line in (ASSETS / 'asset-manifest.jsonl').read_text().splitlines() if line.strip()]
    for record in records:
        asset = (ASSETS / 'data' / record['path']).resolve()
        if not asset.is_relative_to((ASSETS / 'data').resolve()) or not asset.is_file() or digest(asset) != record['sha256']:
            raise ValueError(f"Asset missing or checksum mismatch: {record['path']}")
    db = sqlite3.connect(str(database) if args.apply else f'file:{database}?mode=ro', uri=not args.apply)
    if db.execute('PRAGMA integrity_check').fetchall() != [('ok',)] or db.execute('PRAGMA foreign_key_check').fetchall():
        raise ValueError('Database integrity failed')
    now = datetime.now(timezone.utc).isoformat()
    version = schema_version(db)
    summary = editorial_summary(db)
    if args.apply:
        if db.execute('SELECT 1 FROM content_releases WHERE version=?', (args.version,)).fetchone():
            raise ValueError('Release version already exists; use a new version for a new verified batch')
        backup = database.parent / 'backups' / f'before-guided-release-{datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%f")}.sqlite'
        backup.parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(backup) as target:
            db.backup(target)
        with db:
            db.execute('INSERT INTO content_releases(version,schema_version,generated_at,notes) VALUES (?,?,?,?)',
                       (args.version, version, now, 'Local only. Reviewed batches and provisional consultation remain distinct. No public deployment.'))
    report = {'version': args.version, 'local_only': True, 'applied': args.apply, 'schema_version': version,
              'generated_at': now, 'assets_verified': len(records), 'integrity_check': 'ok', 'foreign_key_check': [],
              'database_sha256': digest(database), 'editorial_summary': summary}
    report['release_id'] = db.execute('SELECT id FROM content_releases WHERE version=?', (args.version,)).fetchone()[0] if args.apply else None
    report['consultation_visibility'] = {
        table: dict(db.execute(f'SELECT is_published,COUNT(*) FROM {table} GROUP BY is_published').fetchall())
        for table in ('resources', 'lessons', 'learning_courses', 'learning_maps', 'study_plans')
    }
    db.close()
    if args.apply:
        (database.parent / 'guided-study-release.json').write_text(json.dumps(report, indent=2) + '\n')
        manifest_path = ASSETS.parent / 'manifest.json'
        if manifest_path.exists():
            manifest = json.loads(manifest_path.read_text())
            publication = manifest.setdefault('publication', {})
            manifest.setdefault('publicationHistory', []).append(dict(publication))
            publication['historicalScopeSourceVersion'] = publication.get('localReleaseVersion')
            publication.update({'localReleaseVersion': args.version, 'localReleaseId': report['release_id'],
                                'localReleaseDatabase': '.local/content/content.sqlite',
                                'localReleaseSha256': report['database_sha256'], 'externalDeploymentPerformed': False,
                                'currentReleaseReport': '.local/content/guided-study-release.json',
                                'scopeCountsAreHistorical': True, 'currentDatabaseSummary': report})
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
