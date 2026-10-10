#!/usr/bin/env python3
"""Prepare provenance corrections for 2026 Q/X editorial solution records."""
import argparse
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATABASE = ROOT / ".local/content/content.sqlite"
OUTPUT = ROOT / ".local/content/staging/2026-qx-solution-source-corrections.json"
OFFICIAL_COMMENTARY = "https://www.comvest.unicamp.br/wp-content/uploads/2026/06/F1_2026_Prova-Q.pdf"
ANSWER_KEY = "https://www.comvest.unicamp.br/wp-content/uploads/2025/10/Q_X-gabarito.pdf"


def build(database):
    db = sqlite3.connect(f"file:{database}?mode=ro", uri=True)
    db.row_factory = sqlite3.Row
    try:
        source = db.execute("SELECT url,title FROM source_documents WHERE id=4").fetchone()
        answer = db.execute("SELECT url,title FROM source_documents WHERE id=45").fetchone()
        if not source or source["url"] != OFFICIAL_COMMENTARY or not answer or answer["url"] != ANSWER_KEY:
            raise ValueError("Solution source-document identities changed; re-audit before applying")
        records = db.execute("""
            SELECT qs.id,qs.question_id,qs.title,qo.number
            FROM question_solutions qs
            JOIN question_occurrences qo ON qo.question_id=qs.question_id
            JOIN papers p ON p.id=qo.paper_id
            JOIN stages st ON st.id=p.stage_id
            JOIN editions e ON e.id=st.edition_id
            JOIN paper_versions pv ON pv.id=qo.paper_version_id
            WHERE e.year=2026 AND pv.code='QX' AND qs.source_document_id=45
            GROUP BY qs.id
            ORDER BY qo.number,qs.id
        """).fetchall()
        if not records:
            raise ValueError("No 2026 Q/X solution records with the answer-key source found")
        decisions = []
        for row in records:
            number = row["number"]
            decisions.append({
                "table": "question_solutions", "key": {"id": row["id"]},
                "expected": {"source_document_id": 45, "title": row["title"]},
                "changes": {
                    "source_document_id": 4,
                    "title": f"Resolução comentada — síntese editorial — Vestibular Unicamp 2026, Q/X, questão {number}",
                },
                "reason": "O registro apontava para o PDF do gabarito, que não contém a resolução comentada. A fonte passa ao PDF oficial de comentários e o título deixa claro que o texto no banco é uma síntese editorial, não uma transcrição oficial.",
                "evidence": [
                    {"locator": OFFICIAL_COMMENTARY,
                     "detail": f"PDF oficial de questões comentadas da primeira fase de 2026, com comentário correspondente à questão Q/X {number}; manter o conteúdo identificado como síntese editorial, sem atribuir literalidade."},
                    {"locator": "sqlite://source_documents/45",
                     "detail": "Fonte anterior é somente gabarito oficial e não é fonte suficiente para a justificativa comentada."},
                ],
            })
        return {"format": "editorial-review-decisions/v1",
                "summary": "Corrigir proveniência e rótulos das sínteses de resolução Q/X 2026 sem alterar o texto das soluções.",
                "decisions": decisions}
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DATABASE)
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args()
    manifest = build(args.database)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"manifest": str(args.output), "decisions": len(manifest["decisions"])}))


if __name__ == "__main__":
    main()
