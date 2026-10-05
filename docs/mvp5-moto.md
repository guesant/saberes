# MVP5 — Moto

## M5-DOM-001 — decisões locais que exigem cálculo

O Moto começa pelas decisões que já possuem fatos no dispositivo e que podem ser explicadas sem rede, automação externa ou inferência opaca. O cálculo não substitui o registro original: ele produz uma projeção identificada pela fonte, pela regra e pelo momento em que foi calculada.

| Decisão local                       | Fatos de entrada                                                                  | Saída observável                                                        | Fonte proprietária                                          |
| ----------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| saber a situação de uma disciplina  | aulas previstas, aulas frequentadas, notas, máximos, pesos e limite de frequência | frequência, média atual, risco de frequência e nota necessária          | `AcademicDiscipline` e `AcademicMetrics`                    |
| decidir o próximo passo de um plano | etapas existentes, ordem atual, etapa concluída e movimento solicitado            | nova ordem explícita, sem apagar a ordem anterior durante a confirmação | `StudyPlan` e estado local do plano                         |
| decidir o que revisar               | `ReviewTarget`, vencimento, estado de memória, retenção escolhida e data local    | fila, carga estimada e prévias do scheduler                             | `ReviewTarget` e scheduler FSRS                             |
| entender a evidência de desempenho  | tentativas, acertos, dificuldade, diagnóstico e recência                          | resumo, faixa de confiança, tópicos com evidência e ação pedagógica     | `StudyRecord`, `AttemptDiagnosis` e projeções de desempenho |

### Invariantes

1. Toda saída calculada identifica ou permite recuperar os fatos que a produziram.
2. Nota, frequência, progresso, domínio e revisão continuam conceitos distintos.
3. Uma hipótese editada não altera a entidade acadêmica, o plano, a tentativa ou o agendamento original.
4. Arredondamento, limites e pesos são parte da regra visível; não existem ajustes silenciosos.
5. Uma entrada ausente produz estado incompleto ou indisponível, nunca um número inventado.
6. O cálculo permanece local e determinístico para a mesma entrada, regra e data de referência.
7. Reordenar um plano é uma intenção reversível; a Pessoa pode cancelar antes de salvar.
8. A recomendação de revisão é uma sugestão explicável e não uma obrigação.

### Limites deste corte

Este slice apenas consolida as decisões e fontes que já existem para orientar os próximos casos de uso. As lentes locais reutilizam registros existentes e não criam cópias de conteúdo. Simulações persistentes, sincronização, IA, OCR, integrações, plugins e outras capacidades `FUTURE` permanecem fora do MVP5.

## Evidência

- `packages/pkg-domain/src/study/calculate-academic-metrics.function.ts`
- `packages/app/src/features/academic/academic-discipline-calculation-details.component.tsx`
- `packages/app/src/features/study-plans/calculate-moved-study-plan-step-order.function.ts`
- `packages/app/src/features/reviews/get-review-retention-impact.function.ts`
- `packages/app/src/features/performance/get-performance-summary.function.ts`
- `packages/app/src/features/performance/get-performance-confidence-band.function.ts`

## M5-LANG-001 — vocabulário de cálculo e rearranjo

| Termo            | Significado no Moto                                                                  | Contrato canônico atual                                                     | Não usar como sinônimo de                |
| ---------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ---------------------------------------- |
| `Fato`           | dado local registrado ou lido de uma fonte proprietária, sem alteração pela projeção | `AcademicDiscipline`, `StudyRecord`, `ReviewTarget`, `StudyPlan`            | hipótese ou cálculo derivado             |
| `Hipótese`       | valor editável usado apenas para simular uma decisão antes de salvar                 | ainda não é entidade; deve permanecer entrada de um caso de uso             | fato confirmado ou regra persistida      |
| `Projeção`       | resultado calculado a partir de fatos e, quando houver, de uma hipótese identificada | `AcademicMetrics`, `PersonalKnowledgeProjection`, read models de desempenho | fonte de verdade ou cópia editável       |
| `Cenário`        | conjunto nomeado de hipóteses aplicado a uma projeção                                | ainda não é entidade; não criar armazenamento até haver caso de uso         | estado acadêmico atual                   |
| `Risco`          | sinal derivado de uma regra explícita que exige atenção                              | `attendanceRisk`, `gradeRisk` e diagnósticos de desempenho                  | reprovação determinada ou alerta externo |
| `Regra composta` | regra que combina dois ou mais fatos ou limites, com fórmula visível                 | regras existentes de métricas; novas regras devem ter contrato próprio      | recomendação opaca                       |
| `Exceção`        | diferença local e explícita em relação à regra ou sequência padrão                   | transições de plano e registros acadêmicos manuais, quando aplicável        | erro técnico ou sincronização            |
| `Conflito`       | duas decisões locais incompatíveis que precisam de escolha explícita                 | ainda não é entidade no domínio atual                                       | divergência remota ou falha de rede      |
| `Auditoria`      | registro local da origem, regra, hipótese, resultado e momento de uma decisão        | evidência derivada e histórico local quando já existente                    | log narrativo ou telemetria remota       |

### Regras de desambiguação

1. `Fato` pertence ao contexto que o registra; uma projeção pode consumi-lo, mas não pode reescrevê-lo.
2. `Hipótese` e `Cenário` só entram no modelo persistente quando existir um caso de uso de simulação com salvar, comparar ou desfazer.
3. `Projeção` deve apontar para as fontes e para a versão da regra usada; não pode ser apresentada como certeza absoluta.
4. `Risco` explica uma condição calculada. Ele não agenda, notifica ou altera a situação acadêmica por conta própria.
5. `Exceção` é uma escolha da Pessoa sobre uma regra local. Ela não representa colaboração, sincronização ou dado remoto.
6. `Conflito` será reservado para incompatibilidade entre decisões locais. Um valor ausente ou uma entrada inválida continuam sendo estados de validação.
7. `Auditoria` documenta procedência e reversibilidade; não autoriza criar um event log ou adotar Event Sourcing neste MVP.

## M5-CTX-001 — limites entre cálculo, planejamento, visualização e preferências

O Moto separa quatro responsabilidades locais. A separação é feita pelo valor da decisão e pelo proprietário do estado, não pela biblioteca usada para renderizar ou persistir.

| Responsabilidade        | Pergunta que responde                                              | Fatos que pode ler                                        | Estado que pode alterar                                             | Contratos atuais                                                                                      |
| ----------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Calculadora acadêmica` | Qual é a situação calculada a partir dos registros acadêmicos?     | `AcademicDiscipline`, notas, frequência, pesos e limites  | nenhuma fonte; somente produz `AcademicMetrics`                     | `CalculateAcademicMetricsPort`, `AcademicMetrics`                                                     |
| `Agenda e rearranjo`    | Qual ordem ou compromisso local a Pessoa quer manter?              | `StudyPlan`, etapas, `CalendarEntry` e progresso do plano | ordem do plano ou entradas da agenda por comando explícito          | `GetStudyPlanPort`, `SaveStudyPlanProgressPort`, `CreateCalendarEntryPort`, `ListCalendarEntriesPort` |
| `Visualização`          | Como apresentar uma decisão ou fato para compreensão e comparação? | read models, métricas e estado de consulta                | nenhum fato de domínio; apenas seleção e estado transitório da tela | view models de `academic`, `study-plans`, `calendar`, `performance`                                   |
| `Preferências`          | Como a Pessoa quer receber ou organizar a experiência local?       | `ReminderPreference`, configurações e escolhas locais     | preferências próprias, sem reescrever cálculo, plano ou conteúdo    | `isReminderEnabled` e contratos de preferências existentes                                            |

### Regras de ownership

1. A calculadora acadêmica não cria, reordena ou agenda `CalendarEntry`; ela apenas calcula uma projeção a partir dos fatos que recebe.
2. Agenda e rearranjo não recalculam notas, frequência ou domínio; eles executam comandos sobre plano e agenda e preservam a confirmação explícita.
3. Visualização não importa domínio, adapters ou persistência e não pode mutar entidades; a apresentação recebe resultados da aplicação e coordena apenas consulta, seleção e estados de tela.
4. Preferências não são um atalho para alterar regra acadêmica, ordem de estudo, conteúdo editorial ou scheduler; uma preferência deve ter efeito identificado no próprio contexto.
5. Um caso de uso que atravesse dois contextos deve declarar as duas entradas e a saída composta na aplicação; uma classe de adapter não vira dona dos dois contextos.
6. Um mesmo fato pode ser consumido por mais de uma projeção, mas a sua escrita continua exclusiva do contexto proprietário.
7. `AcademicMetrics` é projeção de cálculo; `StudyPlan` é estado de planejamento; `CalendarEntry` é compromisso de agenda; `ReminderPreference` é escolha de experiência. Nenhum desses termos é substituto dos demais.

### Fluxo permitido

```text
fatos locais
  ├─> calculadora acadêmica ─> AcademicMetrics ─> visualização
  ├─> agenda/rearranjo ──────> StudyPlan/CalendarEntry ─> visualização
  └─> preferências ──────────> comportamento local autorizado ─> visualização
```

O componente de visualização pode combinar read models na mesma tela, mas não pode transferir o ownership dos fatos. Um erro ou ausência em uma fonte deve isolar a seção dependente, mantendo as demais responsabilidades renderizáveis.

### Evidência

- `packages/pkg-domain/src/study/calculate-academic-metrics.function.ts`
- `packages/pkg-domain/src/planning/create-calendar-entry.function.ts`
- `packages/pkg-application/src/commands/create-calendar-entry.command-handler.ts`
- `packages/pkg-application/src/queries/calculate-academic-metrics.query-handler.ts`
- `packages/app/src/features/academic/academic.view-model.ts`
- `packages/app/src/features/study-plans/study-plan.view-model.ts`
- `packages/app/src/features/calendar/calendar.view-model.ts`
- `packages/pkg-domain/src/preferences/is-reminder-enabled.function.ts`

## M5-UC-003 — lentes locais e comparação de visualização

Uma `PersonalLens` é a configuração salva de uma forma de observar os registros pessoais. O termo `preset` não cria uma entidade adicional: quando usado na interface, ele significa uma lente salva. A lente aponta para os registros existentes, escolhe a visualização (`tree` ou `board`) e não duplica conteúdo.

| Caso de uso           | Regra local                                                              | Saída                                                     |
| --------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------- |
| `Criar lente`         | cria uma lente com identificador, nome, tipos de registro e visualização | `PersonalWorkspace` com a lente adicionada                |
| `Salvar preset`       | adiciona ou substitui uma lente pelo identificador, sem duplicação       | `PersonalWorkspace` com a configuração salva              |
| `Comparar cenários`   | compara uma lente atual e uma candidata sem persistir o cenário          | `PersonalLensComparison` com diferenças explicáveis       |
| `Trocar visualização` | troca entre árvore e board e limpa a lente selecionada quando necessário | estado transitório de apresentação, sem mutar o workspace |

### Regras

1. A lente é uma projeção de organização; seus registros continuam pertencendo ao `PersonalWorkspace`.
2. Salvar uma lente existente substitui a configuração pelo mesmo identificador e não cria cópia.
3. Comparar cenários é uma operação transitória entre duas lentes; não cria armazenamento de hipóteses neste corte.
4. Trocar visualização altera apenas o estado da tela até uma ação explícita de salvar.
5. A visualização não pode reescrever notas, checklists, capturas, referências ou relações.

### Evidência

- `packages/pkg-domain/src/personal/create-personal-lens.function.ts`
- `packages/pkg-domain/src/personal/save-personal-lens.function.ts`
- `packages/pkg-domain/src/personal/calculate-personal-lens-comparison.function.ts`
- `packages/app/src/features/personal/use-personal-knowledge-view-state.hook.ts`
- `packages/app/src/features/personal/create-personal-workspace-lens-actions.function.ts`
- testes correspondentes em `packages/pkg-domain/src/personal/*personal-lens*.function.test.ts`

## M5-MODEL-001 — value objects para regras quantitativas

Os valores quantitativos usados por decisões locais passam a ter nomes de domínio antes de serem usados em novos casos de uso. Eles ainda não substituem os campos numéricos dos modelos legados: essa adoção será feita somente quando cada caso de uso puder validar, persistir e exibir o valor sem conversão silenciosa.

| Value object           | Unidade ou regra                  | Invariante a validar na entrada   |
| ---------------------- | --------------------------------- | --------------------------------- |
| `AcademicWeight`       | peso relativo                     | finito e maior que zero           |
| `AttendancePercentage` | percentual de frequência          | finito entre zero e cem           |
| `AcademicCredit`       | crédito acadêmico                 | inteiro não negativo              |
| `StudyDuration`        | duração em minutos                | inteiro não negativo              |
| `CalculationLimit`     | limite absoluto ou percentual     | finito e compatível com a unidade |
| `CalculationPrecision` | casas decimais                    | inteiro não negativo              |
| `CalculationRounding`  | modo e precisão de arredondamento | modo explícito e precisão válida  |

### Contratos

- Cada value object é imutável e possui uma unidade explícita quando a unidade altera o significado do número.
- O número cru não informa sozinho se representa peso, percentual, crédito, duração, limite ou precisão.
- O arredondamento é parte da regra de cálculo e não deve ficar escondido em uma chamada isolada de `Math.round`.
- Limites não são confundidos com metas, mínimos ou riscos; o caso de uso nomeia a decisão que aplica o limite.
- A modelagem não cria migração de dados nem altera o SQLite editorial neste corte.

### Evidência

- `packages/pkg-domain/src/models/academic-weight.model.ts`
- `packages/pkg-domain/src/models/attendance-percentage.model.ts`
- `packages/pkg-domain/src/models/academic-credit.model.ts`
- `packages/pkg-domain/src/models/study-duration.model.ts`
- `packages/pkg-domain/src/models/calculation-limit.model.ts`
- `packages/pkg-domain/src/models/calculation-precision.model.ts`
- `packages/pkg-domain/src/models/calculation-rounding.model.ts`

## M5-MODEL-002 — linhagem e invalidação de projeções

Uma projeção local precisa explicar de onde veio e se ainda pode ser usada. A linhagem é metadado da projeção; não transforma cálculo em fonte de verdade nem cria Event Sourcing.

| Contrato                        | Responsabilidade                                                          |
| ------------------------------- | ------------------------------------------------------------------------- |
| `CalculationRuleVersion`        | identifica a regra e a versão que produziram o cálculo                    |
| `CalculationOrigin`             | aponta para o fato proprietário consumido pela projeção                   |
| `CalculationHypothesis`         | representa uma entrada editável de simulação, sem alterar o fato original |
| `CalculationProjectionMetadata` | reúne momento, origem, versão da regra e estado da projeção               |
| `CalculationProjectionStatus`   | distingue projeção `current`, `stale` e `invalidated`                     |

### Regras de invalidação

1. Uma projeção `current` só é válida para os fatos, a regra e a data informados nos metadados.
2. Mudança em qualquer fato de origem ou na versão da regra torna a projeção `stale` até novo cálculo.
3. Uma hipótese alterada invalida apenas a projeção que a utilizou; o fato acadêmico e o plano original permanecem intactos.
4. `invalidatedAt` registra a perda de validade quando ela for observável; ausência desse campo não significa validade eterna.
5. A interface deve distinguir projeção desatualizada de erro de leitura ou entrada inválida.
6. A origem é referência local estável; não é URL, usuário remoto ou mecanismo de sincronização.

### Evidência

- `packages/pkg-domain/src/models/calculation-rule-version.model.ts`
- `packages/pkg-domain/src/models/calculation-origin.model.ts`
- `packages/pkg-domain/src/models/calculation-hypothesis-entry.model.ts`
- `packages/pkg-domain/src/models/calculation-hypothesis.model.ts`
- `packages/pkg-domain/src/models/calculation-projection-status.type.ts`
- `packages/pkg-domain/src/models/calculation-projection-metadata.model.ts`

## M5-UC-001 — simulações acadêmicas locais

Os três casos de uso deste corte são projeções puras. Eles recebem os fatos atuais, calculam um resultado identificado e não persistem nem alteram `AcademicDiscipline`.

| Caso de uso           | Fórmula ou regra                                                                                                             | Resultado                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `Calcular frequência` | `frequência = aulas frequentadas / aulas previstas × 100`; sem aulas previstas, o resultado local atual é `100%`             | percentual com duas casas                                    |
| `Simular falta`       | acrescenta as faltas hipotéticas às aulas previstas e mantém as aulas frequentadas; valores negativos são tratados como zero | métricas projetadas, incluindo risco de frequência           |
| `Simular nota`        | inclui a nota hipotética no cálculo ponderado existente, sem adicioná-la à disciplina                                        | métricas projetadas, incluindo média e nota final necessária |

### Regras

1. A simulação não salva a hipótese nem substitui o registro original.
2. O resultado usa a mesma regra visível de `calculateAcademicMetrics`; não existe fórmula paralela escondida na interface.
3. A disciplina recebida continua imutável; uma nova referência de projeção é construída antes do cálculo.
4. A interface deve identificar que o resultado é uma projeção, informar a hipótese e permitir descartar o cenário.

### Evidência

- `packages/pkg-domain/src/study/calculate-academic-frequency.function.ts`
- `packages/pkg-domain/src/study/simulate-academic-absence.function.ts`
- `packages/pkg-domain/src/study/simulate-academic-grade.function.ts`
- testes correspondentes em `packages/pkg-domain/src/study/*.function.test.ts`

## M5-UC-002 — rearranjo reversível do plano

O rearranjo local do plano é uma intenção que passa por uma ordem candidata antes de ser persistida. A operação não apaga a ordem anterior durante a confirmação.

| Caso de uso          | Regra local                                                                                              | Saída                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `Replanejar`         | move uma etapa por vez e preserva a permutação dos identificadores existentes                            | ordem candidata explícita                |
| `Detectar conflito`  | compara a ordem candidata com a ordem-base e identifica faltas, identificadores inesperados e duplicatas | conflito explicável ou permutação válida |
| `Desfazer rearranjo` | restaura uma cópia da ordem anterior sem mutar o histórico recebido                                      | ordem anterior restaurada                |

### Regras

1. Uma ordem candidata com conflito não pode ser salva silenciosamente.
2. O conflito é local e estrutural; não representa sincronização ou disputa remota.
3. Cancelar ou desfazer retorna à ordem anterior e não altera o progresso das etapas.
4. A confirmação precisa separar a ordem exibida da ordem persistida até a ação explícita da Pessoa.

### Evidência

- `packages/app/src/features/study-plans/calculate-moved-study-plan-step-order.function.ts`
- `packages/app/src/features/study-plans/calculate-study-plan-rearrangement-conflict.function.ts`
- `packages/app/src/features/study-plans/undo-study-plan-rearrangement.function.ts`
- testes de rearranjo e conflito em `packages/app/src/features/study-plans/*rearrangement*.function.test.ts`

## M5-UC-004 — recomendação determinística explicável

A recomendação local reutiliza `RecommendationInput` e a ordem já definida por `recommendNext`. O resultado explicável informa a origem da escolha sem consultar rede, alterar fatos ou criar uma fila opaca.

| Prioridade | Fato local observado                       | Motivo retornado |
| ---------- | ------------------------------------------ | ---------------- |
| 1          | item incompleto associado a erro recente   | `recent-error`   |
| 2          | item incompleto com domínio abaixo de 100% | `weak-mastery`   |
| 3          | item incompleto sem pré-requisito pendente | `unblocked-item` |
| 4          | primeiro item disponível como fallback     | `fallback`       |
| —          | nenhum item local elegível                 | `none`           |

### Regras

1. A recomendação usa somente `incompleteItems`, `prerequisites`, `topicMastery` e `recentErrors` locais.
2. A decisão continua determinística para a mesma entrada e não persiste estado.
3. `RecommendationReason` identifica a regra que venceu; não é um diagnóstico absoluto do aprendizado.
4. Ausência de item retorna `item: null` e `reason: "none"`, sem inventar conteúdo.
5. O port existente continua retornando o item legado; a decisão explicável é uma projeção adicional para a apresentação.

### Evidência

- `packages/pkg-domain/src/study/recommend-next.function.ts`
- `packages/pkg-domain/src/study/get-next-recommendation-decision.function.ts`
- `packages/pkg-domain/src/study/recommendation-reason.type.ts`
- `packages/pkg-domain/src/study/get-next-recommendation-decision.function.test.ts`

## M5-TEST-001 — fórmulas, conflitos e validade de projeção

Os testes do Moto cobrem frequência sem aulas, arredondamento decimal, simulação de nota e falta sem mutar a disciplina, permutação válida, conflito estrutural, desfazer por cópia, comparação de lentes, recomendação sem item e validade de projeção conforme origem, regra e status.

### Evidência

- `packages/pkg-domain/src/study/calculate-academic-frequency.function.test.ts`
- `packages/pkg-domain/src/study/simulate-academic-grade.function.test.ts`
- `packages/pkg-domain/src/study/simulate-academic-absence.function.test.ts`
- `packages/app/src/features/study-plans/detect-study-plan-rearrangement-conflict.function.test.ts`
- `packages/app/src/features/study-plans/undo-study-plan-rearrangement.function.test.ts`
- `packages/pkg-domain/src/study/is-calculation-projection-current.function.test.ts`

## M5-UI-001 — hierarquia de visualizações e métricas

As visualizações locais usam uma composição comum: superfície de conteúdo, título, mensagem de indisponibilidade, representação visual e alternativa textual. Métricas acadêmicas, desempenho, mapas e blocos editoriais continuam separados por responsabilidade, sem transformar o gráfico em fonte de verdade.

### Regras aplicadas

1. O título identifica o que está sendo apresentado antes da área visual.
2. Uma visualização indisponível não remove a explicação nem interrompe a seção inteira.
3. Gráficos, mapas e cenas possuem uma alternativa textual visível para leitura, comparação e fallback.
4. A apresentação recebe dados já calculados ou read models; não calcula domínio, nota ou frequência dentro do renderer.
5. Visualização pesada é carregada sob demanda e não é requisito para consultar o conteúdo textual.

### Evidência

- `packages/pkg-ui-content/src/visualization/chart-block.component.tsx`
- `packages/pkg-ui-content/src/visualization/knowledge-map-block.component.tsx`
- `packages/pkg-ui-content/src/visualization/parametric-scene-block.component.tsx`
- `packages/app/src/features/performance/performance-ready-view.component.tsx`
- `packages/app/src/features/academic/academic-discipline-calculation-details.component.tsx`

## M5-UI-002 — equivalência textual das visualizações

Cada bloco visual publica um resumo textual junto da camada gráfica. O resumo informa dados do gráfico, nós e relações do mapa ou parâmetros da cena 3D. Assim, a pessoa consegue compreender o conteúdo com fonte ampliada, leitor de tela ou sem suporte gráfico.

### Evidência

- `packages/pkg-ui-content/src/visualization/visualization-text-summary.component.tsx`
- `packages/pkg-ui-content/src/visualization/visualization-blocks.component.test.tsx`
- `packages/pkg-ui-content/src/visualization/get-visualization-support.function.ts`

## M5-UI-003 — isolamento de carregamento, cancelamento e erro visual

Bibliotecas pesadas são importadas dinamicamente dentro de `pkg-ui-content`. O carregamento usa fallback próprio; efeitos mantêm uma guarda de atividade, liberam recursos no cleanup e mantêm a alternativa textual mesmo quando Canvas, WebGL ou a biblioteca visual falham. A falha fica restrita ao bloco dependente.

### Evidência

- `packages/pkg-ui-content/src/block-view.component.tsx`
- `packages/pkg-ui-content/src/content-loading-fallback.component.tsx`
- `packages/pkg-ui-content/src/visualization/chart-block.component.tsx`
- `packages/pkg-ui-content/src/visualization/knowledge-map-block.component.tsx`
- `packages/pkg-ui-content/src/visualization/parametric-scene-block.component.tsx`

## M5-INFRA-001 — infraestrutura visual sob demanda

O MVP5 não adiciona um editor gráfico nem Worker sem necessidade observada. ECharts, Cytoscape e Three.js ficam em `pkg-ui-content`, são carregados por importação dinâmica, possuem detecção de capacidade e têm fallback textual. A infraestrutura de domínio permanece independente dessas bibliotecas.

### Evidência

- `packages/pkg-ui-content/package.json`
- `packages/pkg-ui-content/src/block-view.component.tsx`
- `packages/pkg-ui-content/src/visualization/get-visualization-support.function.ts`
- boundaries do pacote `pkg-ui-content` no plugin arquitetural

## M5-TEST-002 — volume, viewport, fonte e indisponibilidade visual

A matriz de visualização combina testes de componente e E2E. O componente de mapa mantém a alternativa textual e a semântica `img` mesmo com 48 nós e 47 relações; o gráfico mantém os dados tabulares quando Canvas está indisponível. A suíte E2E cobre viewport móvel e desktop, fonte ampliada, overflow horizontal, navegação por teclado, foco visível e axe nas rotas de estudo.

### Evidência

- `packages/pkg-ui-content/src/visualization/visualization-blocks.component.test.tsx`
- `packages/app/tests/e2e/mvp2-ui004.spec.ts`
- `packages/app/tests/e2e/accessibility-routes.spec.ts`
- `packages/app/tests/e2e/layout-integrity.spec.ts`

## M5-REVIEW-001 — automação explicável e controlável

As automações do Moto permanecem como recomendações locais, não como comandos ocultos. A recomendação informa o motivo (`recent-error`, `weak-mastery`, `unblocked-item`, `fallback` ou `none`); a revisão permite adiar, suspender, reativar e avaliar manualmente; a pessoa pode desativar recomendações e recursos nas preferências. Nenhuma automação altera plano, diagnóstico ou dados acadêmicos sem ação explícita.

### Evidência

- `packages/pkg-domain/src/study/get-next-recommendation-decision.function.ts`
- `packages/app/src/features/reviews/create-review-actions.function.ts`
- `packages/app/src/features/reviews/review-rating-controls.component.tsx`
- `packages/app/src/features/preferences/preference-key.type.ts`
- `packages/app/src/features/preferences/preferences-ready-view.component.tsx`
