#!/usr/bin/env python3
"""Report reviewed external resources for the target, without counting discovery hubs."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]


def coverage(database):
    with sqlite3.connect(f'file:{database}?mode=ro', uri=True) as db:
        db.row_factory = sqlite3.Row
        rows = db.execute('''SELECT ct.*, cts.review_status program_status,
            cts.source_document_id, cts.source_page
            FROM curriculum_topics ct
            JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id=ct.id
            JOIN stages st ON st.id=cts.stage_id JOIN editions e ON e.id=st.edition_id
            WHERE e.slug='unicamp-2027' AND st.slug='primeira-fase'
            ORDER BY ct.position,ct.id''').fetchall()
        if not rows or len({row['id'] for row in rows}) != len(rows):
            raise ValueError('Target program is absent or its topic-stage identity is ambiguous')
        topics = []
        for row in rows:
            resources = db.execute('''SELECT DISTINCT r.id,r.title,r.url,
                r.availability_mode,r.editorial_status,r.is_free,r.editorial_note,
                rt.review_status relation_status,rt.relevance_status,
                rt.accessibility_status,rt.review_note
                FROM resources r JOIN resource_topics rt ON rt.resource_id=r.id
                JOIN resource_targets target ON target.resource_id=r.id
                JOIN stages st ON st.id=target.stage_id JOIN editions e ON e.id=st.edition_id
                WHERE r.is_published=1 AND rt.relevance_status<>'not_relevant'
                AND e.slug='unicamp-2027' AND st.slug='primeira-fase'
                AND (rt.curriculum_topic_id=? OR rt.topic_id=? OR rt.topic_id IN (
                    SELECT legacy.topic_id FROM canonical_topic_legacy_topics legacy
                    JOIN curriculum_topic_canonical_topics mapping
                      ON mapping.canonical_topic_id=legacy.canonical_topic_id
                    WHERE mapping.curriculum_topic_id=? AND mapping.review_status='published'
                )) ORDER BY r.id''', (row['id'], row['topic_id'], row['id'])).fetchall()
            records = [dict(resource) for resource in resources]
            approved = [resource for resource in records
                        if resource['editorial_status'] == 'published'
                        and resource['relation_status'] == 'published'
                        and resource['relevance_status'] == 'relevant'
                        and resource['is_free'] == 1]
            learning = sorted({resource['id'] for resource in approved
                               if resource['availability_mode'] == 'learning'})
            practice = sorted({resource['id'] for resource in approved
                               if resource['availability_mode'] == 'practice'})
            topics.append({'curriculum_topic_id': row['id'], 'label': row['label'],
                           'program_status': row['program_status'],
                           'source_document_id': row['source_document_id'],
                           'source_page': row['source_page'],
                           'approved_learning_ids': learning, 'approved_practice_ids': practice,
                           'gaps': [mode for mode, ids in [('learning', learning), ('practice', practice)] if not ids],
                           'resources': records})
    return {'format': 'target-resource-coverage/v1',
            'generated_at': datetime.now(timezone.utc).isoformat(),
            'database_sha256': hashlib.sha256(database.read_bytes()).hexdigest(),
            'target': 'unicamp-2027/primeira-fase',
            'qualification': 'External supplements only; approval is not exhaustive curriculum coverage, a WCAG certification, or reproduction permission. Reference/discovery and consultation-only resources do not close learning/practice gaps. Visual limitations remain explicit per resource.',
            'topics': topics}


if __name__ == '__main__':
    report = coverage(ROOT / '.local/content/content.sqlite')
    output = Path(__file__).with_name('target-resource-coverage.json')
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'output': str(output), 'topics': len(report['topics']),
                      'learning_gaps': [row['curriculum_topic_id'] for row in report['topics'] if 'learning' in row['gaps']],
                      'practice_gaps': [row['curriculum_topic_id'] for row in report['topics'] if 'practice' in row['gaps']]}))
