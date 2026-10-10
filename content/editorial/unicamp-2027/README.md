# Lições preparatórias — Unicamp 2027, 1ª fase

`lessons.json` reúne 44 lições originais alinhadas aos 44 itens do currículo candidato de `curriculum_id = 10`. Cada lição tem uma explicação conceitual, erros comuns, um exemplo resolvido e uma síntese. O conteúdo foi normalizado para o contrato editorial versionado no próprio JSON, mantendo `review_status: "review"` em todas as lições.

## Proveniência e limites

- Os IDs de tópico curricular, relações canônicas e documento-fonte foram conferidos no banco local em modo somente leitura. Os tópicos canônicos usados estão publicados; o documento 148 é o Programa das Provas do Vestibular Unicamp 2027.
- O programa oficial foi usado para delimitar o escopo, não como texto para reprodução. As explicações e exemplos são redação didática original; não são transcrições de questões nem soluções oficiais. A situação de reutilização registrada para o documento-fonte é `unknown`, portanto esta referência não afirma licença aberta.
- São introduções concisas para estudo e revisão, não cursos completos. O tópico amplo de literatura, em particular, não substitui a leitura integral das obras da lista anual. Exemplos simplificam condições reais quando isso é declarado ou necessário ao modelo.
- As lições permanecem provisórias e precisam de revisão pedagógica e científica antes de publicação.

## Contrato

Raiz: `{ "version": 1, "lessons": [...] }`. Cada registro inclui `curriculum_topic_id`, `title`, `canonical_topic_ids`, `source_document_ids`, `estimated_minutes`, `review_status` e seções Markdown dos tipos `theory`, `example` e `summary`. Os papéis pedagógicos das seções são `formalization`, `example` e `review`; a camada de importação pode adaptá-los ao seu modelo.

O pacote de origem em `content/unicamp-2027/lessons.json` foi mantido intacto para o fluxo principal. Este diretório contém a cópia normalizada destinada à importação editorial.

## Aprofundamento e soluções candidatas

As lições dos tópicos curriculares 2476 (Funções e gráficos) e 2482 (Trigonometria) receberam aprofundamento de teoria, exemplos resolvidos, erros frequentes e autochecagem. O sidecar `reviewed-solutions.json` contém duas soluções de autoria editorial original, associadas às questões/ocorrências 332/332 e 338/338. A revisão independente aprovou ambas para permanência no sidecar; elas continuam marcadas `is_official: false`. A prova comentada oficial (fonte 4, questões 44 e 50) já contém soluções completas, portanto as explicações oficiais não devem ser substituídas nem copiadas para `questions.explanation`. As figuras da prova Q/X, os comentários oficiais e o gabarito (fonte 45, somente gabarito) foram conferidos visualmente; resultados: D para q332 e A para q338. O sidecar `tools/editorial/review-closure/solutions-review.json` registra essa decisão e propõe publicar somente o vínculo primário de Funções e gráficos da q332, atualmente em revisão; vínculos já publicados permanecem intactos.

O checklist em `content-qa-checklist.md` registra verificações locais. Nesta revisão, os PDFs oficiais da prova Q/X, da prova comentada e do gabarito foram renderizados e conferidos; os estados e explicações canônicas do SQLite foram lidos em modo somente leitura. Nenhuma escrita SQLite foi feita.
