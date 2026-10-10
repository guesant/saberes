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
- Após o lote, `integrity_check`, `foreign_key_check`, preservação de identidades e consistência de gabaritos foram verificados. O bundle local foi reconstruído e confere byte a byte com o SQLite; hashes e estado do release estão em `.local/content/guided-study-release.json`.
- Os testes editoriais direcionados e o build local passaram. A validação integrada de PDF offline passou novamente: o caderno oficial Q/T foi lido do cache, a rede foi desativada e a página solicitada renderizou no PDF.js.
- A validação integrada de PDF offline passou nesta rodada: em `pdfjs-real-offline.spec.ts`, o PDF oficial do simulado Q/T 2027 foi carregado, a rede foi cortada e a página 3 renderizou no PDF.js. O SHA do PDF bateu com o manifesto. A amostra verifica o fluxo real sem conferência visual página a página.
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
- Não resta fila de classificação ativa nesses representantes. As relações editoriais não são tags oficiais da Comvest. Só reabrir se aparecer nova evidência ou uma questão adequada para lacuna real de tópico.

### P1 — Materiais externos por tópico

- A vinculação de fontes e metadados de direitos foi feita em lote. A cobertura de links de aprendizagem e prática já está preenchida segundo o relatório atual; isso não equivale a aprovação pedagógica nem licença aberta.
- Não existe fila geral de fichas de recurso em estado `review` no SQLite. A fila remanescente é de exceções nas relações recurso–tópico, links inconclusivos e validação pedagógica não exaustiva — não de disponibilidade básica.
- Conferir poucas amostras por tipo e disciplina; não abrir individualmente todos os links novamente. Reabrir no navegador apenas exceções cuja resolução altere uso, treino ou afirmação de gratuidade. Recurso suplementar/ambíguo permanece visível como consulta, sem ser descrito como prática validada.
- Preservar URL, tipo, idioma, gratuidade observada, origem e direitos. Sem licença permissiva/autorização comprovada, usar apenas link e metadados; não copiar o conteúdo.

### P1 — Proveniência dos comentários de resolução: fechado para os representantes

- As resoluções oficiais encontradas nos representantes Q/Z 2025 e Q/X 2026 agora registram autoria institucional “Comvest / Unicamp”, sustentada pela fonte oficial. Nenhuma versão editorial inexistente foi inventada; a versão permanece ausente quando a fonte não a informa.
- Q/T continua corretamente identificado como conteúdo editorial próprio, não como resolução oficial. A ausência de resolução oficial do simulado permanece explícita.
- A divergência interna do PDF comentado de 2026, cuja introdução menciona 2025, permanece preservada no título e nas evidências; não foi corrigida silenciosamente.
- Reabrir somente se nova versão oficial, errata ou evidência de divergência for encontrada.

### P1 — Regulamentação vigente

- As regras estruturadas pertinentes ao estudo já foram incorporadas. Manter a divergência de calendário documentada: o calendário geral e o comunicado específico de liberação dos locais têm datas diferentes; prevalência e histórico não devem ser alterados sem fonte.
- A nota da regra de itens permitidos (registro 8) foi alinhada em 10/10/2026 ao estado `published`; o conteúdo da regra não foi alterado. Antes da prova, consultar a página oficial da Comvest uma vez e comparar documentos, datas e hashes. Se não houver documento novo, encerrar a rodada sem reabrir o manual inteiro. Atualizar somente o delta publicado.
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
- Pacotes anteriores `lesson-bulk-corrections-*` são supersedidos; não reaplicar. O lote vigente, seus pareceres e o journal de aplicação estão referenciados abaixo.
- Release e validação local: `docs/roteiro-unicamp-2027-implementacao.md` e `.local/content/content.sqlite`.
- Cobertura atual: `tools/editorial/review-closure/target-question-coverage.json` e `target-resource-coverage.json`.
- Aulas e decisões: `content/editorial/unicamp-2027/lesson-fast-corrections-humanities-2026-10-10.json`, `lesson-fast-corrections-sciences-2026-10-10.json`, os dois pareceres independentes correspondentes e `tools/editorial/review-closure/applied-fast-lesson-publication-2026-10-10.json`.
- Classificações da piscina representante: `tools/editorial/review-closure/active-question-classifications-fast-batch-2026-10-10.json` e `applied-active-question-classifications-fast-batch-2026-10-10.json`.
- Autoria das soluções oficiais: `tools/editorial/review-closure/official-solution-authorship-representatives-2025-2026.json` e `applied-official-solution-authorship-representatives-2025-2026.json`.
- Release local vigente: `unicamp-2027-practice-pool-v40`; validação de identidade, assets, gabaritos e bundle em `tools/editorial/review-closure/release-verification.json`.
- Proveniência de soluções: `tools/editorial/review-closure/solution-coverage-audit-2025-2026-2026-10-10.json` e `applied-solutions-provenance.json`.
- QA em lote de PDFs: `content/editorial/unicamp-2027/pdf-qa-v32-similarity-2026-10-10.jsonl` e `pdf-qa-issues-audit-2026-10-10.json`; usar como triagem, não como substituto de fonte.
- Renderização real sem rede: `packages/app/tests/e2e/pdfjs-real-offline.spec.ts`; verificação em 10/10/2026 contra o PDF Q/T oficial incluído no bundle.
- Nota regulatória reaplicável/auditável: `content/editorial/unicamp-2027/regulatory-materials-note-cleanup-2026-10-10.json` e `tools/editorial/review-closure/applied-regulatory-materials-note-cleanup-2026-10-10.json`.
