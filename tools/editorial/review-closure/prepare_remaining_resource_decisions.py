#!/usr/bin/env python3
"""Prepare explicit consultation/reference decisions for the remaining reviewed candidates."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / '.local/content/content.sqlite'
OUTPUT = Path(__file__).with_name('remaining-resource-decisions.json')

# Notes reflect the audits and limitations recorded in this task's source material.
# Reference/consultation publication means the record can be inspected; it does not
# endorse an unreviewed video, dynamic result, error-containing exercise, or course.
PROFILES = {
    185: ('consultation_only', 'The listed English-language mechanics course remains a consultation candidate; the full course was not pedagogically audited for this Portuguese high-school syllabus. Link-only; do not treat its listing as an approved lesson.'),
    186: ('consultation_only', 'The English-language practice page was not audited question by question or for accessibility. Consultation only; no exercise or answer key is endorsed.'),
    255: ('consultation_only', 'The destination content could not be substantively inspected in this review. The record remains visible for source inspection; title alone does not approve it as a lesson.'),
    257: ('consultation_only', 'The interactive exercise and its answer feedback were not validated question by question. Consultation only; not an approved practice resource.'),
    258: ('consultation_only', 'The linked video was not watched and no full transcript was checked. Consultation only; do not present it as a reviewed lesson.'),
    277: ('reference', 'Official TV Unicamp/CRIA metadata identifies this commentary on Morangos Mofados. Published as a bibliographic reference to the work; the video itself, transcript and accessibility were not reviewed.'),
    278: ('reference', 'Official TV Unicamp/CRIA metadata identifies this commentary on Olhos d’água. Published as a bibliographic reference to the work; the video itself, transcript and accessibility were not reviewed.'),
    281: ('reference', 'Official Unicamp metadata identifies a 2024 CRIA talk about A vida não é útil. Published as a historical reference to the work; the talk itself and accessibility were not reviewed.'),
    282: ('reference', 'Official TV Unicamp/CRIA metadata identifies this commentary on José Paulo Paes. Published as a bibliographic reference to the work; the video itself, transcript and accessibility were not reviewed.'),
    285: ('reference', 'Official TV Unicamp/CRIA metadata identifies this commentary on Lima Barreto. Published as a bibliographic reference to the work; the video itself, transcript and accessibility were not reviewed.'),
    479: ('reference', 'The direct encyclopedia entry is retained only as a general reference on sets. Its breadth and collaborative nature do not establish a complete lesson for the canonical topic.'),
    480: ('reference', 'This is a dynamic Khan Academy search, not a fixed exercise. Publish as a discovery link only; results and answers are not individually endorsed.'),
    482: ('consultation_only', 'The exercise presents a single-choice item with checkbox controls in the inspected interface. Keep the URL visible for source inspection, but do not recommend it as usable practice until the provider fixes the interaction.'),
    491: ('reference', 'The direct encyclopedia entry is retained only as a general reference to analytic geometry; it is not a sequenced lesson or complete syllabus coverage.'),
    492: ('reference', 'This is a dynamic Khan Academy search, not a fixed exercise. Publish as a discovery link only; results and answers are not individually endorsed.'),
    493: ('reference', 'The direct encyclopedia entry is retained only as a broad reference to physical geography. It does not establish Portuguese high-school alignment or complete coverage.'),
    494: ('reference', 'This is a dynamic Khan Academy search, not a fixed exercise. Publish as a discovery link only; results and answers are not individually endorsed.'),
    498: ('consultation_only', 'The audited list contains an ambiguous answer in Q8 and text defects in Q10–Q11 that cannot be excluded at the provider page. Keep visible for consultation; do not recommend the list as practice.'),
    500: ('consultation_only', 'The audited list contains a duplicated/missing alternative in Q11 that cannot be excluded at the provider page. Keep visible for consultation; do not recommend the list as practice.'),
    507: ('reference', 'The direct encyclopedia entry is retained only as a general reference to thermodynamics. The cited references do not cover the full subject; this is not a vetted lesson.'),
    512: ('consultation_only', 'The audited list contains substantive errors in several statements/answers, including states-of-matter classification. Keep visible for consultation; do not use as practice until corrected by the publisher.'),
    516: ('consultation_only', 'The audit found an incorrect answer/calculation and an item dependent on an essential figure. Keep visible for consultation; do not recommend this list as practice.'),
    518: ('consultation_only', 'The questions depend on molecular structures in images without adequate text equivalents. Keep visible for consultation; do not recommend as accessible or usable practice.'),
    522: ('consultation_only', 'The audit found unit errors and visual prompts without recoverable geometry/dimensions. Keep visible for consultation; do not recommend the current answer key.'),
    524: ('consultation_only', 'The solutions are image-only and the mathematical answers were not verified. Keep visible for consultation; do not recommend the solution set as validated practice.'),
    525: ('consultation_only', 'Several questions depend on maps/images whose necessary information was not transcribed or visually verified. Keep visible for consultation; do not recommend as validated practice.'),
    526: ('consultation_only', 'The audit found an overgeneralized claim about coral survival after bleaching. Keep visible for consultation; do not recommend the current answer key.'),
    527: ('consultation_only', 'The audit found material errors in several answers. Keep visible for consultation; do not recommend the list as practice until corrected.'),
    528: ('consultation_only', 'The audit found a heat-flow direction inconsistent with a refrigerator/COP and a claim assigning joules as the unit of efficiency. Keep visible for consultation; do not recommend the current answer key.'),
    529: ('reference', 'Official Unicamp notice documents the locations for the June 2026 preparatory simulation. The event is historical and the notice is operational, not study content.'),
    530: ('reference', 'Official Unicamp notice documents the June 2026 simulation date. The event is historical and the notice is operational, not study content.'),
    531: ('consultation_only', 'The recorded Khan Academy page did not expose inspectable lesson content during review. Keep the record visible for source inspection; do not recommend it as a reviewed lesson.'),
}

with sqlite3.connect(f'file:{DATABASE}?mode=ro', uri=True) as db:
    db.row_factory = sqlite3.Row
    rows = db.execute("SELECT * FROM resources WHERE editorial_status='review' AND id BETWEEN 166 AND 602 ORDER BY id").fetchall()
    decisions = []
    for row in rows:
        if row['id'] not in PROFILES:
            raise ValueError(f'No individually reviewed profile for resource {row["id"]}')
        mode, editorial_note = PROFILES[row['id']]
        decisions.append({
            'table': 'resources', 'key': {'id': row['id']},
            'expected': {'editorial_status': row['editorial_status'], 'url': row['url'],
                         'source_document_id': row['source_document_id'], 'availability_mode': row['availability_mode']},
            'changes': {'editorial_status': 'published', 'availability_mode': mode, 'editorial_note': editorial_note},
            'reason': 'Publish an accurately scoped bibliographic/consultation record based on the direct URL and the per-item audit; the chosen availability mode prevents this record from being misrepresented as an approved lesson or practice when content quality is unresolved.',
            'evidence': [
                {'locator': row['url'], 'detail': f"Direct destination recorded for {row['title']}; review note documents the observed function or the specific defect and the limits of this status."},
                {'locator': f"sqlite://resources/{row['id']}", 'detail': f"Current resource record and status checked read-only; source_document_id={row['source_document_id']} and original URL are preserved."},
            ],
        })
    if set(PROFILES) != {row['id'] for row in rows}:
        raise ValueError('The remaining-record list changed; review the new inventory before preparing decisions')

    for row in db.execute("SELECT * FROM resource_topics WHERE review_status='review' AND resource_id BETWEEN 166 AND 602 ORDER BY resource_id"):
        rid = row['resource_id']
        if rid not in PROFILES:
            continue
        note = (f"A relação com o tópico é preservada como correspondência temática da ficha {rid}; a disponibilidade e as limitações de uso estão explícitas no registro do recurso. "
                'Esta relação não certifica acessibilidade assistiva nem transforma uma referência/consulta em atividade de treino.')
        decisions.append({
            'table': 'resource_topics',
            'key': {'resource_id': rid, 'topic_id': row['topic_id'], 'curriculum_topic_id': row['curriculum_topic_id']},
            'expected': {'review_status': row['review_status'], 'relevance_status': row['relevance_status']},
            'changes': {'review_status': 'published', 'relevance_status': 'relevant', 'review_note': note},
            'reason': 'The destination title/type and current topic identifier agree; the resource record itself carries the limits on use and quality.',
            'evidence': [{'locator': f"sqlite://resources/{rid}", 'detail': f"Resource {rid} title and destination preserved; this topic link is informational and does not count as study/practice approval."}],
        })

OUTPUT.write_text(json.dumps({'summary': 'Per-item records published for consultation or direct reference. Known answer/content/accessibility problems are stated; these entries do not count as reviewed practice or teaching. Direct topic links identify the subject without implying endorsement.', 'decisions': decisions, 'blocked': []}, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'output': str(OUTPUT), 'decisions': len(decisions), 'resources': len(rows)}))
