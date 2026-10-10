#!/usr/bin/env python3
"""Prepare an evidence-backed, narrowly scoped Q/X 2026 topic review batch."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / ".local/content/content.sqlite"
OUTPUT = Path(__file__).with_name("qx-2026-q08-q30-classification-decisions.json")
SOURCE_ID = 44
SOURCE_URL = "https://www.comvest.unicamp.br/vest2026/F1/f12026Q_X.pdf"

# question id, canonical topic id, old relation, old confidence, approved relation,
# confidence, PDF page, editorial evidence from the official question.
APPROVALS = [
    (296, 2471, "primary", .98, "secondary", .90, 5, "O enunciado descreve transferência de calor por condução, convecção e radiação."),
    (296, 2515, None, None, "primary", .99, 5, "As afirmativas avaliam diretamente os mecanismos de transferência de calor."),
    (297, 2487, "primary", .98, "primary", .98, 5, "A questão calcula carga elétrica a partir de corrente constante e intervalo de tempo."),
    (298, 2487, "primary", .96, "primary", .96, 5, "O modelo de bateria usa diferença de potencial, resistência e corrente elétrica."),
    (299, 2486, "primary", .98, "primary", .98, 5, "A questão iguala energia armazenada na bateria à variação da energia potencial gravitacional."),
    (300, 2471, "primary", .98, "secondary", .90, 5, "O enunciado situa a aplicação em Física e descreve uma lente delgada."),
    (300, 2516, None, None, "primary", .99, 5, "A questão exige identificar lente convergente/divergente e relacionar objeto à distância focal."),
    (301, 2486, "related", .96, "primary", .96, 6, "A questão interpreta posição em função do tempo em trechos de movimento e aceleração definidos."),
    (302, 2486, "primary", .98, "primary", .98, 6, "A questão calcula a força resultante a partir da massa e da desaceleração constante."),
    (304, 2494, "related", .90, "secondary", .90, 7, "O mapa e as coordenadas são usados para interpretar uma regionalização político-geográfica."),
    (304, 2495, "primary", .90, "primary", .90, 7, "A questão define a divisão Norte Global/Sul Global como regionalização político-geográfica."),
    (305, 2490, "related", .90, "secondary", .86, 7, "O enunciado relaciona clima e zonobiomas à distribuição de formações naturais."),
    (306, 2495, "primary", .95, "secondary", .87, 8, "A disputa hídrica na bacia do Indo é contextualizada por relações territoriais entre Índia e Paquistão."),
    (307, 2495, "primary", .95, "primary", .95, 8, "O texto e o mapa tratam de alianças, disputas e influência geopolítica do Irã."),
    (308, 2495, "primary", .96, "primary", .96, 9, "O mapa e o texto abordam a incorporação de áreas baianas a circuitos espaciais produtivos."),
    (309, 2495, "primary", .97, "primary", .97, 9, "A questão interpreta centros de gestão e comando na rede urbana brasileira."),
    (310, 2498, "related", .92, "primary", .92, 10, "Os textos relacionam consumo, distinção social e práticas culturais alimentares."),
    (311, 2498, "primary", .94, "primary", .94, 10, "Os textos discutem concepções de povos indígenas sobre sociedade, Terra e produção."),
    (312, 2498, "primary", .94, "primary", .94, 10, "A questão relaciona a experiência da adolescência a práticas e construções sociais."),
    (313, 2497, "primary", .94, "primary", .94, 11, "O texto discute gênero, reconhecimento e consequências políticas da classificação social."),
    (313, 2498, "related", .90, "secondary", .90, 11, "A construção social do gênero é também um tema de cultura e sociedade."),
    (314, 2497, "primary", .97, "primary", .97, 11, "Os textos de Rosa Luxemburgo discutem democracia, socialismo e participação política."),
    (315, 2497, "primary", .98, "primary", .98, 11, "Os textos de Cícero tratam explicitamente dos fundamentos da justiça."),
    (316, 2492, "primary", .97, "primary", .97, 12, "O texto situa o tráfico de pessoas escravizadas em Buenos Aires e relaciona redes coloniais à região do Rio da Prata."),
    (317, 2474, "primary", .97, "primary", .97, 12, "A questão contextualiza práticas esportivas e masculinidade na Grécia do Período Clássico."),
    (318, 2497, "related", .92, "secondary", .92, 12, "O excerto de Rousseau aborda contrato social, obediência e fundamentos da organização política."),
]

NOT_APPROVED = [
    {
        "question_id": 303,
        "canonical_topic_id": 2495,
        "occurrence_key": "vu-2026-qx-f1-q15",
        "reason": "Não promover: o vínculo amplo com Território e geopolítica não é específico o bastante para esta questão. A relação secundária mais precisa com Globalização, economia e trabalho já está publicada; o candidato antigo permanece em revisão e fora do treino.",
    },
    {
        "question_id": 318,
        "canonical_topic_id": 2492,
        "occurrence_key": "vu-2026-qx-f1-q30",
        "reason": "Não promover: a questão trata do Contrato Social de Rousseau e não sustenta associação a História do Brasil. O candidato permanece em revisão e fora do treino.",
    },
]


def main():
    decisions = []
    with sqlite3.connect(f"file:{DATABASE}?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row
        for question_id, topic_id, old_type, old_confidence, new_type, confidence, page, excerpt in APPROVALS:
            occurrence = db.execute(
                "SELECT q.slug, qo.occurrence_key, qo.source_page FROM questions q "
                "JOIN question_occurrences qo ON qo.question_id=q.id WHERE q.id=?",
                (question_id,),
            ).fetchone()
            if occurrence is None or occurrence["source_page"] != page:
                raise ValueError(f"Occurrence/source page changed for question {question_id}")
            key = {"question_id": question_id, "canonical_topic_id": topic_id}
            row = db.execute(
                "SELECT * FROM question_canonical_topics WHERE question_id=? AND canonical_topic_id=?",
                (question_id, topic_id),
            ).fetchone()
            if old_type is None:
                if row is not None:
                    raise ValueError(f"Unexpected existing relation: {key}")
                expected = {"exists": False}
                changes = {
                    **key,
                    "relation_type": new_type,
                    "confidence": confidence,
                    "source_document_id": SOURCE_ID,
                    "source_page": page,
                    "source_excerpt": excerpt,
                    "review_status": "published",
                }
            else:
                if row is None:
                    raise ValueError(f"Missing expected relation: {key}")
                current = dict(row)
                if (current["relation_type"] != old_type or current["confidence"] != old_confidence
                        or current["review_status"] != "review" or current["source_document_id"] is not None
                        or current["source_page"] is not None or current["source_excerpt"] is not None):
                    raise ValueError(f"Relation no longer matches reviewed state: {key}")
                expected = {
                    "relation_type": old_type,
                    "confidence": old_confidence,
                    "review_status": "review",
                    "source_document_id": None,
                    "source_page": None,
                    "source_excerpt": None,
                }
                changes = {
                    "relation_type": new_type,
                    "confidence": confidence,
                    "source_document_id": SOURCE_ID,
                    "source_page": page,
                    "source_excerpt": excerpt,
                    "review_status": "published",
                }
            decisions.append({
                "table": "question_canonical_topics",
                "key": key,
                "expected": expected,
                "changes": changes,
                "reason": "Classificação editorial revisada com base no enunciado da prova oficial. A associação não é uma tag atribuída pela Comvest; tópicos específicos e relações secundárias são mantidos como tais.",
                "evidence": [
                    {"locator": f"{SOURCE_URL}#page={page}", "detail": f"Caderno oficial Q/X 2026, questão {int(occurrence['occurrence_key'].rsplit('q', 1)[1])}, página {page}. {excerpt}"},
                    {"locator": f"sqlite://question_occurrences/{occurrence['occurrence_key']}", "detail": f"Ocorrência {occurrence['occurrence_key']} da questão canônica {question_id}, com página de origem conferida."},
                    {"locator": f"sqlite://canonical_topics/{topic_id}", "detail": f"Tópico canônico {topic_id}; vínculo classificado como {new_type} e publicado somente com a evidência indicada."},
                ],
            })

        for item in NOT_APPROVED:
            row = db.execute(
                "SELECT review_status FROM question_canonical_topics WHERE question_id=? AND canonical_topic_id=?",
                (item["question_id"], item["canonical_topic_id"]),
            ).fetchone()
            if row is None or row["review_status"] != "review":
                raise ValueError(f"Held candidate changed since review: {item}")

    OUTPUT.write_text(json.dumps({
        "summary": "Aprova somente relações editoriais sustentadas pela prova oficial Q/X 2026, preserva dois candidatos inadequados em revisão e fora dos treinos, e detalha calorimetria/termodinâmica e óptica para QX 8 e QX 12.",
        "decisions": decisions,
        "not_approved": NOT_APPROVED,
    }, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"output": str(OUTPUT), "approvals": len(decisions), "held_out": len(NOT_APPROVED)}))


if __name__ == "__main__":
    main()
