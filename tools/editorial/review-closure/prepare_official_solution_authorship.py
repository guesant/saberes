#!/usr/bin/env python3
"""Prepare institutional authorship metadata for official commented exams."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / ".local/content/content.sqlite"
OUTPUT = Path(__file__).with_name("official-solution-authorship-representatives-2025-2026.json")
SOURCE_IDS = (4, 5)


def main():
    with sqlite3.connect(f"file:{DATABASE}?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row
        sources = {
            row["id"]: dict(row)
            for row in db.execute(
                "SELECT id,title,url,provider,is_official FROM source_documents WHERE id IN (?,?)",
                SOURCE_IDS,
            )
        }
        if set(sources) != set(SOURCE_IDS) or any(
            source["is_official"] != 1 or source["provider"] != "Comvest / Unicamp"
            for source in sources.values()
        ):
            raise ValueError("Official source-document identity changed; inspect before preparing authorship")

        rows = db.execute(
            """SELECT qs.id,qs.question_id,qs.source_document_id,qs.editorial_status,
                      qs.editorial_version,qs.authorship,sd.title,sd.url,sd.provider,sd.is_official
               FROM question_solutions qs JOIN source_documents sd ON sd.id=qs.source_document_id
               WHERE qs.source_document_id IN (?,?) AND qs.editorial_status='published'
                 AND EXISTS (
                   SELECT 1 FROM question_occurrences qo
                   JOIN papers p ON p.id=qo.paper_id
                   JOIN paper_versions pv ON pv.id=qo.paper_version_id
                   JOIN stages st ON st.id=p.stage_id
                   JOIN editions ed ON ed.id=st.edition_id
                   WHERE qo.question_id=qs.question_id AND st.name='1ª fase'
                     AND ((qs.source_document_id=5 AND ed.year=2025 AND pv.code='QZ')
                       OR (qs.source_document_id=4 AND ed.year=2026 AND pv.code='QX'))
                 )
               ORDER BY qs.source_document_id,qs.id""",
            SOURCE_IDS,
        ).fetchall()
        if not rows:
            raise ValueError("No official published solutions found")

        decisions = []
        for row in rows:
            if row["is_official"] != 1 or row["provider"] != "Comvest / Unicamp":
                raise ValueError(f"Solution {row['id']} no longer points to an official institutional source")
            if row["authorship"] == "Comvest / Unicamp":
                continue
            if row["authorship"] is not None:
                raise ValueError(f"Solution {row['id']} already has distinct authorship; manual review required")
            if row["editorial_version"] is not None:
                raise ValueError(f"Solution {row['id']} has an existing editorial version; preserve it")
            decisions.append({
                "table": "question_solutions",
                "key": {"id": row["id"]},
                "expected": {
                    "question_id": row["question_id"],
                    "source_document_id": row["source_document_id"],
                    "editorial_status": "published",
                    "editorial_version": None,
                    "authorship": None,
                },
                "changes": {"authorship": "Comvest / Unicamp"},
                "reason": (
                    "A resolução é parte de um documento oficial de prova comentada publicado pela Comvest/Unicamp. "
                    "Atribui-se somente autoria institucional sustentada pelo documento; não se infere autor individual "
                    "nem se inventa versão editorial."
                ),
                "evidence": [
                    {
                        "locator": row["url"],
                        "detail": (
                            f"Documento oficial ‘{row['title']}’, publicado por {row['provider']}; "
                            "a resolução permanece vinculada à fonte original."
                        ),
                    },
                    {
                        "locator": f"sqlite://question_solutions/{row['id']}",
                        "detail": (
                            f"Solução publicada da questão {row['question_id']}; source_document_id="
                            f"{row['source_document_id']}."
                        ),
                    },
                ],
            })

        OUTPUT.write_text(json.dumps({
            "summary": (
                "Autoria institucional das soluções do representante QZ 2025 e QX 2026, vinculadas aos PDFs oficiais comentados. "
                "Versões editoriais não fornecidas pelas fontes permanecem nulas; a divergência de identificação "
                "interna do PDF de 2026 continua documentada."
            ),
            "decisions": decisions,
        }, ensure_ascii=False, indent=2) + "\n")
        print(json.dumps({"output": str(OUTPUT), "decisions": len(decisions)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
