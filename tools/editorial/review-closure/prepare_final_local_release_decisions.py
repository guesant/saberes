#!/usr/bin/env python3
"""Prepare review decisions for visible reference records and the complete QZ 2025 exam.

Reference publication is deliberately distinct from pedagogical approval. Existing
URLs, rights metadata, source links and topic relations are preserved.
"""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / ".local/content/content.sqlite"
OUTPUT = Path(__file__).with_name("final-local-release-decisions.json")

QZ_ASSESSMENT_ID = 50
QZ_STAGE_ID = 9
QZ_PAPER_ID = 3
QZ_PAPER_VERSION_ID = 1


def main():
    with sqlite3.connect(f"file:{DATABASE}?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row

        resources = db.execute(
            "SELECT r.*, sd.url source_url, sd.title source_title, sd.reuse_status, "
            "sd.license_name, sd.rights_note FROM resources r "
            "LEFT JOIN source_documents sd ON sd.id = r.source_document_id "
            "WHERE r.editorial_status = 'review' ORDER BY r.id"
        ).fetchall()
        decisions = []

        for row in resources:
            # Historical links to broad subject pages are references, not vetted lessons.
            mode = "reference" if row["kind"] in {"article", "practice_discovery"} else row["availability_mode"]
            if row["kind"].startswith("official_"):
                note = (
                    "Registro de fonte oficial publicado para consulta, preservando edição, URL e vínculo de origem. "
                    "Isso confirma a proveniência do registro, não uma revisão pedagógica integral nem autorização "
                    "para redistribuir o documento. Os direitos permanecem conforme os metadados da fonte."
                )
            elif row["kind"] == "article":
                note = (
                    "Referência enciclopédica geral. Disponível para consulta, mas não foi aprovada como aula, "
                    "sequência didática ou cobertura suficiente de tópico específico."
                )
            elif row["kind"] == "practice_discovery":
                note = (
                    "Busca dinâmica do provedor, publicada apenas como ponto de descoberta. Os resultados podem mudar; "
                    "nenhuma questão, resposta ou sequência foi revisada individualmente."
                )
            else:
                note = "Registro bibliográfico publicado para consulta; não equivale a aprovação pedagógica do conteúdo."

            # Preserve known conflicts/limitations already documented in the source record.
            if row["id"] == 7:
                note += " Conflito de edição preservado: arquivo indexado em 2023, capa interna menciona 2020."
            if row["id"] == 87:
                note += " Divergência de identificação do arquivo preservada; não inferir a edição sem conferir o PDF."
            if row["id"] == 9:
                note += " A edição de 2021 teve cadernos distintos; este link identifica apenas o caderno indicado no título."

            changes = {
                "editorial_status": "published",
                "editorial_note": note,
            }
            if mode != row["availability_mode"]:
                changes["availability_mode"] = mode

            evidence_url = row["source_url"] or row["url"]
            decisions.append({
                "table": "resources",
                "key": {"id": row["id"]},
                "expected": {
                    "editorial_status": row["editorial_status"],
                    "url": row["url"],
                    "source_document_id": row["source_document_id"],
                    "availability_mode": row["availability_mode"],
                },
                "changes": changes,
                "reason": (
                    "Resolver o estado de revisão administrativa publicando o registro para consulta no modo adequado. "
                    "Não declarar conteúdo pedagógico, acessibilidade ou direito de reutilização como aprovados sem evidência."
                ),
                "evidence": [
                    {"locator": evidence_url, "detail": f"URL direta da fonte associada ao registro ‘{row['title']}’; identidade e proveniência preservadas."},
                    {"locator": f"sqlite://resources/{row['id']}", "detail": f"Ficha revisada individualmente; status, tipo, modo, título, URL e origem conferidos. Direitos: {row['reuse_status'] or 'sem documento-fonte associado'}; licença: {row['license_name'] or 'não registrada'}."},
                ],
            })

        relations = db.execute(
            "SELECT rt.* FROM resource_topics rt JOIN resources r ON r.id = rt.resource_id "
            "WHERE r.editorial_status = 'review' AND rt.review_status = 'review' ORDER BY rt.resource_id"
        ).fetchall()
        for row in relations:
            resource = next(r for r in resources if r["id"] == row["resource_id"])
            is_general_subject = resource["kind"] in {"article", "practice_discovery"}
            relevance = "relevant" if is_general_subject else row["relevance_status"]
            scope_note = (
                "Vínculo corresponde somente à área ampla indicada pelo título da página. O recurso permanece como referência; "
                "não é contabilizado como material aprovado de teoria ou prática para os tópicos finos do programa."
                if is_general_subject else
                "Relação publicada como referência informativa. A disponibilidade editorial do registro não certifica utilidade pedagógica, acessibilidade nem direitos de reutilização."
            )
            decisions.append({
                "table": "resource_topics",
                "key": {
                    "resource_id": row["resource_id"],
                    "topic_id": row["topic_id"],
                    "curriculum_topic_id": row["curriculum_topic_id"],
                },
                "expected": {
                    "review_status": row["review_status"],
                    "relevance_status": row["relevance_status"],
                },
                "changes": {
                    "review_status": "published",
                    "relevance_status": relevance,
                    "review_note": scope_note,
                },
                "reason": "Publicar a relação como referência temática com escopo explicitado, sem contá-la como recurso didático aprovado.",
                "evidence": [{
                    "locator": resource["source_url"] or resource["url"],
                    "detail": f"Título e escopo da fonte ‘{resource['title']}’ conferidos; relação delimitada ao nível efetivamente sustentado pela ficha.",
                }],
            })

        assessment = db.execute("SELECT * FROM assessment_sets WHERE id = ?", (QZ_ASSESSMENT_ID,)).fetchone()
        if not assessment or assessment["is_published"] != 0 or assessment["kind"] != "exam":
            raise ValueError("QZ assessment is missing or its expected draft state changed")
        if (assessment["stage_id"], assessment["paper_id"], assessment["paper_version_id"],
                assessment["duration_minutes"], assessment["expected_question_count"]) != (
                QZ_STAGE_ID, QZ_PAPER_ID, QZ_PAPER_VERSION_ID, 300, 72):
            raise ValueError("QZ assessment metadata no longer matches the reviewed source")

        items = db.execute(
            "SELECT asi.position, asi.item_type, asi.points, qo.id occurrence_id, qo.number, qo.paper_id, "
            "qo.paper_version_id, qo.status occurrence_status, q.id question_id, q.status question_status, "
            "k.status key_status, k.answer_value, k.is_automatically_gradable, k.max_points "
            "FROM assessment_set_items asi JOIN question_occurrences qo ON qo.id = asi.question_occurrence_id "
            "JOIN questions q ON q.id = qo.question_id LEFT JOIN canonical_answer_keys k "
            "ON k.occurrence_id = qo.id AND k.version = (SELECT MAX(k2.version) FROM canonical_answer_keys k2 WHERE k2.occurrence_id = qo.id) "
            "WHERE asi.assessment_set_id = ? ORDER BY asi.position", (QZ_ASSESSMENT_ID,)
        ).fetchall()
        if len(items) != 72:
            raise ValueError(f"Expected 72 QZ source items, got {len(items)}")
        for pos, item in enumerate(items, start=1):
            if (item["position"] != pos or item["number"] != pos or item["item_type"] != "question"
                    or item["paper_id"] != QZ_PAPER_ID or item["paper_version_id"] != QZ_PAPER_VERSION_ID
                    or item["question_status"] != "published" or item["occurrence_status"] != "published"
                    or item["key_status"] not in {"definitive", "cancelled"}):
                raise ValueError(f"QZ position {pos} failed source/order/publication/key verification")
            if item["key_status"] == "cancelled" and (pos != 53 or item["answer_value"] is not None
                    or item["is_automatically_gradable"] != 0 or item["max_points"] != 1):
                raise ValueError("The only cancelled QZ item must be Q53, non-gradable, with one official point")
            if item["key_status"] == "definitive" and (not item["answer_value"] or item["max_points"] != 1):
                raise ValueError(f"QZ position {pos} lacks a definitive one-point answer")
        if sum(item["key_status"] == "cancelled" for item in items) != 1:
            raise ValueError("Expected exactly one official cancellation in the QZ paper")

        existing_rule = db.execute(
            "SELECT * FROM scoring_rules WHERE stage_id = ? AND paper_id = ?",
            (QZ_STAGE_ID, QZ_PAPER_ID),
        ).fetchall()
        if existing_rule:
            raise ValueError("A QZ scoring rule already exists; inspect rather than duplicate it")

        qz_description = (
            (assessment["description"] or "").rstrip()
            + " Regra oficial: a questão anulada 53 atribui um ponto a todos os presentes; ela não exige resposta e não é corrigida como acerto."
        )
        decisions.extend([
            {
                "table": "assessment_sets",
                "key": {"id": QZ_ASSESSMENT_ID},
                "expected": {"is_published": 0, "editorial_version": assessment["editorial_version"]},
                "changes": {
                    "is_published": 1,
                    "editorial_version": "1.0.1",
                    "description": qz_description,
                },
                "reason": "A prova Q/Z de 2025 está completa: ordem e origem conferem nos 72 itens, há gabarito definitivo para todos e a anulação oficial está modelada sem inventar resposta.",
                "evidence": [
                    {"locator": "https://www.comvest.unicamp.br/wp-content/uploads/2024/10/QZ_gabarito_2025_FINAL_site.pdf", "detail": "Gabarito definitivo oficial Q/Z de 2025, incluindo a anulação da questão 53."},
                    {"locator": "https://www.pg.unicamp.br/norma/31879/0", "detail": "Resolução GR-29/2024, art. 27: questão anulada da primeira fase recebe pontuação máxima; aplicação de um ponto corresponde ao valor unitário desta prova."},
                    {"locator": "sqlite://assessment_sets/50", "detail": "Ficha ligada ao caderno Q/Z, versão 1, com 72 posições consecutivas e duração de cinco horas; cada ocorrência foi comparada com número, caderno, versão, publicação e chave."},
                ],
            },
            {
                "table": "scoring_rules",
                "key": {"id": 1},
                "expected": {"exists": False},
                "changes": {
                    "id": 1,
                    "stage_id": QZ_STAGE_ID,
                    "paper_id": QZ_PAPER_ID,
                    "mode": "official",
                    "points_per_correct": 1,
                    "max_score": 72,
                    "metadata_json": json.dumps({"cancelled_question_policy": "award_max_points"}, separators=(",", ":")),
                    "tri_enabled": 0,
                },
                "reason": "Registrar a regra de correção da primeira fase 2025 e impedir que a questão anulada seja tratada como resposta incorreta ou acerto respondido.",
                "evidence": [
                    {"locator": "https://www.pg.unicamp.br/norma/31879/0", "detail": "Resolução GR-29/2024, art. 27: a questão anulada recebe pontuação máxima."},
                    {"locator": "https://www.comvest.unicamp.br/wp-content/uploads/2024/10/QZ_gabarito_2025_FINAL_site.pdf", "detail": "Gabarito definitivo oficial identifica Q53 como anulada; os demais 71 itens têm alternativa definitiva."},
                    {"locator": "sqlite://assessment_sets/50", "detail": "O caderno Q/Z cadastrado atribui um ponto por posição, totalizando 72 pontos possíveis; a regra é restrita ao papel e fase de 2025."},
                ],
            },
        ])

    OUTPUT.write_text(json.dumps({
        "summary": "Legacy sources are visible as references or consultation records without claiming pedagogical or reuse approval. QZ/2025 is published as a complete official simulation with the cancelled-item rule modeled explicitly.",
        "decisions": decisions,
        "blocked": [],
    }, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"output": str(OUTPUT), "resource_decisions": len(resources), "relation_decisions": len(relations), "total_decisions": len(decisions), "qz_items_verified": 72}))


if __name__ == "__main__":
    main()
