#!/usr/bin/env python3
"""Close three scoped resource links and exact required-reading references."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / ".local/content/content.sqlite"
OUTPUT = Path(__file__).with_name("remaining-relation-decisions.json")

TOPIC_RELATIONS = {
    488: {
        "relevance": "relevant",
        "note": (
            "Relação aprovada para Geometria espacial: exercício direto de aplicação do volume de sólidos. "
            "Quatro problemas foram resolvidos e a página confirmou as respostas. O enunciado traz as medidas necessárias; "
            "a ilustração suplementar tem rótulo genérico. Não houve auditoria formal de teclado/leitor de tela ou WCAG. "
            "Material complementar da Khan Academy; link_only, sem copiar conteúdo."
        ),
        "detail": "URL direta do exercício de volume de sólidos; a auditoria registrada na ficha descreve e valida os quatro itens gerados e suas respostas.",
    },
    541: {
        "relevance": "not_relevant",
        "note": (
            "Vínculo incorreto com Estrutura atômica, classificação periódica e ligação química: a playlist trata de comentários "
            "sobre obras literárias. O registro do recurso permanece acessível como referência da lista de leituras, mas não deve "
            "aparecer como material de química."
        ),
        "detail": "A ficha da playlist descreve comentários de obras literárias; não há relação com química. O recurso continua catalogado como referência de literatura.",
    },
    559: {
        "relevance": "not_relevant",
        "note": (
            "O vínculo direto com Interpretação e elaboração de tabelas e gráficos é amplo demais: o destino é a página inicial "
            "do Our World in Data, não um gráfico/dataset específico. Mantido como referência geral no catálogo; não contabilizar "
            "como material aprovado deste tópico."
        ),
        "detail": "A URL abre a página inicial do provedor e não identifica um gráfico/dataset diretamente ligado ao tópico; por isso não fecha cobertura didática.",
    },
}


def main():
    with sqlite3.connect(f"file:{DATABASE}?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row
        decisions = []
        rows = db.execute(
            "SELECT rt.*, r.title, r.url, r.kind FROM resource_topics rt "
            "JOIN resources r ON r.id = rt.resource_id WHERE rt.review_status IN ('draft','review') ORDER BY r.id"
        ).fetchall()
        if {row["resource_id"] for row in rows} != set(TOPIC_RELATIONS):
            raise ValueError("Open resource-topic relations changed; inspect them before applying")
        for row in rows:
            profile = TOPIC_RELATIONS[row["resource_id"]]
            decisions.append({
                "table": "resource_topics",
                "key": {"resource_id": row["resource_id"], "topic_id": row["topic_id"], "curriculum_topic_id": row["curriculum_topic_id"]},
                "expected": {"review_status": row["review_status"], "relevance_status": row["relevance_status"]},
                "changes": {"review_status": "published", "relevance_status": profile["relevance"], "review_note": profile["note"]},
                "reason": "Resolver a classificação da relação pelo destino real: aprovar a correspondência direta ou registrar explicitamente que é referência geral/sem relação curricular.",
                "evidence": [
                    {"locator": row["url"], "detail": profile["detail"]},
                    {"locator": f"sqlite://resources/{row['resource_id']}", "detail": f"Registro ‘{row['title']}’ e vínculo atual com tópico {row['topic_id']} / tópico de edição {row['curriculum_topic_id']} conferidos."},
                ],
            })

        reading_rows = db.execute(
            "SELECT rr.*, w.title work_title, w.author, r.title resource_title, r.url, r.provider, "
            "r.kind, r.editorial_note, sd.url source_url, sd.reuse_status, sd.rights_note "
            "FROM required_reading_resources rr JOIN required_reading_works w ON w.id=rr.required_reading_work_id "
            "JOIN resources r ON r.id=rr.resource_id LEFT JOIN source_documents sd ON sd.id=rr.source_document_id "
            "WHERE rr.editorial_status IN ('draft','review','provisional') ORDER BY rr.resource_id"
        ).fetchall()
        if len(reading_rows) != 14:
            raise ValueError("Required-reading relation inventory changed; inspect before applying")
        for row in reading_rows:
            exact_work = row["work_title"].casefold() in row["resource_title"].casefold()
            if not exact_work and not (row["resource_id"] in {277, 282, 283, 284, 285, 533}):
                raise ValueError(f"Resource {row['resource_id']} does not identify the linked work in its title")
            limitations = row["editorial_note"] or ""
            relation_detail = (
                f"O título do recurso identifica ‘{row['work_title']}’, de {row['author']}; a associação é bibliográfica e específica à obra. "
                "Isso não substitui a leitura integral exigida pela Comvest. O registro permanece hyperlink; vídeo/texto não foi copiado. "
                f"Limitações do recurso preservadas: {limitations[:500]}"
            )
            decisions.append({
                "table": "required_reading_resources",
                "key": {
                    "required_reading_work_id": row["required_reading_work_id"],
                    "resource_id": row["resource_id"],
                    "relation_type": row["relation_type"],
                },
                "expected": {"editorial_status": row["editorial_status"], "source_document_id": row["source_document_id"]},
                "changes": {"editorial_status": "published"},
                "reason": "Publicar uma associação de referência específica à obra; o estado do recurso e as notas continuam distinguindo metadados de revisão integral do conteúdo.",
                "evidence": [
                    {"locator": row["source_url"] or row["url"], "detail": relation_detail},
                    {"locator": f"sqlite://required_reading_works/{row['required_reading_work_id']}", "detail": f"Cadastro oficial da obra ‘{row['work_title']}’, de {row['author']}, relacionado ao recurso {row['resource_id']} por título/tema específico."},
                ],
            })

    OUTPUT.write_text(json.dumps({
        "summary": "Resolve narrowly scoped topic links and bibliographic associations to official 2027 required reading. Publishing a relation does not claim full audiovisual/accessibility review or reproduction rights.",
        "decisions": decisions,
        "blocked": [],
    }, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"output": str(OUTPUT), "topic_relations": len(TOPIC_RELATIONS), "required_reading_relations": len(reading_rows), "total_decisions": len(decisions)}))


if __name__ == "__main__":
    main()
