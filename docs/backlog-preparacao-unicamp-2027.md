# Backlog editorial — Unicamp 2027, 1ª fase

**Atualizado em:** 10/10/2026

**Fonte de verdade:** este é o único backlog operacional. O SQLite principal é a fonte de dados; os demais JSON/JSONL são manifestos, evidências ou relatórios — não backlogs paralelos.

**Escopo:** preparar para estudo local e offline; commits e push incrementais estão autorizados, sem deploy público. Acessibilidade/descrições de imagens estão fora do escopo ativo por decisão do usuário.

## Como executar com rapidez sem perder precisão

- Processar em lotes por tipo de conteúdo e disciplina. Não fazer revisão manual registro a registro nem renderizar/conferir cada página.
- Calibrar o fluxo com poucas amostras representativas de cada classe de risco. Rodar verificações automatizadas no lote inteiro; direcionar revisão humana apenas a divergências, alertas de baixa confiança e amostras que revelem falha sistemática.
- Não preencher ausência com invenção. Vazamento contextual de uma associação pode ficar como candidata editorial com ressalva, mas não como relação aprovada para treino sem sustentação mínima.
- Fazer dry-run, backup, aplicação transacional, journal com antes/depois e validação automática. Não reabrir lote concluído sem evidência nova.
- Figuras continuam sendo abertas na página correspondente do PDF com PDF.js; não recortar, duplicar ou conferir visualmente página a página.

## Baseline vigente

- Banco principal: `.local/content/content.sqlite`, release local `unicamp-2027-practice-pool-v38`, schema 20. O lote recente ampliou a prática com questões representativas aprovadas, manteve os exercícios já existentes em primeiro lugar e preservou as etapas editoriais.
- Após o lote, `integrity_check`, `foreign_key_check`, as primeiras etapas de prática preservadas e a ausência de equivalentes duplicados dentro dos módulos foram verificados. O bundle local foi reconstruído e confere byte a byte com o SQLite; o hash e o estado do release estão em `.local/content/guided-study-release.json`.
- A suíte unitária, o typecheck e o build local passaram após as mudanças.
- Os testes isolados de retomada/pontuação de simulado e de pré-download/renderização de PDFs offline passaram em rodada anterior; só repetir se o código desses fluxos mudar.
- O caderno representante Q/Z de 2025 já está liberado para treino e tem ordem, alternativas, gabarito e resolução cadastrados. Os outros modelos de 2025 ficam preservados para consulta/histórico; a conciliação entre eles não é bloqueio para estudar.
- O fluxo usa um representante por prova: Q/Z 2025, Q/X 2026 e Q/T do simulado preparatório 2027. Questões e ocorrências permanecem separadas; o treino deduplica questões equivalentes.
- Os relatórios atuais não indicam lacuna mínima de questão aprovada nem de link de aprendizagem/prática nos tópicos do programa-alvo. Isso não comprova profundidade por subtópico, qualidade pedagógica integral, acessibilidade ou licença para redistribuição.
- O acervo visível pode conter material em revisão. “Visível para consulta”, “aprovado editorialmente” e “elegível para treino” são estados diferentes; não promovê-los em conjunto.

## Fila ativa

### P0 — Aulas da trilha

- Reconciliar, por lote, as versões e pareceres de aulas ainda em `review`: tópicos curriculares `2472`, `2474`, `2475`, `2476`, `2481`, `2487`, `2501`, `2504`, `2506`, `2507` e `2510`. Usar o conteúdo atual do SQLite e pareceres compatíveis com a versão exata; descartar propostas obsoletas.
- As propostas de correção em lote de Humanidades e Ciências foram preparadas, mas não aplicadas nem aprovadas. Antes de incorporá-las, conferir se ainda correspondem à versão atual e manter em revisão tudo que não tiver parecer compatível.
- Aplicar primeiro correções de conteúdo com critérios já descritos nos pareceres: delimitar escopo parcial, completar exemplos ou definições solicitados e alinhar a versão importada à versão revisada. Fazer uma amostra por pacote/disciplina; executar validações estruturais e de fonte em todas as aulas.
- O caso `2506` continua em revisão porque o parecer cita material da proposta 1.3.2, enquanto o SQLite tinha conteúdo 1.3.1. A proposta corrigida já está disponível; integrar a versão exata e registrar novo parecer contra ela antes de publicar.
- Para Ciências, os holds documentados de `2501`, `2504`, `2507` e `2510` não devem ser promovidos sem incorporar os reparos indicados. Para Humanidades/Português, o parecer independente anterior não recebeu a proposta v2 esperada; não reutilizar aprovação inexistente.
- Critério de fechamento: versão no SQLite igual à revisada, fonte do programa vinculada, três etapas da microaula coerentes e estado publicado só após validação do pacote. Aulas em revisão continuam consultáveis, fora do treino.

### P0 — Classificações editoriais de questões

- Usar `tools/editorial/review-closure/target-question-coverage.json` e os manifestos rebaseados como fila filtrada da trilha, não inventários históricos globais. A cobertura mínima já existe; o lote serve para resolver relações específicas úteis, não para forçar mais tags.
- Aplicar em lote somente candidatos cuja chave ainda corresponda ao SQLite e cuja fonte/evidência sustente a associação. Classificações secundárias podem ser amplas, mas devem explicar pertinência; contexto incidental não basta. Relações editoriais nunca são apresentadas como tags oficiais da Comvest.
- Manter pendentes as relações conflitantes ou de baixa confiança, inclusive associações contextuais documentadas para QZ 2025/QT 2027. Não reaplicar `active-question-classification-apply-ready-2026-10-10.json` nem repetir a propagação de equivalências de 2026 já aplicada.
- Critério de fechamento de cada lote: dry-run sem chaves obsoletas, amostras por tipo de associação, justificativa/fonte por relação aplicada e relatório de cobertura atualizado.

### P1 — Materiais externos por tópico

- A vinculação de fontes e metadados de direitos foi feita em lote. A cobertura de links de aprendizagem e prática já está preenchida segundo o relatório atual; isso não equivale a aprovação pedagógica nem licença aberta.
- Agrupar os recursos ainda em revisão por motivo já registrado (por exemplo, questão/atividade ambígua, escopo parcial, bloqueio de navegador ou informação de direitos incompleta). Auditar causas e corrigir em lote com evidência existente; reabrir navegador apenas para exceções cujo resultado possa mudar o uso no estudo.
- Conferir poucas amostras por tipo e disciplina. Não abrir individualmente todos os links novamente. Se um recurso não sustentar uso didático, mantê-lo visível como consulta/revisão ou registrar a lacuna — não rotulá-lo como prática validada.
- Preservar URL, tipo, idioma, gratuidade observada, origem e direitos. Sem licença permissiva/autorização comprovada, usar apenas link e metadados; não copiar o conteúdo.

### P1 — Proveniência dos comentários de resolução

- Os representantes Q/Z 2025, Q/X 2026 e Q/T 2027 já têm resoluções cadastradas. Q/T é conteúdo editorial próprio; não chamá-lo de resolução oficial. As fontes de comentários oficiais de Q/Z e Q/X estão vinculadas, mas autoria/versão e fidelidade integral ainda não estão uniformemente documentadas.
- Tratar em lote os grupos pela fonte: comentários institucionais da Comvest, sínteses editoriais e gabaritos sem comentário são categorias distintas. Atribuir autoria institucional somente quando o próprio documento sustentar; não inferir autor individual.
- Preservar a divergência interna do PDF comentado de 2026, cuja introdução menciona 2025. Não substituir texto nem mudar a edição silenciosamente. Para o simulado, manter explícito que não foi localizada resolução oficial; conservar as resoluções editoriais com autoria, versão e status.
- Validação humana limitada a amostras por fonte e tipo de solução. Casos com divergência, figura essencial, cálculo inconsistente ou proveniência incompatível vão para exceções direcionadas; não revisar cada resolução manualmente como pré-condição do estudo.

### P1 — Regulamentação vigente

- As regras estruturadas pertinentes ao estudo já foram incorporadas. Manter a divergência de calendário documentada: o calendário geral e o comunicado específico de liberação dos locais têm datas diferentes; prevalência e histórico não devem ser alterados sem fonte.
- Antes da prova, consultar a página oficial da Comvest uma vez e comparar documentos, datas e hashes. Se não houver documento novo, encerrar a rodada sem reabrir o manual inteiro. Atualizar somente o delta publicado.
- Alocações de vagas/campus, que permanecem em revisão, não bloqueiam a trilha da primeira fase; não exibir valores ambíguos como definitivos.

### Fechamento local após cada lote

Executar uma única rodada de validação depois do lote: cobertura de questões e recursos, validação editorial aplicável, `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, testes direcionados, typecheck/build se houve alteração de código, hashes de assets e igualdade entre `.local/content/content.sqlite` e `dist/data/content.sqlite`. Gerar novo release, manifesto e relatório somente depois de aprovação do lote. Não repetir testes sem mudança relevante.

## Fora da fila ativa / manter explícito

- **Acessibilidade e descrições de imagens:** fora do escopo solicitado agora; continuam como necessidade futura, não como bloqueio de treino.
- **Modelos alternativos dos cadernos:** preservar IDs e ocorrências para consulta; não conciliar nem promover por diferença apenas de ordem quando o representante já atende ao treino.
- **Acervo anterior ao recorte 2025–2027 e consolidação física de identidades canônicas:** legado preservado. Só retomar se houver necessidade funcional demonstrada; não arquivar nem apagar registros para reduzir backlog.
- **Publicação externa:** não autorizada neste fluxo; a entrega é local.
- **Prova real de 2027:** incorporar caderno, figuras por página, gabarito definitivo, anulações e comentários quando a Comvest os publicar.

## Comandos de conferência em lote

```bash
python3 tools/editorial/review-closure/question_coverage.py
python3 tools/editorial/review-closure/resource_coverage.py
```

Integridade e release podem ser conferidos em SQLite somente leitura; executar junto com os checks de igualdade/build apenas no fechamento do lote, não item a item. Relatórios de cobertura devem carregar o hash do mesmo SQLite vigente.

## Evidências vigentes

- Reconciliação do backlog antes do lote de prática: `content/editorial/unicamp-2027/backlog-reconciliation-2026-10-10.json`; a aplicação está registrada em `content/editorial/unicamp-2027/practice-pool-application-2026-10-10.json`.
- Propostas não aplicadas para revisão de aulas: `content/editorial/unicamp-2027/lesson-bulk-corrections-humanities-2026-10-10.json` e `lesson-bulk-corrections-sciences-2026-10-10.json`.
- Release e validação local: `docs/roteiro-unicamp-2027-implementacao.md` e `.local/content/content.sqlite`.
- Cobertura atual: `tools/editorial/review-closure/target-question-coverage.json` e `target-resource-coverage.json`.
- Aulas e decisões: `content/editorial/unicamp-2027/lesson-batch-humanities-2026-10-10.json`, `lesson-batch-sciences-2026-10-10.json` e pareceres independentes por tópico.
- Proveniência de soluções: `tools/editorial/review-closure/solution-coverage-audit-2025-2026-2026-10-10.json` e `applied-solutions-provenance.json`.
- QA em lote de PDFs: `content/editorial/unicamp-2027/pdf-qa-v32-similarity-2026-10-10.jsonl` e `pdf-qa-issues-audit-2026-10-10.json`; usar como triagem, não como substituto de fonte.
