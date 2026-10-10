#!/usr/bin/env python3
"""Prepare consultation-only decisions for official historical Comvest image references."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / '.local/content/content.sqlite'
OUTPUT = Path(__file__).with_name('historical-official-image-references.json')

with sqlite3.connect(f'file:{DATABASE}?mode=ro', uri=True) as db:
    db.row_factory = sqlite3.Row
    rows = db.execute('''SELECT r.*,sd.is_official source_official,sd.reuse_status
        FROM resources r JOIN source_documents sd ON sd.id=r.source_document_id
        WHERE r.kind='official_simulator_question_image'
          AND r.editorial_status IN ('draft','review')
          AND sd.is_official=1
          AND r.url LIKE 'https://www.comvest.unicamp.br/SimuladoOnLine/docs/%'
        ORDER BY r.id''').fetchall()
    decisions = []
    for row in rows:
        title = str(row['title'])
        note = ('Liberado para consulta histórica como referência de imagem identificada pelo catálogo público oficial da Comvest. '
                'A ficha registra edição, caderno, número original e URL oficial; não certifica OCR, resolução pedagógica, '
                'resolução comentada ou cobertura do programa 2027. A imagem abre pela internet. Direitos de reutilização '
                'permanecem ' + str(row['reuse_status']) + '; somente link, sem cópia.')
        decisions.append({
            'table': 'resources', 'key': {'id': row['id']},
            'expected': {'editorial_status': row['editorial_status'], 'kind': row['kind'],
                         'url': row['url'], 'source_document_id': row['source_document_id'],
                         'availability_mode': row['availability_mode']},
            'changes': {'editorial_status': 'published', 'availability_mode': 'consultation_only',
                        'editorial_note': note},
            'reason': 'A API pública oficial da Comvest identificou a imagem, edição, caderno, número e URL. Isso sustenta consulta histórica e proveniência, não uma recomendação pedagógica nem autorização de reprodução.',
            'evidence': [
                {'locator': row['url'], 'detail': f"Imagem referenciada pelo catálogo oficial: {title}. A URL e o documento-fonte registrado identificam a ocorrência; a ficha permanece link-only."},
                {'locator': f"sqlite://resources/{row['id']}", 'detail': f"Registro local associa source_document_id={row['source_document_id']}, tipo={row['kind']}, origem oficial e situação de reutilização {row['reuse_status']}; nenhum arquivo foi copiado."},
            ],
        })

OUTPUT.write_text(json.dumps({
    'summary': 'Referências de imagens oficiais históricas passam a consulta local com proveniência e direitos preservados. Não são promovidas a material de aprendizagem ou prática, e não há cópia dos arquivos.',
    'decisions': decisions, 'blocked': [],
}, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'output': str(OUTPUT), 'decisions': len(decisions)}))
