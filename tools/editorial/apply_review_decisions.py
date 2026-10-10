#!/usr/bin/env python3
"""Apply explicit editorial decisions with evidence, expected state and backup.

This is not an automatic approval tool. It only applies individually adjudicated
records. Dry runs perform all checks against the current authoritative database.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import sqlite3

ROOT = Path(__file__).resolve().parents[2]
TABLES = {
    'questions', 'question_occurrences', 'question_options', 'question_solutions', 'canonical_answer_keys',
    'question_canonical_topics', 'curriculum_topic_canonical_topics', 'canonical_topics',
    'curriculum_topic_stages', 'lessons', 'lesson_sections', 'resources', 'resource_topics',
    'edition_regulatory_rules', 'required_reading_works', 'required_reading_resources',
    'content_assets', 'source_documents', 'resource_targets', 'editions', 'assessment_sets', 'course_exam_criteria',
    'course_offering_thresholds', 'course_vacancy_allocations', 'scoring_rules',
}
IDENTIFIER = re.compile(r'^[a-z][a-z_0-9]*$')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def quoted(name):
    if not IDENTIFIER.fullmatch(name):
        raise ValueError('Unsafe SQL identifier')
    return '"' + name + '"'


def validate(db, decision):
    table = decision['table']
    if table not in TABLES:
        raise ValueError(f'Unapproved table: {table}')
    columns = db.execute(f'PRAGMA table_info({quoted(table)})').fetchall()
    names = {row[1] for row in columns}
    primary = {row[1] for row in columns if row[5]}
    key, expected, changes = decision['key'], decision['expected'], decision['changes']
    if set(key) != primary or not expected or not changes:
        raise ValueError('Exact primary key, expected state and changes required')
    insertion = expected == {'exists': False}
    checked_expected = {} if insertion else expected
    if not set(key).union(checked_expected).union(changes) <= names or (set(changes) & primary and not insertion):
        raise ValueError('Unknown column or identity mutation')
    if insertion and (table not in {'question_canonical_topics', 'resource_topics', 'resource_targets', 'resources', 'scoring_rules', 'source_documents'} or any(changes.get(k) != v for k, v in key.items())):
        raise ValueError('Only explicit source, classification, resource, and scoped target rows may be inserted')
    if insertion and table == 'resource_targets':
        stage = db.execute('''SELECT st.slug,ed.slug FROM stages st JOIN editions ed ON ed.id=st.edition_id
            WHERE st.id=?''', (changes.get('stage_id'),)).fetchone()
        if (set(changes) != {'resource_id', 'stage_id'} or not stage
                or tuple(stage) != ('primeira-fase', 'unicamp-2027')):
            raise ValueError('Resource target insertion must point to the Unicamp 2027 first phase')
    if insertion and table == 'source_documents':
        required_fields = {'id', 'title', 'url', 'provider', 'kind', 'is_official', 'reuse_status', 'rights_note'}
        allowed_fields = required_fields | {'published_at', 'checksum', 'license_name', 'license_url', 'attribution'}
        if (not required_fields <= set(changes) or not set(changes) <= allowed_fields
                or changes.get('is_official') != 0
                or changes.get('reuse_status') not in {'unknown', 'link_only', 'open_license', 'public_domain', 'permission_confirmed'}
                or not str(changes.get('url', '')).startswith('https://')
                or not str(changes.get('title', '')).strip()
                or not str(changes.get('provider', '')).strip()
                or not str(changes.get('rights_note', '')).strip()):
            raise ValueError('Source-document insertion requires explicit non-official identity, HTTPS URL and reuse/rights metadata')
        if changes.get('reuse_status') == 'open_license' and not (changes.get('license_name') and changes.get('license_url')):
            raise ValueError('Open-licensed source requires its license name and direct license URL')
    if insertion and table == 'resources':
        required_fields = {'id', 'title', 'url', 'provider', 'kind', 'is_free', 'is_published',
                           'source_document_id', 'editorial_status', 'editorial_note', 'availability_mode'}
        allowed_fields = required_fields | {'description'}
        if (not required_fields <= set(changes) or not set(changes) <= allowed_fields
                or not str(changes.get('url', '')).startswith('https://')
                or not str(changes.get('title', '')).strip()
                or not str(changes.get('provider', '')).strip()
                or not str(changes.get('kind', '')).strip()
                or not str(changes.get('editorial_note', '')).strip()
                or changes.get('is_free') not in {0, 1}
                or changes.get('is_published') != 1
                or changes.get('source_document_id') is None
                or changes.get('editorial_status') not in {'draft', 'review', 'published'}
                or changes.get('availability_mode') not in {'learning', 'practice', 'consultation_only', 'reference'}):
            raise ValueError('Resource insertion requires an HTTPS source, rights-linked source document, visibility and explicit editorial status/mode')
    if insertion and table == 'scoring_rules':
        allowed_fields = {'id', 'stage_id', 'paper_id', 'mode', 'points_per_correct', 'max_score', 'metadata_json', 'tri_enabled'}
        metadata = json.loads(changes.get('metadata_json', '{}'))
        if (set(changes) != allowed_fields or changes.get('mode') != 'official'
                or changes.get('points_per_correct') != 1 or changes.get('max_score') != 72
                or changes.get('tri_enabled') != 0
                or metadata != {'cancelled_question_policy': 'award_max_points'}):
            raise ValueError('Scoring-rule insertion must explicitly preserve the verified 2025 cancelled-item rule')
    if not decision.get('reason', '').strip() or not decision.get('evidence'):
        raise ValueError('Editorial justification and evidence required')
    evidence = []
    for item in decision['evidence']:
        if not isinstance(item, dict) or not item.get('locator') or not item.get('detail', '').strip():
            raise ValueError('Evidence requires locator and factual review detail')
        locator = item['locator']
        stamped = dict(item)
        if not locator.startswith(('https://', 'http://', 'sqlite://')):
            path = (ROOT / locator.split('#')[0]).resolve()
            if not path.is_relative_to(ROOT) or not path.is_file():
                raise ValueError(f'Missing local evidence: {locator}')
            stamped['sha256'] = digest(path)
        evidence.append(stamped)
    where = ' AND '.join(f'{quoted(column)} IS ?' for column in key)
    row = db.execute(f'SELECT * FROM {quoted(table)} WHERE {where}', tuple(key.values())).fetchone()
    if row is None and insertion:
        return 'insert', evidence
    if row is None:
        raise ValueError(f'Record missing: {table}/{key}')
    actual = dict(row)
    if all(actual[column] == value for column, value in changes.items()):
        return 'already_applied', evidence
    if insertion:
        raise ValueError(f'Conflicting existing record: {table}/{key}')
    if any(actual[column] != value for column, value in expected.items()):
        raise ValueError(f'Stale expected state: {table}/{key}')
    return 'update', evidence


def execute(database, manifests, apply=False, output=None):
    decisions = []
    for manifest in manifests:
        data = json.loads(Path(manifest).read_text())
        decisions.extend(data['decisions'])
    identities = [(item['table'], json.dumps(item['key'], sort_keys=True)) for item in decisions]
    if len(identities) != len(set(identities)):
        raise ValueError('Conflicting duplicate record decisions')
    db = sqlite3.connect(str(database) if apply else f'file:{database}?mode=ro', uri=not apply)
    if not apply:
        simulated = sqlite3.connect(':memory:')
        db.backup(simulated)
        db.close()
        db = simulated
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    journal = {
        'format': 'editorial-review-application/v1', 'created_at': datetime.now(timezone.utc).isoformat(),
        'database_before_sha256': digest(Path(database)), 'applied': False, 'decisions': [],
    }
    try:
        if apply:
            db.execute('BEGIN IMMEDIATE')
        for decision in decisions:
            action, evidence = validate(db, decision)
            journal['decisions'].append({**decision, 'evidence': evidence, 'action': action})
        if apply:
            if output is None or Path(output).exists():
                raise ValueError('A new durable audit file is required for application')
            backup = Path(database).parent / 'backups' / ('before-editorial-review-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ') + '.sqlite')
            backup.parent.mkdir(parents=True, exist_ok=True)
            # Use a separate reader: backup of the writer during BEGIN would block.
            with sqlite3.connect(f'file:{database}?mode=ro', uri=True) as reader, sqlite3.connect(backup) as target:
                reader.backup(target)
            journal['backup'] = str(backup)
            Path(output).parent.mkdir(parents=True, exist_ok=True)
            Path(output).write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n')
        counts = {row[0]: db.execute(f'SELECT COUNT(*) FROM {quoted(row[0])}').fetchone()[0]
                  for row in db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")}
        for decision in journal['decisions']:
            if decision['action'] == 'insert':
                changes = decision['changes']
                columns = ', '.join(quoted(column) for column in changes)
                values = ', '.join('?' for _ in changes)
                db.execute(f'INSERT INTO {quoted(decision["table"])} ({columns}) VALUES ({values})', tuple(changes.values()))
                counts[decision['table']] += 1
                continue
            if decision['action'] != 'update':
                continue
            changes, key = decision['changes'], decision['key']
            assignment = ', '.join(f'{quoted(column)}=?' for column in changes)
            where = ' AND '.join(f'{quoted(column)} IS ?' for column in key)
            db.execute(f'UPDATE {quoted(decision["table"])} SET {assignment} WHERE {where}',
                       (*changes.values(), *key.values()))
        if any(db.execute(f'SELECT COUNT(*) FROM {quoted(table)}').fetchone()[0] != count for table, count in counts.items()):
            raise ValueError('A trigger changed record counts; refusing mutation')
        if db.execute('PRAGMA integrity_check').fetchone()[0] != 'ok' or db.execute('PRAGMA foreign_key_check').fetchall():
            raise ValueError('Database integrity failed')
        if apply:
            db.commit()
            journal['applied'] = True
            journal['database_after_sha256'] = digest(Path(database))
            Path(output).write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n')
        return journal
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifests', nargs='+', type=Path)
    parser.add_argument('--database', type=Path, default=ROOT / '.local/content/content.sqlite')
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--audit', type=Path)
    args = parser.parse_args()
    journal = execute(args.database, args.manifests, args.apply, args.audit)
    print(json.dumps({'applied': journal['applied'], 'updates': sum(d['action'] == 'update' for d in journal['decisions']),
                      'inserts': sum(d['action'] == 'insert' for d in journal['decisions']),
                      'already_applied': sum(d['action'] == 'already_applied' for d in journal['decisions'])}))


if __name__ == '__main__':
    main()
