#!/usr/bin/env python3
"""Report target-topic question availability using the same editorial gates as training."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / '.local/content/content.sqlite'
OUTPUT = Path(__file__).with_name('target-question-coverage.json')


def main():
    topics = []
    with sqlite3.connect(f'file:{DATABASE}?mode=ro', uri=True) as db:
        db.row_factory = sqlite3.Row
        targets = db.execute('''SELECT ct.id,ct.label,cts.source_document_id,cts.source_page
            FROM curriculum_topics ct
            JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id=ct.id
            JOIN stages st ON st.id=cts.stage_id JOIN editions ed ON ed.id=st.edition_id
            WHERE ed.slug='unicamp-2027' AND st.slug='primeira-fase'
              AND cts.review_status='published' ORDER BY ct.position,ct.id''').fetchall()
        if not targets:
            raise ValueError('The published target program was not found')
        selected_practice = {}
        course_rows = db.execute('''SELECT m.slug,i.question_occurrence_id,i.description,
                q.id question_id,q.slug question_slug,qo.number,pv.code,ed.year,
                qo.source_document_id,qo.source_page
            FROM learning_courses lc
            JOIN learning_course_modules m ON m.learning_course_id=lc.id
            JOIN learning_course_items i ON i.module_id=m.id AND i.item_type='practice'
            JOIN question_occurrences qo ON qo.id=i.question_occurrence_id
            JOIN questions q ON q.id=qo.question_id
            JOIN paper_versions pv ON pv.id=qo.paper_version_id
            JOIN papers p ON p.id=qo.paper_id
            JOIN stages st ON st.id=p.stage_id
            JOIN editions ed ON ed.id=st.edition_id
            WHERE lc.slug='unicamp-2027-primeira-fase' ''').fetchall()
        for row in course_rows:
            prefix = 'topico-'
            if row['slug'].startswith(prefix):
                topic_id = int(row['slug'][len(prefix):])
                selected_practice[topic_id] = {
                    'question_id': row['question_id'], 'question_slug': row['question_slug'],
                    'year': row['year'], 'paper_code': row['code'], 'number': row['number'],
                    'source_document_id': row['source_document_id'], 'source_page': row['source_page'],
                    'selection_note': row['description'],
                }
        for topic in targets:
            rows = db.execute('''SELECT DISTINCT q.id question_id,q.slug,
                    GROUP_CONCAT(DISTINCT ed.year) source_years,
                    COUNT(DISTINCT qo.id) occurrence_count
                FROM curriculum_topic_canonical_topics ctc
                JOIN canonical_topics can ON can.id=ctc.canonical_topic_id AND can.status='published'
                JOIN question_canonical_topics qct ON qct.canonical_topic_id=can.id
                    AND qct.review_status='published'
                JOIN questions q ON q.id=qct.question_id AND q.status='published'
                LEFT JOIN question_occurrences qo ON qo.question_id=q.id AND qo.status='published'
                LEFT JOIN papers p ON p.id=qo.paper_id
                LEFT JOIN stages src_stage ON src_stage.id=p.stage_id
                LEFT JOIN editions ed ON ed.id=src_stage.edition_id
                WHERE ctc.curriculum_topic_id=? AND ctc.review_status='published'
                  AND (qo.id IS NOT NULL OR NOT EXISTS (
                    SELECT 1 FROM question_occurrences any_occurrence WHERE any_occurrence.question_id=q.id
                  ))
                GROUP BY q.id ORDER BY q.id''', (topic['id'],)).fetchall()
            questions = [{'question_id': row['question_id'], 'slug': row['slug'],
                          'source_years': sorted(int(year) for year in row['source_years'].split(',') if year),
                          'published_occurrences': row['occurrence_count']}
                         for row in rows]
            topics.append({'curriculum_topic_id': topic['id'], 'label': topic['label'],
                           'program_source': {'document_id': topic['source_document_id'], 'page': topic['source_page']},
                           'selected_course_practice': selected_practice.get(topic['id']),
                           'approved_question_records': questions,
                           'has_at_least_one_usable_question': bool(questions)})
    OUTPUT.write_text(json.dumps({
        'format': 'target-question-coverage/v1',
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'database_sha256': hashlib.sha256(DATABASE.read_bytes()).hexdigest(),
        'target': 'unicamp-2027/primeira-fase',
        'qualification': 'Selected course practice is the curated representative currently in the guided course. Approved canonical question records are candidate associations, not every relevant question. Relations are editorial, not official Comvest tags. This report does not prove full PDF transcription, image accessibility, or complete subtopic coverage.',
        'topics': topics,
    }, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'output': str(OUTPUT), 'topics': len(topics),
                      'topics_with_question': sum(topic['has_at_least_one_usable_question'] for topic in topics),
                      'topics_without_question': [topic['label'] for topic in topics if not topic['has_at_least_one_usable_question']]}))


if __name__ == '__main__':
    main()
