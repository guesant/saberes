#!/usr/bin/env python3
"""Prepare idempotent first-phase targets for the audited external resource batch."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / '.local/content/content.sqlite'
AUDIT = Path(__file__).with_name('applied-external-resource-batch-2026-10-10.json')
OUTPUT = Path(__file__).with_name('external-resource-targets-2026-10-10.json')
STAGE_ID = 11


def main():
    audit = json.loads(AUDIT.read_text())
    resource_ids = sorted({decision['key']['id'] for decision in audit['decisions']
                           if decision['table'] == 'resources'})
    decisions = []
    with sqlite3.connect(f'file:{DATABASE}?mode=ro', uri=True) as db:
        db.row_factory = sqlite3.Row
        for resource_id in resource_ids:
            resource = db.execute('SELECT id,title,url,editorial_status,availability_mode FROM resources WHERE id=?',
                                  (resource_id,)).fetchone()
            if not resource:
                raise ValueError(f'Missing audited resource {resource_id}')
            if db.execute('SELECT 1 FROM resource_targets WHERE resource_id=? AND stage_id=?',
                          (resource_id, STAGE_ID)).fetchone():
                continue
            decisions.append({
                'table': 'resource_targets',
                'key': {'resource_id': resource_id, 'stage_id': STAGE_ID},
                'expected': {'exists': False},
                'changes': {'resource_id': resource_id, 'stage_id': STAGE_ID},
                'reason': 'Concluir o escopo de publicação do recurso, ligando-o apenas à primeira fase Unicamp 2027 já indicada pelo vínculo de tópico aprovado.',
                'evidence': [
                    {'locator': resource['url'],
                     'detail': f"Fonte direta do recurso {resource['title']}; modalidade {resource['availability_mode']}, estado editorial {resource['editorial_status']} conforme auditoria aplicada."},
                    {'locator': 'sqlite://stages/11',
                     'detail': 'A identidade do stage 11 foi validada como unicamp-2027/primeira-fase pelo validador de resource_targets.'},
                ],
            })
    OUTPUT.write_text(json.dumps({'format': 'editorial-review-decisions/v1',
                                  'summary': 'Vínculos de escopo para recursos externos auditados, sem duplicar recursos.',
                                  'decisions': decisions}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'output': str(OUTPUT), 'targets_to_add': len(decisions)}))


if __name__ == '__main__':
    main()
