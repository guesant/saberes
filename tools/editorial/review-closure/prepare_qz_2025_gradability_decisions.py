#!/usr/bin/env python3
"""Enable automatic grading only for fully verified QZ2025 single-choice keys."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / ".local/content/content.sqlite"
OUTPUT = Path(__file__).with_name("qz-2025-gradability-decisions.json")
ASSESSMENT_ID = 50


def main():
    with sqlite3.connect(f"file:{DATABASE}?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row
        rows = db.execute(
            "SELECT asi.position, asi.question_occurrence_id, qo.question_id, q.statement, "
            "ak.id key_id, ak.version, ak.status, ak.answer_type, ak.answer_value, "
            "ak.is_automatically_gradable, ak.max_points, "
            "(SELECT COUNT(*) FROM question_options opt WHERE opt.question_id=q.id) option_count, "
            "(SELECT COUNT(*) FROM canonical_answer_key_options map WHERE map.answer_key_id=ak.id) mapped_count, "
            "(SELECT opt.code FROM canonical_answer_key_options map JOIN question_options opt ON opt.id=map.question_option_id WHERE map.answer_key_id=ak.id LIMIT 1) mapped_code, "
            "(SELECT opt.question_id FROM canonical_answer_key_options map JOIN question_options opt ON opt.id=map.question_option_id WHERE map.answer_key_id=ak.id LIMIT 1) mapped_question_id "
            "FROM assessment_set_items asi JOIN question_occurrences qo ON qo.id=asi.question_occurrence_id "
            "JOIN questions q ON q.id=qo.question_id JOIN canonical_answer_keys ak ON ak.occurrence_id=qo.id "
            "AND ak.version=(SELECT MAX(last.version) FROM canonical_answer_keys last WHERE last.occurrence_id=qo.id) "
            "WHERE asi.assessment_set_id=? ORDER BY asi.position", (ASSESSMENT_ID,)
        ).fetchall()
        if len(rows) != 72:
            raise ValueError("Expected one latest answer-key version per QZ2025 position")
        if [row["position"] for row in rows] != list(range(1, 73)):
            raise ValueError("QZ2025 positions are not consecutive")
        cancelled = [row for row in rows if row["status"] == "cancelled"]
        if len(cancelled) != 1 or cancelled[0]["position"] != 53:
            raise ValueError("The officially annulled QZ item must remain the only cancelled item at position 53")

        decisions = []
        for row in rows:
            if row["status"] == "cancelled":
                if row["answer_value"] is not None or row["is_automatically_gradable"] != 0:
                    raise ValueError("Do not make the cancelled question answerable/gradable")
                continue
            if (row["status"] != "definitive" or row["answer_type"] != "single_choice"
                    or row["answer_value"] not in {"A", "B", "C", "D"}
                    or row["is_automatically_gradable"] != 0 or row["max_points"] != 1
                    or row["option_count"] != 4 or row["mapped_count"] != 1
                    or row["mapped_code"] != row["answer_value"]
                    or row["mapped_question_id"] != row["question_id"]):
                raise ValueError(f"QZ position {row['position']} failed definitive-key/four-option verification")

            decisions.append({
                "table": "canonical_answer_keys",
                "key": {"id": row["key_id"]},
                "expected": {
                    "occurrence_id": row["question_occurrence_id"],
                    "version": row["version"],
                    "status": "definitive",
                    "answer_type": "single_choice",
                    "answer_value": row["answer_value"],
                    "is_automatically_gradable": 0,
                    "max_points": 1,
                },
                "changes": {"is_automatically_gradable": 1},
                "reason": "A correção automática estava desativada por metadado, apesar de a ocorrência ter gabarito definitivo oficial, exatamente quatro alternativas e vínculo único entre a alternativa marcada e a opção canônica. Habilitar somente a verificação mecânica não altera resposta, versão, pontuação nem conteúdo.",
                "evidence": [
                    {"locator": "https://www.comvest.unicamp.br/wp-content/uploads/2024/10/QZ_gabarito_2025_FINAL_site.pdf", "detail": f"Gabarito definitivo oficial Q/Z confirma a alternativa {row['answer_value']} na posição {row['position']}."},
                    {"locator": f"sqlite://question_occurrences/{row['question_occurrence_id']}", "detail": f"Ocorrência {row['question_occurrence_id']} na posição {row['position']} do Q/Z; a questão tem quatro alternativas e o vínculo canônico aponta uma única opção {row['mapped_code']}, pertencente à mesma questão."},
                    {"locator": f"sqlite://canonical_answer_keys/{row['key_id']}", "detail": f"Versão {row['version']} da chave permanece definitiva, resposta {row['answer_value']} e peso máximo de um ponto; somente o indicador técnico de gradabilidade é corrigido."},
                ],
            })

    OUTPUT.write_text(json.dumps({
        "summary": "Set the mechanical grading flag only for verified definitive QZ2025 single-choice keys. Preserve the official Q53 cancellation and award rule.",
        "decisions": decisions,
        "blocked": [],
    }, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"output": str(OUTPUT), "gradable_keys": len(decisions), "cancelled_item_preserved": True}))


if __name__ == "__main__":
    main()
