#!/usr/bin/env python3
"""Prepare additive, rights-aware resource decisions from individually audited links."""
import json
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[3]
DATABASE = ROOT / '.local/content/content.sqlite'
OUTPUT = Path(__file__).with_name('external-resource-batch-2026-10-10.json')
STAGE_ID = 11

# Each link was inspected on 2026-10-10. These are scoped supplements, not claims
# of exhaustive curriculum coverage. Page-specific exclusions are repeated in the
# visible resource notes so students do not rely on known-unreviewed items.
RESOURCES = [
    {'topic': 2468, 'title': 'Coesão e coerência — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/redacao/coesao-e-coerencia.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Explica coesão referencial e sequencial, coerência contextual, pronomes, elipse e conjunções, com exemplo e exercício.', 'limit': 'Suplemento: não cobre todos os gêneros, propósitos comunicativos ou usos multimodais.', 'accessibility': 'Texto e títulos visíveis; vídeo incorporado; teclado/leitor de tela não auditados.', 'evidence': 'A página apresenta explicações e exemplos de coesão e coerência pertinentes ao funcionamento textual.'},
    {'topic': 2469, 'title': 'Semântica — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/amp/portugues/semantica.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Apresenta sentido e contexto, conotação/denotação, ambiguidade e polissemia com exemplos.', 'limit': 'Introdução parcial; exercícios da página que dependem de tirinhas/imagens não são recomendados por este registro.', 'accessibility': 'Texto e seções visíveis; imagens e tecnologia assistiva não auditadas.', 'evidence': 'O artigo explica relações de sentido, contexto, ambiguidade e polissemia.'},
    {'topic': 2470, 'title': 'Variação linguística — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/index.php/o-que-e/portugues/o-que-e-variacao-linguistica.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Introduz variações geográficas, históricas, sociais e situacionais, além de preconceito linguístico.', 'limit': 'Complemento introdutório; não cobre toda a sociolinguística nem todas as situações de uso.', 'accessibility': 'Texto estruturado e opção de áudio observados; funcionamento assistivo não testado.', 'evidence': 'A página discute variação por região, idade, contexto social e situação comunicativa.'},
    {'topic': 2474, 'title': 'Linguagem literária — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/amp/literatura/linguagem-literaria.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Explica subjetividade, conotação e plurissignificação com exemplos de poema e romance.', 'limit': 'Introdução; não substitui leitura das obras exigidas nem cobre todos os períodos e gêneros.', 'accessibility': 'Texto e exemplos visíveis; descrições de imagens variam; leitor de tela não auditado.', 'evidence': 'A página apresenta características da linguagem literária e exemplos textuais.'},
    {'topic': 2475, 'title': 'Conjuntos numéricos — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/matematica/conjuntos-numericos.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Apresenta naturais, inteiros, racionais, irracionais e reais e suas relações.', 'limit': 'A página também aborda números complexos; para esta trilha, priorizar o escopo oficial de naturais, inteiros e reais.', 'accessibility': 'Texto, fórmulas e diagramas visíveis; leitura assistiva das expressões não auditada.', 'evidence': 'O artigo percorre os conjuntos numéricos e suas relações.'},
    {'topic': 2480, 'title': 'Área e perímetro — prática Khan Academy', 'url': 'https://pt.khanacademy.org/math/geometry/basic-geometry/perimeter_area_tutorial', 'provider': 'Khan Academy', 'kind': 'exercise', 'mode': 'practice', 'scope': 'Unidade com exercícios/testes de áreas e perímetros de polígonos, círculos e figuras compostas.', 'limit': 'Prática suplementar; cobre subtemas e não toda geometria plana.', 'accessibility': 'Página de atividades observada; teclado e leitor de tela dos exercícios não auditados.', 'evidence': 'A unidade lista exercícios de áreas e perímetros de figuras planas e testes por seção.'},
    {'topic': 2482, 'title': 'Triângulos retângulos e trigonometria — Khan Academy', 'url': 'https://pt.khanacademy.org/math/trigonometry/trigonometry-right-triangles', 'provider': 'Khan Academy', 'kind': 'exercise', 'mode': 'practice', 'scope': 'Exercícios e testes sobre seno, cosseno, tangente, lados e ângulos em triângulos retângulos.', 'limit': 'Não cobre sozinho ciclo trigonométrico, gráficos e todo o programa.', 'accessibility': 'Atividades interativas identificadas; teclado/leitor de tela não testados.', 'evidence': 'A unidade lista exercícios e testes de razões trigonométricas e resolução de triângulos.'},
    {'topic': 2483, 'title': 'Fórmula da distância — Khan Academy', 'url': 'https://pt.khanacademy.org/math/geometry-home/analytic-geometry-topic/distance-and-midpoints/a/distance-formula', 'provider': 'Khan Academy', 'kind': 'article', 'mode': 'learning', 'scope': 'Deriva e aplica a distância entre pontos no plano cartesiano, com exemplo resolvido.', 'limit': 'Cobre uma habilidade de geometria analítica, não retas, circunferências e o tópico completo.', 'accessibility': 'Texto e fórmula visíveis; expressões e ilustrações não testadas com leitor de tela.', 'evidence': 'A página deriva e exemplifica a fórmula da distância entre dois pontos.'},
    {'topic': 2483, 'title': 'Distância entre ponto e reta — prática Khan Academy', 'url': 'https://pt.khanacademy.org/math/geometry-home/analytic-geometry-topic/distance-between-a-point-and-a-line/e/distance_between_point_and_line', 'provider': 'Khan Academy', 'kind': 'exercise', 'mode': 'practice', 'scope': 'Exercício direto de distância entre ponto e reta, com resposta verificável.', 'limit': 'Atividade curta de uma habilidade; não representa banco amplo de geometria analítica.', 'accessibility': 'Interação e tecnologia assistiva não foram testadas.', 'evidence': 'A página apresenta exercício específico e resposta sobre distância entre ponto e reta.'},
    {'topic': 2495, 'title': 'How to be a critical reader — OpenLearn', 'url': 'https://www.open.edu/openlearn/languages/english-language/how-be-critical-reader/content-section-0?active-tab=content-tab', 'provider': 'OpenLearn / The Open University', 'kind': 'course', 'mode': 'learning', 'scope': 'Curso gratuito sobre propósito, opinião, estrutura argumentativa, fatos/opiniões, ressalvas e evidências em textos em inglês.', 'limit': 'Pode ser mais avançado que a prova; atividades e quizzes completos podem exigir cadastro.', 'accessibility': 'Títulos, navegação e links de seção observados; hub de acessibilidade não equivale a auditoria formal.', 'evidence': 'O conteúdo aborda estratégias de leitura crítica em língua inglesa e análise de argumentos.'},
    {'topic': 2487, 'title': 'Geografia física — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/amp/geografia/geografia-fisica.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Visão geral de litosfera, atmosfera, hidrosfera e biosfera, com exemplos de relevo, solo, água, clima e biodiversidade.', 'limit': 'Panorâmico; não substitui aprofundamento das relações sociedade-natureza e dos componentes físico-naturais.', 'accessibility': 'Texto e títulos visíveis; descrições de imagens e leitor de tela não auditados.', 'evidence': 'O artigo descreve os componentes da geografia física e exemplos correspondentes.'},
    {'topic': 2487, 'title': 'Hidrografia, clima e relevo — prática, questões 1–3', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-geografia/exercicios-sobre-hidrografia-clima-relevo.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'mode': 'practice', 'scope': 'Prática suplementar: questões textuais 1–3, com respostas e justificativas conferidas.', 'limit': 'Usar somente questões 1–3; excluir a questão 4, que depende de figura não auditada. Cobertura parcial do tópico.', 'accessibility': 'A questão visual excluída não tem alternativa textual confirmada; acessibilidade integral não auditada.', 'evidence': 'Respostas e justificativas das questões textuais 1–3 conferidas; a questão 4 depende de figura e deve ser omitida.'},
    {'topic': 2490, 'title': 'Grécia Antiga — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/historiag/grecia-antiga.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Introduz periodização, organização política/social e cultura da Grécia Antiga.', 'limit': 'Cobre a Grécia, não Roma nem sociedades medievais; usar como parte de uma sequência de fontes.', 'accessibility': 'Texto e seções visíveis; imagens não auditadas com tecnologia assistiva.', 'evidence': 'A página trata diretamente de Grécia Antiga, conteúdo incluído no tópico anual.'},
    {'topic': 2490, 'title': 'Roma Antiga — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/historiag/roma-antiga.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Apresenta organização política, social e cultural de Roma Antiga.', 'limit': 'Cobre Roma, não Grécia nem sociedades medievais; suplemento parcial.', 'accessibility': 'Texto e seções visíveis; imagens não auditadas com tecnologia assistiva.', 'evidence': 'A página trata diretamente de Roma Antiga, conteúdo incluído no tópico anual.'},
    {'topic': 2490, 'title': 'Idade Média — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/historiag/idade-media.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Introduz periodização, organização política/social e acontecimentos da Idade Média.', 'limit': 'Recorte majoritariamente europeu; deve ser combinado com outras perspectivas e fontes.', 'accessibility': 'Texto, imagens e player de vídeo presentes; legendas e uso assistivo não auditados.', 'evidence': 'A página trata diretamente da Idade Média, conteúdo incluído no tópico anual.'},
    {'topic': 2500, 'title': 'Vida e evolução: seres vivos na natureza — Khan Academy', 'url': 'https://pt.khanacademy.org/science/7-ano/seres-vivos-na-natureza', 'provider': 'Khan Academy', 'kind': 'course', 'mode': 'learning', 'scope': 'Unidade introdutória sobre biodiversidade, desequilíbrios ambientais e saúde ambiental/humana.', 'limit': 'Material de nível introdutório; não aprofunda saúde humana, conservação e todas as relações ecológicas no nível vestibular.', 'accessibility': 'Texto e lista de lições observados; transcrições disponíveis em itens consultados, unidade inteira não auditada.', 'evidence': 'A unidade lista conteúdos de biodiversidade e menciona saúde ambiental e humana.'},
    {'topic': 2501, 'title': 'Física do Ensino Médio — Khan Academy', 'url': 'https://pt.khanacademy.org/science/fisica-ensino-medio', 'provider': 'Khan Academy', 'kind': 'course', 'mode': 'learning', 'scope': 'Trilha em português de Física do Ensino Médio, útil como ponto de entrada para mecânica e fundamentos.', 'limit': 'A trilha é ampla; selecionar as unidades de grandezas, cinemática, dinâmica e energia pertinentes ao programa.', 'accessibility': 'Estrutura e unidades observadas; vídeos, fórmulas e interação assistiva não auditados em toda a trilha.', 'evidence': 'A página identifica uma trilha de Física do Ensino Médio em português.'},
    {'topic': 2501, 'title': 'Primeira lei de Newton — prática Khan Academy', 'url': 'https://pt.khanacademy.org/science/fisica-ensino-medio/x6443ccf4d35f6b36%3Aforcas-e-leis-de-newton/x6443ccf4d35f6b36%3A1-lei-de-newton/e/newtons-first-law-exercises-ap1', 'provider': 'Khan Academy', 'kind': 'exercise', 'mode': 'practice', 'scope': 'Prática pontual de força resultante e primeira lei de Newton; o item do carro parado tem resposta coerente.', 'limit': 'Cobre uma habilidade, não toda a mecânica. No item auditado, força resultante zero não significa ausência de forças.', 'accessibility': 'Página depende de JavaScript; acessibilidade/interação completa não auditadas.', 'evidence': 'No item do carro parado, a alternativa coerente é força resultante nula; forças individuais podem existir e se equilibrar.'},
    {'topic': 2502, 'title': 'Astronomia — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/geografia/astronomia.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Introduz a astronomia, sua história e modelos do Sistema Solar.', 'limit': 'Texto introdutório e descritivo; não cobre astronomia física nem cálculos do programa.', 'accessibility': 'Texto e títulos visíveis; imagens/diagramas e descrições alternativas não auditadas.', 'evidence': 'O artigo apresenta astronomia e modelos do Sistema Solar.'},
    {'topic': 2502, 'title': 'Sistema Solar — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/geografia/sistema-solar.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Apresenta planetas e outros corpos do Sistema Solar.', 'limit': 'Complemento descritivo; não cobre órbitas, evolução estelar e todo o programa.', 'accessibility': 'Imagens e diagramas presentes; descrições alternativas não auditadas.', 'evidence': 'A página descreve planetas e corpos celestes do Sistema Solar.'},
    {'topic': 2502, 'title': 'Lixo espacial — prática, questões 1–2', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-fisica/exercicios-sobre-lixo-espacial.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'mode': 'practice', 'scope': 'Prática parcial: questões textuais 1–2 sobre geocentrismo e leis de Kepler; respostas D e B conferidas.', 'limit': 'Usar somente questões 1–2; itens posteriores usam figuras e não foram incluídos. Recorte histórico/mecânico, não astronomia completa.', 'accessibility': 'Questões posteriores dependem de figuras; acessibilidade integral não auditada.', 'evidence': 'Respostas das questões textuais 1 e 2 foram verificadas como D e B, respectivamente.'},
    {'topic': 2503, 'title': 'Calorimetria — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/fisica/calorimetria-i.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Explica calor sensível/latente, trocas de calor e curvas de aquecimento.', 'limit': 'Complementar; não cobre sozinha toda a termodinâmica e os gases.', 'accessibility': 'A página contém fórmulas e gráficos; transcrição semântica e leitura assistiva não auditadas.', 'evidence': 'A página apresenta trocas de calor, calor sensível/latente e curvas de aquecimento.'},
    {'topic': 2503, 'title': 'Termodinâmica — Brasil Escola', 'url': 'https://brasilescola.uol.com.br/fisica/termodinamica.htm', 'provider': 'Brasil Escola', 'kind': 'article', 'mode': 'learning', 'scope': 'Leitura complementar de termodinâmica para equilibrar a introdução de calorimetria.', 'limit': 'Selecionar conteúdos compatíveis com o Ensino Médio e o programa oficial.', 'accessibility': 'Fórmulas e imagens podem exigir alternativa textual; tecnologia assistiva não auditada.', 'evidence': 'A página trata dos conceitos de termodinâmica previstos no tópico anual.'},
    {'topic': 2503, 'title': 'Calorimetria — prática, questões 1–2 e 4–12', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-fisica/exercicios-sobre-calorimetria.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'mode': 'practice', 'scope': 'Prática parcial: cálculos e unidades das questões textuais 1–2 e 4–12 foram conferidos.', 'limit': 'Excluir questão 3, dependente de figura. Complementa calorimetria, não todo o tópico de termodinâmica.', 'accessibility': 'Questão 3 visual excluída; acessibilidade integral da página não auditada.', 'evidence': 'Aritmética e unidades das questões 1–2 e 4–12 conferidas; a questão 3 depende de figura e deve ser omitida.'},
    {'topic': 2506, 'title': 'Estados da matéria — Khan Academy', 'url': 'https://pt.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces/states-of-matter', 'provider': 'Khan Academy', 'kind': 'course', 'mode': 'learning', 'scope': 'Unidade sobre estados, mudanças de fase, gases e modelos particulados.', 'limit': 'Recurso introdutório e parcial; a prática listada na unidade não foi validada questão a questão.', 'accessibility': 'A unidade contém recursos interativos; teclado e leitor de tela não auditados.', 'evidence': 'A unidade lista estados da matéria, transições de fase, gases e modelos de partículas.'},
    {'topic': 2510, 'title': 'Pilhas e baterias — prática, questão 1', 'url': 'https://exercicios.brasilescola.uol.com.br/exercicios-quimica/exercicios-sobre-pilhas-baterias.htm', 'provider': 'Brasil Escola', 'kind': 'exercise', 'mode': 'practice', 'scope': 'Prática parcial de eletroquímica: questão 1, sobre oxidação da prata e cálculo de potencial, conferida.', 'limit': 'Usar apenas a questão 1; as demais não foram revisadas. Não cobre compostos orgânicos.', 'accessibility': 'Outros itens podem depender de tabelas/figuras; acessibilidade integral não auditada.', 'evidence': 'Na questão 1, a prata se oxida e o cálculo de potencial informado é coerente; não se endossa a lista completa.'},
    {'topic': 2511, 'title': 'Análise de gráficos — vídeo Khan Academy', 'url': 'https://pt.khanacademy.org/math/pt-9-ano/probabilidade-e-estistica-9ano/graficos-e-tabelas-9ano/v/analise-de-graficos', 'provider': 'Khan Academy', 'kind': 'video', 'mode': 'learning', 'scope': 'Vídeo em português sobre escalas, legendas e leitura de gráficos; transcrição disponível.', 'limit': 'Introdução; não cobre elaboração de todos os tipos de tabela/gráfico e contextos interdisciplinares.', 'accessibility': 'Transcrição observada; controles, teclado e leitor de tela não auditados formalmente.', 'evidence': 'O vídeo e sua transcrição discutem escala, legenda e leitura de gráficos.'},
]


def main():
    db = sqlite3.connect(f'file:{DATABASE}?mode=ro', uri=True)
    db.row_factory = sqlite3.Row
    resource_id = db.execute('SELECT COALESCE(MAX(id), 0) + 1 FROM resources').fetchone()[0]
    source_id = db.execute('SELECT COALESCE(MAX(id), 0) + 1 FROM source_documents').fetchone()[0]
    decisions = []
    seen = set()
    for item in RESOURCES:
        if item['url'] in seen:
            raise ValueError(f'Duplicate URL in batch: {item["url"]}')
        seen.add(item['url'])
        existing_resource = db.execute('SELECT * FROM resources WHERE url=?', (item['url'],)).fetchone()
        if existing_resource and item['url'] != 'https://pt.khanacademy.org/math/pt-9-ano/probabilidade-e-estistica-9ano/graficos-e-tabelas-9ano/v/analise-de-graficos':
            raise ValueError(f'Resource URL already exists; reconcile instead of duplicating: {item["url"]}')
        topic = db.execute('''SELECT cts.source_document_id,cts.source_page,cts.source_excerpt
            FROM curriculum_topic_stages cts WHERE cts.curriculum_topic_id=? AND cts.stage_id=?
              AND cts.review_status='published' ''', (item['topic'], STAGE_ID)).fetchone()
        if not topic:
            raise ValueError(f'Target topic lacks a published first-phase source: {item["topic"]}')
        source = db.execute('SELECT id FROM source_documents WHERE url=?', (item['url'],)).fetchone()
        current_source_id = source['id'] if source else source_id
        if not source:
            source_title = item['title']
            decisions.append({
                'table': 'source_documents', 'key': {'id': current_source_id}, 'expected': {'exists': False},
                'changes': {'id': current_source_id, 'title': source_title, 'url': item['url'],
                            'provider': item['provider'], 'kind': item['kind'], 'is_official': 0,
                            'reuse_status': 'link_only', 'license_name': None, 'license_url': None,
                            'attribution': item['provider'],
                            'rights_note': 'Acesso gratuito observado nesta verificação; licença de reprodução/adaptação não confirmada. Manter somente link e metadados; não copiar conteúdo.'},
                'reason': 'Registrar a origem externa e a condição de reutilização como link-only, sem presumir licença.',
                'evidence': [{'locator': item['url'], 'detail': f"Página direta consultada em 10/10/2026. {item['evidence']}"}],
            })
            source_id += 1
        resource_id_current = existing_resource['id'] if existing_resource else resource_id
        resource_note = (f"{item['scope']} {item['limit']} Acesso público gratuito observado em 10/10/2026; conteúdo externo pode mudar. "
                         f"{item['accessibility']} Licença de cópia/adaptação não confirmada: somente link e metadados.")
        if existing_resource:
            expected = {name: existing_resource[name] for name in ('title', 'kind', 'source_document_id', 'editorial_status', 'availability_mode')}
            changes = {'title': item['title'], 'kind': item['kind'], 'description': item['scope'],
                       'source_document_id': current_source_id, 'editorial_status': 'published',
                       'editorial_note': resource_note, 'availability_mode': item['mode']}
            reason = 'Revalidar a ficha existente: a consulta atual confirmou vídeo e transcrição, superando a antiga observação de página não inspecionável; preservar identidade e vincular fonte e tópico anual.'
            evidence = [{'locator': item['url'], 'detail': f"Nova consulta direta em 10/10/2026: {item['evidence']}"}]
        else:
            expected = {'exists': False}
            changes = {'id': resource_id_current, 'title': item['title'], 'url': item['url'],
                       'provider': item['provider'], 'kind': item['kind'], 'description': item['scope'],
                       'is_free': 1, 'is_published': 1, 'source_document_id': current_source_id,
                       'editorial_status': 'published', 'editorial_note': resource_note,
                       'availability_mode': item['mode']}
            reason = f"Suplemento direto e gratuito para o tópico oficial {item['topic']}; escopo parcial e limitações explícitos no cartão."
            evidence = [{'locator': item['url'], 'detail': f"Consulta direta em 10/10/2026: {item['evidence']}"}]
        evidence.append({'locator': f"sqlite://curriculum_topic_stages/{item['topic']}/{STAGE_ID}",
                         'detail': f"Programa oficial Unicamp 2027, primeira fase, documento {topic['source_document_id']}, página {topic['source_page']}: {topic['source_excerpt']}"})
        decisions.append({'table': 'resources', 'key': {'id': resource_id_current}, 'expected': expected,
                          'changes': changes, 'reason': reason, 'evidence': evidence})
        relation_accessibility = 'needs_improvement' if 'exclu' in item['limit'].lower() or 'figura' in item['limit'].lower() else 'unknown'
        relation_key = {'resource_id': resource_id_current, 'topic_id': None, 'curriculum_topic_id': item['topic']}
        existing_relation = db.execute('''SELECT * FROM resource_topics WHERE resource_id=?
            AND topic_id IS NULL AND curriculum_topic_id=?''', (resource_id_current, item['topic'])).fetchone()
        decisions.append({
            'table': 'resource_topics',
            'key': relation_key,
            'expected': ({'review_status': existing_relation['review_status'],
                          'relevance_status': existing_relation['relevance_status'],
                          'accessibility_status': existing_relation['accessibility_status']}
                         if existing_relation else {'exists': False}),
            'changes': {'resource_id': resource_id_current, 'topic_id': None, 'curriculum_topic_id': item['topic'],
                        'review_status': 'published', 'relevance_status': 'relevant',
                        'accessibility_status': relation_accessibility,
                        'review_note': f"Relação editorial suplementar; escopo limitado: {item['scope']} {item['limit']} Acessibilidade: {item['accessibility']}"},
            'reason': 'A página direta foi associada ao tópico anual por correspondência de conteúdo; não representa cobertura exaustiva nem tag oficial da Comvest.',
            'evidence': [
                {'locator': item['url'], 'detail': f"Conteúdo observado: {item['evidence']}"},
                {'locator': f"sqlite://curriculum_topic_stages/{item['topic']}/{STAGE_ID}",
                 'detail': f"Programa oficial da primeira fase de 2027, fonte {topic['source_document_id']}, página {topic['source_page']}."},
            ],
        })
        if not db.execute('SELECT 1 FROM resource_targets WHERE resource_id=? AND stage_id=?',
                          (resource_id_current, STAGE_ID)).fetchone():
            decisions.append({
                'table': 'resource_targets',
                'key': {'resource_id': resource_id_current, 'stage_id': STAGE_ID},
                'expected': {'exists': False},
                'changes': {'resource_id': resource_id_current, 'stage_id': STAGE_ID},
                'reason': 'Disponibilizar o recurso suplementar no escopo da primeira fase de 2027, sem declará-lo aplicável a outras edições/fases.',
                'evidence': [{'locator': f"sqlite://curriculum_topic_stages/{item['topic']}/{STAGE_ID}",
                              'detail': f"O vínculo editorial aponta para tópico do programa oficial Unicamp 2027, primeira fase; documento {topic['source_document_id']}, página {topic['source_page']}."}],
            })
        if not existing_resource:
            resource_id += 1
    db.close()
    OUTPUT.write_text(json.dumps({'format': 'editorial-review-decisions/v1',
                                  'summary': 'Links externos gratuitos revisados como suplementos; todos mantêm direitos link-only e limitações no próprio registro.',
                                  'decisions': decisions}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'output': str(OUTPUT), 'resources': len(RESOURCES), 'decisions': len(decisions)}))


if __name__ == '__main__':
    main()
