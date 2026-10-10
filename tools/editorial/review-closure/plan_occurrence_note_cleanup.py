#!/usr/bin/env python3
"""Create a guarded, non-mutating plan to remove stale PDF occurrence notes."""
import hashlib
import importlib.util
import json
from pathlib import Path
import sqlite3
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[3]
DB = ROOT / '.local/content/content.sqlite'
OUT = ROOT / 'content/editorial/unicamp-2027'
MANIFEST = OUT / 'occurrence-note-cleanup-2026-10-10-apply-manifest.json'
JOURNAL = OUT / 'occurrence-note-cleanup-2026-10-10-dry-run-journal.json'
AUDIT = ROOT / 'content/editorial/unicamp-2027/pdf-qa-issues-audit-2026-10-10.json'
OLD = 'Enunciado e alternativas não importados'
NEW = 'Enunciado e alternativas presentes no registro'
SOURCES = {
    36: ROOT / '.local/downloads/comvest-2025-2027/2025/exams/first-phase-QZ.pdf',
    44: ROOT / '.local/downloads/comvest-2025-2027/2026/exams/first-phase-QX.pdf',
}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    if MANIFEST.exists() or JOURNAL.exists():
        raise SystemExit('Refusing to overwrite an existing manifest or journal.')
    for path in (DB, AUDIT, *SOURCES.values()):
        if not path.is_file():
            raise SystemExit(f'Required evidence/database missing: {path.relative_to(ROOT)}')

    before_hash = sha256(DB)
    db = sqlite3.connect(f'file:{DB}?mode=ro', uri=True)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA query_only=ON')
    decisions, assertions = [], []
    for source_id, pdf in SOURCES.items():
        rows = db.execute('''
            SELECT qo.id, qo.question_id, qo.source_document_id, qo.status, qo.notes,
                   qo.source_page, q.statement, q.status AS question_status,
                   (SELECT COUNT(*) FROM question_options o WHERE o.question_id=q.id) AS option_count,
                   (SELECT GROUP_CONCAT(code, ',') FROM
                     (SELECT code FROM question_options o WHERE o.question_id=q.id ORDER BY position)) AS option_codes
              FROM question_occurrences qo JOIN questions q ON q.id=qo.question_id
             WHERE qo.source_document_id=? ORDER BY qo.id
        ''', (source_id,)).fetchall()
        if len(rows) != 72:
            raise SystemExit(f'Source document {source_id}: expected 72 occurrences, found {len(rows)}')
        for row in rows:
            note = row['notes'] or ''
            if OLD not in note:
                continue
            if (not row['statement'] or len(row['statement'].strip()) < 20
                    or row['option_count'] != 4 or row['option_codes'] != 'A,B,C,D'
                    or row['status'] != 'published' or row['question_status'] != 'published'
                    or row['source_page'] is None):
                raise SystemExit(f'Occurrence {row["id"]}: content/status guard failed')
            updated_note = note.replace(OLD, NEW, 1)
            decisions.append({
                'table': 'question_occurrences',
                'key': {'id': row['id']},
                'expected': {
                    'question_id': row['question_id'],
                    'source_document_id': source_id,
                    'status': row['status'],
                    'notes': note,
                },
                'changes': {'notes': updated_note},
                'reason': ('Remover somente a afirmação obsoleta de que enunciado e alternativas não foram importados. '
                           'A presença foi conferida no registro SQLite (enunciado não vazio e opções A–D). '
                           'Não altera nem aprova conteúdo; preserva integralmente o sufixo/proveniência da nota, '
                           'o status da ocorrência e o status da questão.'),
                'evidence': [
                    {'locator': pdf.relative_to(ROOT).as_posix(),
                     'detail': f'Caderno oficial do documento-fonte {source_id}; página física registrada na ocorrência ({row["source_page"]}).'},
                    {'locator': 'content/editorial/unicamp-2027/pdf-qa-issues-audit-2026-10-10.json',
                     'detail': f'Auditoria PDF compara os alertas com os registros atuais e não encontrou opções A–D ausentes; hash do banco embutido difere do banco atual, portanto usado apenas como apoio e não como guard temporal.'},
                    {'locator': f'sqlite://question_occurrences/{row["id"]}',
                     'detail': f'Consulta somente leitura atual: occurrence id={row["id"]}, question_id={row["question_id"]}, source_document_id={source_id}, status={row["status"]}; enunciado presente e opções A,B,C,D ({row["option_count"]}).'},
                ],
            })
            assertions.append({
                'occurrence_id': row['id'], 'question_id': row['question_id'],
                'source_document_id': source_id, 'source_page': row['source_page'],
                'statement_length': len(row['statement']), 'option_codes': ['A', 'B', 'C', 'D'],
                'occurrence_status_preserved': row['status'],
                'question_status_preserved': row['question_status'],
            })

    if len(decisions) != 140:
        raise SystemExit(f'Expected 140 exact stale-note candidates; found {len(decisions)}')
    if {d['key']['id'] for d in decisions} != {a['occurrence_id'] for a in assertions}:
        raise SystemExit('Candidate/assertion identity mismatch')
    if db.execute('PRAGMA integrity_check').fetchone()[0] != 'ok' or db.execute('PRAGMA foreign_key_check').fetchall():
        raise SystemExit('Read-only database integrity check failed')
    qt_stale = db.execute("SELECT COUNT(*) FROM question_occurrences WHERE source_document_id=335 AND notes LIKE ?", (f'%{OLD}%',)).fetchone()[0]
    db.close()

    manifest = {
        'format': 'editorial-review-application/v1',
        'plan_metadata': {
            'purpose': 'Mechanical correction plan for stale occurrence notes only; no SQLite write in this run.',
            'created_at': datetime.now(timezone.utc).isoformat(),
            'database_path': DB.relative_to(ROOT).as_posix(),
            'database_sha256_guard': before_hash,
            'source_pdf_sha256': {str(k): sha256(v) for k, v in SOURCES.items()},
            'audit_report_sha256': sha256(AUDIT),
            'scope': 'QZ 2025 source_document_id=36 and QX 2026 source_document_id=44; QT 2027 simulation excluded.',
            'only_mutable_field': 'question_occurrences.notes',
            'replacement_rule': {'exact_old_clause': OLD, 'replace_once_with': NEW, 'preserve_all_remaining_note_text': True},
            'candidate_count': len(decisions),
            'per_occurrence_content_assertions': assertions,
            'explicit_exclusions': {'source_document_id_335_stale_note_count': qt_stale,
                                    'accessibility_alt_text_or_descriptions': 'out of scope; untouched',
                                    'statement_options_assets_keys_status_and_approval': 'untouched'},
            'apply_command_after_human_review': 'python3 tools/editorial/apply_review_decisions.py --database .local/content/content.sqlite --audit content/editorial/unicamp-2027/occurrence-note-cleanup-2026-10-10-application-journal.json content/editorial/unicamp-2027/occurrence-note-cleanup-2026-10-10-apply-manifest.json',
        },
        'decisions': decisions,
    }
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

    runner_path = ROOT / 'tools/editorial/apply_review_decisions.py'
    spec = importlib.util.spec_from_file_location('apply_review_decisions', runner_path)
    runner = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(runner)
    result = runner.execute(DB, [MANIFEST], apply=False, output=None)
    if sha256(DB) != before_hash:
        raise SystemExit('Database hash changed during dry-run; investigate immediately')
    journal = {
        **result,
        'dry_run_only': True,
        'manifest_path': MANIFEST.relative_to(ROOT).as_posix(),
        'manifest_sha256': sha256(MANIFEST),
        'database_after_sha256_read_only_check': sha256(DB),
        'database_unchanged': True,
        'sqlite_mutation_performed': False,
        'status_and_approval_mutated': False,
        'assertion_summary': {'candidate_occurrences': len(assertions), 'verified_statement_and_A_to_D': len(assertions),
                              'question_and_occurrence_status_preserved_by_plan': len(assertions)},
        'dry_run_counts': {
            'updates': sum(d['action'] == 'update' for d in result['decisions']),
            'already_applied': sum(d['action'] == 'already_applied' for d in result['decisions']),
            'inserts': sum(d['action'] == 'insert' for d in result['decisions']),
        },
    }
    JOURNAL.write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'manifest': str(MANIFEST.relative_to(ROOT)), 'journal': str(JOURNAL.relative_to(ROOT)),
                      'candidates': len(decisions), 'dry_run': journal['dry_run_counts'],
                      'database_unchanged': sha256(DB) == before_hash}, ensure_ascii=False))


if __name__ == '__main__':
    main()
