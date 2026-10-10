#!/usr/bin/env python3
"""Prepare link-only practice recommendations from individually checked items."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / '.local/content/content.sqlite'
OUTPUT = Path(__file__).with_name('verified-practice-batch-2026-10-10.json')
STAGE_ID = 11

# Only listed item numbers were checked. These records do not endorse the rest
# of each provider's list or imply permission to copy its questions/answers.
ITEMS = [
    {'topic': 2490, 'title': 'Grécia Antiga — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-historia/exercicios-sobre-a-grecia-antiga.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q1–Q2: gabaritos B e A; Guerra do Peloponeso e ostracismo ateniense.', 'limit': 'Recorte da Grécia clássica; não cobre Roma nem o período medieval.', 'accessibility': 'Itens textuais nesta seleção; teclado/leitor de tela não auditados.', 'evidence': 'Questões 1 e 2, gabaritos B e A; explicações conferidas para Guerra do Peloponeso e ostracismo ateniense.'},
    {'topic': 2490, 'title': 'Roma Antiga — prática selecionada', 'url': 'https://www.todamateria.com.br/exercicios-roma-antiga/', 'provider': 'Toda Matéria', 'kind': 'exercise', 'questions': 'Usar Q1–Q2: sequência Monarquia → República → Império; Q2 resposta D, com explicação sobre plebeus.', 'limit': 'Recorte de Roma antiga; não cobre Grécia nem sociedades medievais. A sequência de Q1 é conferida pelo texto explicativo, sem letra de alternativa explicitada na inspeção.', 'accessibility': 'Itens textuais nesta seleção; teclado/leitor de tela não auditados.', 'evidence': 'Q1 apresenta sequência histórica correta no texto de resposta; Q2 resposta D e explicação coerente sobre a condição social dos plebeus.'},
    {'topic': 2490, 'title': 'Educação na Idade Média — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-historia/exercicios-sobre-educacao-na-idade-media.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q1–Q2: gabaritos D e B, sobre urbanização/comércio/universidades e cultura medieval.', 'limit': 'Recorte da história da educação e cultura medieval; não cobre toda a sociedade medieval.', 'accessibility': 'Itens textuais nesta seleção; teclado/leitor de tela não auditados.', 'evidence': 'Q1 D relaciona crescimento urbano/comercial e universidades; Q2 B trata de universidades e arquitetura gótica.'},
    {'topic': 2491, 'title': 'Formação dos Estados Nacionais Modernos — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-historia/exercicios-sobre-formacao-dos-estados-nacionais-modernos.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q1–Q2: gabaritos D e A, com justificativas sobre absolutismo e mercantilismo.', 'limit': 'Prática parcial de formação política/econômica moderna; não cobre Renascimento, Reforma e expansão marítima em conjunto.', 'accessibility': 'Itens textuais nesta seleção; teclado/leitor de tela não auditados.', 'evidence': 'Q1 D e Q2 A; justificativas sobre absolutismo e mercantilismo conferidas.'},
    {'topic': 2491, 'title': 'Renascimento Científico — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-historia/exercicios-sobre-renascimento-cientifico.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q1 e Q4: gabaritos A e E, com justificativas conferidas.', 'limit': 'Excluir Q2: a formulação mistura referências ao século XVIII e ao Renascimento. Prática selecionada não cobre todos os aspectos da Idade Moderna.', 'accessibility': 'Itens selecionados sem dependência de figura observada; teclado/leitor de tela não auditados.', 'evidence': 'Q1 A aborda Revolução Científica; Q4 E discute ciência moderna. Q2 foi excluída por problema de formulação.'},
    {'topic': 2493, 'title': 'Patrimônio, cultura e diversidade — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-sociologia/enem-lista-de-exercicios-sobre-patrimonio-e-diversidade-no-brasil.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q1 D, Q3 B, Q4 E, Q9 C e Q15 B; itens textuais sobre imaginário social, ruralidades, indústria cultural, etnocentrismo e diversidade.', 'limit': 'Itens selecionados apenas; outros itens visuais/jurídicos da lista não são recomendados neste registro.', 'accessibility': 'Questões listadas são textuais; acessibilidade assistiva não auditada.', 'evidence': 'Enunciados e gabaritos publicados foram conferidos individualmente para Q1, Q3, Q4, Q9 e Q15.'},
    {'topic': 2493, 'title': 'Trabalho, sociedade e tecnologia — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-sociologia/enem-lista-de-exercicios-sobre-trabalho-sociedade-e-tecnologia.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q3 C, Q4 D, Q5 D, Q9 D, Q11 A e Q12 C; os itens 11–12 abordam dimensões simbólicas e consumo.', 'limit': 'Prática complementar parcial; excluir questões ilustradas e a questão de tecnologia cuja explicação não corresponde à alternativa.', 'accessibility': 'Itens selecionados textuais conforme auditoria; leitor de tela/teclado não testados.', 'evidence': 'Enunciados e gabaritos Q3, Q4, Q5, Q9, Q11 e Q12 conferidos; questões problemáticas foram excluídas.'},
    {'topic': 2500, 'title': 'Biodiversidade — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-geografia/exercicios-sobre-biodiversidade.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q2 D, Q3 A, Q4 C e Q5 D; itens textuais sobre poluição, biodiversidade e impactos nos ecossistemas.', 'limit': 'Itens com imagens foram excluídos. Complementa biodiversidade, mas não substitui prática específica sobre relações entre biodiversidade e saúde humana.', 'accessibility': 'Seleção textual; acessibilidade assistiva não auditada.', 'evidence': 'Gabaritos e justificativas Q2–Q5 conferidos individualmente; itens visuais não foram incluídos.'},
    {'topic': 2500, 'title': 'Poluição e saúde ambiental — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-biologia/exercicios-sobre-poluicao.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q9 D: tecnologias limpas, controle de emissões e educação ambiental.', 'limit': 'Uma questão de saúde ambiental; não cobre sozinha relações específicas entre biodiversidade e saúde humana.', 'accessibility': 'Item selecionado textual; acessibilidade assistiva não auditada.', 'evidence': 'Q9 D e justificativa publicada conferidas.'},
    {'topic': 2506, 'title': 'Estados físicos da matéria — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-quimica/exercicios-sobre-os-estados-fisicos-materia.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q1 B, Q2 E e Q6–Q11: E, A, C, B, C e D. Excluir Q4 (justificativa contraditória), Q5 (não verificável) e Q12 (justificativa imprecisa).', 'limit': 'Somente os itens listados foram revisados; complemento de estados físicos, não cobertura integral de gases, líquidos e sólidos.', 'accessibility': 'Itens textuais selecionados; acessibilidade assistiva não auditada.', 'evidence': 'Gabaritos e justificativas de Q1, Q2 e Q6–Q11 conferidos; Q4, Q5 e Q12 excluídas por problemas documentados.'},
    {'topic': 2511, 'title': 'Leitura de gráficos — prática selecionada', 'url': 'https://exercicios.brasilescola.uol.com.br/amp/exercicios-matematica/exercicios-sobre-os-graficos.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'questions': 'Usar Q1 D, Q2 B e Q3 A; excluir Q4 porque o comentário apresenta totais incompatíveis.', 'limit': 'Q1–Q3 dependem de gráficos/imagens sem descrição textual suficiente; exercício visualmente utilizável, mas não acessível a todos. Acessibilidade alternativa permanece pendente.', 'accessibility': 'needs_improvement: informação essencial está em gráficos sem descrição textual completa.', 'evidence': 'Q1–Q3 e respectivos gabaritos conferidos; Q4 excluída por inconsistência aritmética entre enunciado e justificativa.'},
]


def main():
    with sqlite3.connect(f'file:{DATABASE}?mode=ro', uri=True) as db:
        db.row_factory = sqlite3.Row
        resource_id = db.execute('SELECT COALESCE(MAX(id),0)+1 FROM resources').fetchone()[0]
        source_id = db.execute('SELECT COALESCE(MAX(id),0)+1 FROM source_documents').fetchone()[0]
        decisions, seen = [], set()
        for item in ITEMS:
            if item['url'] in seen:
                raise ValueError(f'Duplicate URL in batch: {item["url"]}')
            seen.add(item['url'])
            existing = db.execute('SELECT * FROM resources WHERE url=?', (item['url'],)).fetchone()
            source = db.execute('SELECT id FROM source_documents WHERE url=?', (item['url'],)).fetchone()
            if existing and existing['id'] != 512:
                raise ValueError(f'Resource already exists and needs explicit reconciliation: {item["url"]}')
            topic = db.execute('''SELECT source_document_id,source_page,source_excerpt
                FROM curriculum_topic_stages WHERE curriculum_topic_id=? AND stage_id=? AND review_status='published' ''',
                (item['topic'], STAGE_ID)).fetchone()
            if not topic:
                raise ValueError(f'Topic lacks published program evidence: {item["topic"]}')
            current_source_id = source['id'] if source else source_id
            if not source:
                decisions.append({'table': 'source_documents', 'key': {'id': current_source_id},
                    'expected': {'exists': False}, 'changes': {'id': current_source_id, 'title': item['title'],
                    'url': item['url'], 'provider': item['provider'], 'kind': 'exercise', 'is_official': 0,
                    'reuse_status': 'link_only', 'license_name': None, 'license_url': None,
                    'attribution': item['provider'],
                    'rights_note': 'Acesso gratuito para estudo observado em 10/10/2026; licença de cópia/adaptação não confirmada. Link e metadados apenas; não reproduzir questões, imagens ou respostas.'},
                    'reason': 'Registrar origem e condição link-only; não inferir permissão de reutilização.',
                    'evidence': [{'locator': item['url'], 'detail': item['evidence']}]})
                source_id += 1
            chosen_questions = item['questions']
            note = (f"{chosen_questions} {item['limit']} Acesso gratuito observado em 10/10/2026; "
                    f"{item['accessibility']} Direitos de cópia/adaptação não confirmados: somente link e metadados.")
            if existing:
                expected = {key: existing[key] for key in ('title','kind','source_document_id','editorial_status','availability_mode')}
                changes = {'description': chosen_questions, 'source_document_id': current_source_id,
                           'editorial_status': 'published', 'editorial_note': note, 'availability_mode': 'practice'}
                rid = existing['id']
            else:
                expected = {'exists': False}
                rid = resource_id
                changes = {'id': rid, 'title': item['title'], 'url': item['url'], 'provider': item['provider'],
                           'kind': item['kind'], 'description': chosen_questions, 'is_free': 1, 'is_published': 1,
                           'source_document_id': current_source_id, 'editorial_status': 'published',
                           'editorial_note': note, 'availability_mode': 'practice'}
                resource_id += 1
            decisions.append({'table': 'resources', 'key': {'id': rid}, 'expected': expected,
                'changes': changes, 'reason': f"Disponibilizar somente itens identificados e conferidos como prática suplementar para o tópico anual {item['topic']}; a seleção não atesta o restante da lista.",
                'evidence': [{'locator': item['url'], 'detail': item['evidence']},
                    {'locator': f"sqlite://curriculum_topic_stages/{item['topic']}/{STAGE_ID}",
                     'detail': f"Programa oficial Unicamp 2027, primeira fase; documento {topic['source_document_id']}, página {topic['source_page']}: {topic['source_excerpt']}"}]})
            relation = db.execute('''SELECT * FROM resource_topics WHERE resource_id=? AND topic_id IS NULL
                AND curriculum_topic_id=?''', (rid, item['topic'])).fetchone()
            decisions.append({'table': 'resource_topics',
                'key': {'resource_id': rid, 'topic_id': None, 'curriculum_topic_id': item['topic']},
                'expected': ({'review_status': relation['review_status'], 'relevance_status': relation['relevance_status'],
                             'accessibility_status': relation['accessibility_status']} if relation else {'exists': False}),
                'changes': {'resource_id': rid, 'topic_id': None, 'curriculum_topic_id': item['topic'],
                    'review_status': 'published', 'relevance_status': 'relevant',
                    'accessibility_status': 'needs_improvement' if item['topic'] == 2511 else 'unknown',
                    'review_note': f"Itens aprovados para link externo: {chosen_questions} Limites: {item['limit']} Acessibilidade: {item['accessibility']}"},
                'reason': 'Vínculo editorial por conteúdo e itens explicitamente conferidos; não é tag oficial da Comvest.',
                'evidence': [{'locator': item['url'], 'detail': item['evidence']} ,
                    {'locator': f"sqlite://curriculum_topic_stages/{item['topic']}/{STAGE_ID}",
                     'detail': f"Programa oficial da fase-alvo; fonte {topic['source_document_id']}, página {topic['source_page']}."}]})
            if not db.execute('SELECT 1 FROM resource_targets WHERE resource_id=? AND stage_id=?', (rid, STAGE_ID)).fetchone():
                decisions.append({'table': 'resource_targets', 'key': {'resource_id': rid, 'stage_id': STAGE_ID},
                    'expected': {'exists': False}, 'changes': {'resource_id': rid, 'stage_id': STAGE_ID},
                    'reason': 'Limitar a disponibilidade do recurso à fase-alvo desta trilha.',
                    'evidence': [{'locator': f"sqlite://curriculum_topic_stages/{item['topic']}/{STAGE_ID}",
                                  'detail': 'Tópico pertence ao programa oficial da primeira fase Unicamp 2027.'}]})
    OUTPUT.write_text(json.dumps({'format':'editorial-review-decisions/v1',
        'summary':'Prática externa por seleção explícita de questões/respostas auditadas; direitos link-only e limitações preservados.',
        'decisions':decisions},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'output':str(OUTPUT),'resources':len(ITEMS),'decisions':len(decisions)}))


if __name__ == '__main__':
    main()
