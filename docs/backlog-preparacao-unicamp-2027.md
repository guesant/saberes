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

- Banco principal: `.local/content/content.sqlite`, release local `unicamp-2027-practice-pool-v40`, schema 20. Esta rodada aplicou correções editoriais em lote, fechou classificações da piscina representante e registrou autoria institucional das resoluções oficiais sem inventar versão editorial.
- As microlições da trilha-alvo estão publicadas após correções versionadas e segunda revisão independente. O conteúdo continua identificado como editorial próprio, introdutório e parcial quando aplicável; não é material oficial da Comvest.
- As relações pendentes nos cadernos representantes Q/Z 2025, Q/X 2026 e Q/T do simulado preparatório foram adjudicadas em lote. Relações sustentadas estão publicadas como classificações editoriais; associações incorretas ou incidentais permanecem como rascunhos rejeitados com justificativa, fora do treino. Nenhuma é apresentada como tag oficial.
- Após o lote, `integrity_check`, `foreign_key_check`, preservação de identidades e consistência de gabaritos foram verificados. O bundle local confere byte a byte com o SQLite (`36ffa86b…`); o release e o build continuam em v40.
- As coberturas de questões e recursos foram recalculadas diretamente do SQLite e os dois relatórios agora carregam o hash vigente. Ambos mostram cobertura utilizável para os 44 tópicos, sem lacunas de aprendizagem, prática ou questão no recorte mínimo.
- O E2E integrado foi executado contra o PDF oficial `simulado_Q_T.pdf` do bundle: SHA-256 conferido com o manifesto enquanto online; depois rede desativada, app recarregado do cache e página 3 aberta no PDF.js. O teste agora também exige mais de 500 pixels não brancos no canvas, provando que houve conteúdo renderizado, não só um canvas com dimensões. Não houve conferência página a página.
- Em 10/10/2026, a página oficial da Comvest foi consultada novamente. Ela informa locais de prova liberados em 02/10, primeira fase em 18/10/2026, 72 questões e cinco horas; não foi identificado novo delta regulatório a importar nesta rodada. Fonte: https://www.comvest.unicamp.br/ingresso-2027/vestibular-2027/.
- A fila editorial ativa da primeira fase está fechada para o recorte mínimo: tópicos, aulas, classificações da piscina de treino, recursos por tópico, comentários de resolução dos representantes e regras regulatórias pertinentes estão publicados. Estados de `review`/`draft` em registros históricos ou associações rejeitadas com justificativa não são pendências abertas nem entram no treino.
- O caderno representante Q/Z de 2025 já está liberado para treino e tem ordem, alternativas, gabarito e resolução cadastrados. Os outros modelos de 2025 ficam preservados para consulta/histórico; a conciliação entre eles não é bloqueio para estudar.
- O fluxo usa um representante por prova: Q/Z 2025, Q/X 2026 e Q/T do simulado preparatório 2027. Questões e ocorrências permanecem separadas; o treino deduplica questões equivalentes.
- Os relatórios atuais mostram ao menos uma questão elegível e links de aprendizagem/prática para cada tópico do programa-alvo. Isso é cobertura mínima do índice, não prova de que todo subtópico tenha exercício específico, nem aprovação pedagógica integral, acessibilidade ou licença para redistribuição.
- As fichas de recursos estão visíveis e publicadas para consulta; disponibilidade e estado da ficha não certificam a qualidade de todo o conteúdo externo. Não reabrir todos os links: tratar somente exceções documentadas ou sinais novos, usando amostragem por tipo.
- O acervo visível pode conter material em revisão. “Visível para consulta”, “aprovado editorialmente” e “elegível para treino” são estados diferentes; não promovê-los em conjunto.

## Fila ativa

### P0 — Aulas da trilha: fechado para o acervo atual

- As correções de Humanidades e Ciências foram aplicadas a partir do conteúdo vigente no SQLite, receberam segunda revisão independente e foram publicadas com versões incrementadas. O caso `2506` também está atualizado; versões anteriores permanecem no journal e nos backups.
- Todas as etapas de aula da trilha têm estado publicado e estão disponíveis ao treino. O escopo introdutório e os assuntos que precisam de etapas posteriores estão declarados no próprio conteúdo; “publicado” não significa curso exaustivo do programa.
- Não reabrir estas aulas sem erro factual, nova fonte, mudança no programa ou evidência concreta de falha pedagógica.

### P0 — Classificações editoriais de questões: fechado para os representantes

- O lote `active-question-classifications-fast-batch-2026-10-10.json` foi aplicado com dry-run, precondições, backup e journal. As relações sustentadas foram publicadas; as incorretas/incidentes foram explicitamente mantidas como rascunho rejeitado, sem apagar histórico nem introduzi-las nos treinos.
- Q/Z 2025, Q/X 2026 e Q/T do simulado oficial preparatório 2027 seguem como representantes. A cobertura mínima continua completa e os treinos deduplicam pela identidade canônica; os outros cadernos permanecem exploráveis como ocorrências históricas.
- A auditoria do curso confirmou que nenhum exercício selecionado é bloqueado pelos filtros de classificação. Os rascunhos restantes nos representantes têm justificativa explícita de rejeição/redundância; são decisões encerradas preservadas para auditoria, não uma fila editorial aberta.
- Não resta fila de classificação ativa nesses representantes. As relações editoriais não são tags oficiais da Comvest. Só reabrir se aparecer nova evidência ou uma questão adequada para lacuna real de tópico.

### P1 — Materiais externos por tópico: fechado para prontidão da trilha

- Os 44 tópicos têm pelo menos um link aprovado para aprendizagem e um para prática no relatório recalculado; não há vínculos recurso–tópico ativos em `review`. Recursos classificados como referência/consulta não contam como prática.
- A auditoria pedagógica não afirma cobertura exaustiva de cada subtópico. Esse limite está explícito nos cards e relatórios e não bloqueia a trilha introdutória; lacunas novas comprovadas devem virar uma nova rodada, sem reabrir todos os links.
- Direitos `unknown` permanecem link-only: não copiar nem redistribuir sem licença/autorização comprovada. Acessibilidade dos recursos permanece fora do escopo atual.

### P1 — Proveniência dos comentários de resolução: fechado para os representantes

- As resoluções oficiais encontradas nos representantes Q/Z 2025 e Q/X 2026 agora registram autoria institucional “Comvest / Unicamp”, sustentada pela fonte oficial. Nenhuma versão editorial inexistente foi inventada; a versão permanece ausente quando a fonte não a informa.
- Q/T continua corretamente identificado como conteúdo editorial próprio, não como resolução oficial. A ausência de resolução oficial do simulado permanece explícita.
- A divergência interna do PDF comentado de 2026, cuja introdução menciona 2025, permanece preservada no título e nas evidências; não foi corrigida silenciosamente.
- Reabrir somente se nova versão oficial, errata ou evidência de divergência for encontrada.

### P1 — Regulamentação vigente: fechado para a primeira fase

- As regras pertinentes à primeira fase estão publicadas com fontes associadas. A conferência oficial de 10/10 confirmou a nota de locais liberados em 02/10, prova em 18/10, 72 questões e duração de cinco horas; não houve delta a importar. A divergência histórica do calendário permanece documentada, sem sobrescrever versões.
- O estado geral da edição permanece `review`, pois inclui a segunda fase, fora deste escopo. Isso não bloqueia o curso local nem as consultas da primeira fase. Não promover dados da segunda fase por consequência.
- Alocações de vagas/campus não são usadas pela trilha de estudo e permanecem fora do escopo editorial ativo; não apresentar números ambíguos como definitivos.

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
- Pacotes anteriores `lesson-bulk-corrections-*` são supersedidos; não reaplicar. O lote vigente, seus pareceres e o journal de aplicação estão referenciados abaixo.
- Release e validação local: `docs/roteiro-unicamp-2027-implementacao.md` e `.local/content/content.sqlite`.
- Cobertura atual: `tools/editorial/review-closure/target-question-coverage.json` e `target-resource-coverage.json`.
- Aulas e decisões: `content/editorial/unicamp-2027/lesson-fast-corrections-humanities-2026-10-10.json`, `lesson-fast-corrections-sciences-2026-10-10.json`, os dois pareceres independentes correspondentes e `tools/editorial/review-closure/applied-fast-lesson-publication-2026-10-10.json`.
- Classificações da piscina representante: `tools/editorial/review-closure/active-question-classifications-fast-batch-2026-10-10.json` e `applied-active-question-classifications-fast-batch-2026-10-10.json`.
- Autoria das soluções oficiais: `tools/editorial/review-closure/official-solution-authorship-representatives-2025-2026.json` e `applied-official-solution-authorship-representatives-2025-2026.json`.
- Release local vigente: `unicamp-2027-practice-pool-v40`; validação de identidade, assets, gabaritos e bundle em `tools/editorial/review-closure/release-verification.json`.
- Proveniência de soluções: `tools/editorial/review-closure/solution-coverage-audit-2025-2026-2026-10-10.json` e `applied-solutions-provenance.json`.
- QA em lote de PDFs: `content/editorial/unicamp-2027/pdf-qa-v32-similarity-2026-10-10.jsonl` e `pdf-qa-issues-audit-2026-10-10.json`; usar como triagem, não como substituto de fonte.
- Renderização real sem rede e verificação de pixels: `packages/app/tests/e2e/pdfjs-real-offline.spec.ts`; execução aprovada em 10/10/2026 contra o PDF Q/T oficial incluído no bundle.
- Nota regulatória reaplicável/auditável: `content/editorial/unicamp-2027/regulatory-materials-note-cleanup-2026-10-10.json` e `tools/editorial/review-closure/applied-regulatory-materials-note-cleanup-2026-10-10.json`.
