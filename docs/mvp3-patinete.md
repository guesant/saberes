# MVP3 — Patinete

## M3-DOM-001 — captura rápida local

Esta observação define a menor unidade de captura útil antes de criar telas ou entidades novas. A captura precisa ser rápida, privada e recuperável sem rede. Ela não é automaticamente uma Nota, uma Atividade ou um Evento: primeiro preserva a intenção original da Pessoa; depois pode ser classificada em um caso de uso próprio.

### Cenário 1 — ideia

**Situação:** durante o estudo, a Pessoa percebe uma conexão ou pergunta que não quer perder.

**Entrada mínima:** texto livre curto, por exemplo: “Comparar este tópico com a regra anterior”.

**Resultado esperado:** uma `Captura` local com texto, horário de criação, estado `inbox` e procedência `quick-capture`.

**Próximo passo possível:** converter a Captura em `Nota` pessoal ou associá-la a um `Tópico`/`Material` já existente.

**Não fazer automaticamente:** criar uma atividade de estudo, atribuir prazo ou inferir um Evento.

### Cenário 2 — compromisso

**Situação:** a Pessoa registra algo que precisa realizar em uma data ou período.

**Entrada mínima:** texto e, quando a Pessoa informar, data ou horário local.

**Resultado esperado:** uma `Captura` local preservando texto, data informada e procedência. A data não transforma a Captura em compromisso até a classificação explícita.

**Próximo passo possível:** classificar como `Atividade` com vencimento ou, quando o conceito de agenda for adotado, como `Evento` local.

**Não fazer automaticamente:** criar recorrência, notificação externa, convite, participante ou integração de calendário.

### Cenário 3 — lembrete acadêmico

**Situação:** a Pessoa quer lembrar de revisar ou retomar um conteúdo.

**Entrada mínima:** texto ou referência a um `Curso`, `Lição`, `Tópico` ou `Questão` já disponível localmente.

**Resultado esperado:** uma `Captura` local com a referência estável, quando existir, e estado `inbox`.

**Próximo passo possível:** classificar como `Lembrete` interno ou encaminhar para a revisão já existente, sem duplicar o `ReviewTarget`.

**Não fazer automaticamente:** criar uma segunda agenda de revisão, alterar o domínio ou agendar FSRS apenas pela captura.

## Invariantes da captura

1. A escrita local acontece imediatamente e não depende de rede, conta ou permissão externa.
2. O texto original, a data informada e a procedência são preservados durante a classificação.
3. Classificar uma Captura não duplica o conteúdo: a nova entidade referencia a Captura ou a substitui por uma transição explícita e auditável.
4. Uma Captura pode permanecer em `Inbox` sem prazo e sem tipo definido.
5. Concluir, adiar, arquivar e restaurar são transições locais idempotentes e reversíveis quando a interface oferecer desfazer.
6. Um `Lembrete` acadêmico referencia o conteúdo ou a revisão existente; não cria um tópico, Curso ou `ReviewTarget` concorrente.
7. Um compromisso sem agenda implementada permanece como Captura com data informada; não simula integração de calendário.
8. Uma falha ao classificar uma Captura não apaga o registro original nem bloqueia as demais áreas da aplicação.
9. A ordenação inicial da Inbox usa `createdAt` local; nenhuma prioridade implícita é inferida do texto.
10. O vocabulário desta decisão permanece pessoal e single-player; colaboração, sincronização, plugins, IA, OCR e integrações ficam fora do MVP3.

## Fluxo mínimo observado

```text
captura rápida
  → escrita local imediata
  → Inbox
  → classificação explícita
  → Nota | Atividade | Lembrete
  → ação local correspondente
```

O valor do Patinete é reduzir o intervalo entre perceber algo e preservar esse algo. A classificação pode acontecer depois, sem obrigar a Pessoa a decidir o modelo correto no momento da captura.

## Decisões de linguagem

| Termo                 | Significado neste MVP                                           | Não usar como sinônimo de                   |
| --------------------- | --------------------------------------------------------------- | ------------------------------------------- |
| `Captura`             | registro inicial, rápido e ainda não classificado               | Nota, Atividade, Evento ou Lembrete         |
| `Inbox`               | estado/coleção local de Capturas pendentes                      | caixa de entrada remota ou fila de servidor |
| `Atividade`           | ação pessoal que pode ter vencimento e progresso                | Evento de calendário ou Sessão de estudo    |
| `Evento`              | ocorrência temporal explicitamente criada no contexto de agenda | qualquer Captura com data                   |
| `Lembrete`            | intenção local de lembrar ou retomar algo                       | revisão FSRS duplicada                      |
| `Adiado`              | estado de uma ação que a Pessoa escolheu postergar              | arquivado ou concluído                      |
| `Arquivado`           | estado que remove da lista ativa sem apagar o registro          | excluído                                    |
| `Recorrência simples` | regra local limitada para gerar ocorrências futuras             | sincronização ou calendário externo         |

## M3-LANG-001 — contrato dos termos

Os termos abaixo são decisões de linguagem, não uma autorização para criar entidades paralelas. Quando já existe um contrato equivalente, ele prevalece. Neste momento, `StudyCapture` é o modelo existente para a entrada pessoal pendente; `PersonalNote`, `StudyChecklist`, `PersonalReference`, `StudySession`, `FocusSession` e `ReviewTarget` continuam sendo os conceitos proprietários já modelados.

| Termo canônico        | Significado operacional                                              | Contrato existente ou futuro                                                     | Estado permitido                                      | Regra de uso                                                |
| --------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| `Captura`             | texto ou referência preservada rapidamente antes da classificação    | `StudyCapture`                                                                   | `inbox` implícito por ausência de classificação       | não exige título final, prazo ou tipo de destino            |
| `Inbox`               | visão local das Capturas ainda não classificadas                     | projeção de `StudyCapture`                                                       | `inbox`                                               | é uma consulta/estado, não uma entidade concorrente         |
| `Atividade`           | ação pessoal planejada ou executável, com progresso opcional         | `StudyActivity` quando o contexto for delimitado                                 | `planned`, `active`, `completed`, `archived`          | não substitui `StudySession`, `FocusSession` ou `Event`     |
| `Evento`              | ocorrência temporal explicitamente criada para uma agenda local      | `CalendarEntry` somente quando o contexto for adotado                            | `scheduled`, `completed`, `cancelled`, `archived`     | uma data em Captura não cria Evento automaticamente         |
| `Lembrete`            | intenção pessoal de lembrar ou retomar uma referência                | projeção local ou vínculo com `ReviewTarget`                                     | `active`, `snoozed`, `dismissed`, `archived`          | não duplica revisão, tópico ou conteúdo                     |
| `Adiado`              | transição que posterga uma ação sem encerrá-la                       | estado/transição do agregado proprietário                                        | permanece reabrível                                   | não significa arquivado nem concluído                       |
| `Arquivado`           | estado fora da lista ativa, com preservação do registro              | `archived` já presente em `StudyCapture`, `StudyChecklist` e `PersonalReference` | terminal para a lista ativa, reversível por restaurar | não apaga dados e não é exclusão                            |
| `Recorrência simples` | regra local limitada que gera ocorrências de uma Atividade ou Evento | `RecurrenceRule` quando modelado                                                 | `active` ou `archived`                                | sem exceções complexas, sincronização ou integração externa |

### Regras de desambiguação

1. `Captura` descreve a entrada; `Atividade`, `Evento` e `Lembrete` descrevem destinos classificados. A classificação é explícita.
2. `Inbox` é uma projeção da coleção pendente. Não é uma caixa remota, conversa ou fila de processamento.
3. `Adiado` é uma ação sobre algo ativo. O registro continua pertencendo ao mesmo contexto e conserva seu identificador.
4. `Arquivado` retira o registro das consultas ativas, mas não remove texto, procedência, referência ou histórico.
5. `Evento` só existe quando a Pessoa escolhe uma representação temporal de agenda. Prazo de uma Atividade não é automaticamente Evento.
6. `Lembrete` acadêmico deve apontar para `ContentKey`, `ReviewTarget` ou outro identificador já existente; não deve copiar título e conteúdo como nova fonte de verdade.
7. `Recorrência simples` pertence ao item que a originou. Ocorrências geradas são projeções e não alteram retroativamente a regra ou as ocorrências já concluídas.
8. Nenhum termo pressupõe servidor, participante, convite, permissão externa, comunidade ou sincronização.

## M3-CTX-001 — ownership dos contextos

O Patinete atravessa três responsabilidades, mas não exige três bancos ou três agregados novos. O ownership é definido pela decisão que cada conceito representa e pelos contratos já existentes.

| Conceito                                | Bounded context proprietário | Fonte de verdade no MVP3                                                  | Projeções/consumidores permitidos                         | Fora do contexto                                        |
| --------------------------------------- | ---------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `Capture` / `Captura`                   | `PersonalWorkspace`          | `StudyCapture` no armazenamento local                                     | Inbox, classificação, busca pessoal e histórico de origem | não é atividade, evento, revisão ou conteúdo editorial  |
| `StudyActivity` / `Atividade de estudo` | `Study`                      | registro de atividade usado pelo progresso e sequência                    | Home, desempenho e histórico de estudo                    | não é `StudySession`, `FocusSession` ou `CalendarEntry` |
| `CalendarEntry` / `Evento de agenda`    | `Planning`                   | contrato futuro de agenda local, somente quando a agenda entrar no escopo | lista, mês, semana e lembretes temporais                  | não é criado por qualquer Captura com data              |

### PersonalWorkspace

Este contexto é dono do que a Pessoa captura, escreve, arquiva e recupera como material pessoal. `StudyCapture` já pertence a `PersonalWorkspace`, ao lado de `PersonalNote`, `StudyChecklist` e `PersonalReference`. A Inbox é uma read model filtrada por estado, não um agregado separado.

Uma Captura pode carregar `contentKey`, mas esse campo é uma referência; o conteúdo referenciado continua pertencendo ao contexto editorial/estudo. A classificação pode criar ou atualizar uma Nota, Checklist, Atividade ou Lembrete por um caso de uso explícito. Nenhuma tela deve gravar diretamente em outro agregado.

### Study

Este contexto é dono da evidência de aprendizagem e das atividades que afetam progresso, sequência, sessão, domínio ou revisão. O serviço existente `RecordStudyActivityCommandHandler`/`RecordStudyActivityPort` registra atividade de estudo; ele não deve receber uma Captura diretamente nem transformar texto pessoal em evidência sem uma decisão de classificação.

`StudySession`, `FocusSession`, `AttemptRecord`, `LessonProgressRecord` e `ReviewTarget` permanecem conceitos distintos. Uma Captura acadêmica pode apontar para um deles, mas não os substitui nem os duplica.

### Planning

Este contexto será responsável por eventos e recorrência de agenda local quando esses casos de uso forem implementados. O backlog permite apenas uma agenda pessoal e local; não há participante, convite, calendário externo, notificação remota ou sincronização.

Até que `CalendarEntry` tenha contrato próprio, uma data informada em `StudyCapture` permanece um dado da captura. Ela não autoriza o adapter ou a UI a inventar uma entidade de calendário.

### Fluxo entre contextos

```text
PersonalWorkspace
  StudyCapture
       │ classificação explícita por caso de uso
       ├── PersonalNote
       ├── StudyActivity ──→ Study
       ├── Lembrete ───────→ Study/ReviewTarget ou Planning/CalendarEntry
       └── CalendarEntry ───→ Planning
```

As relações entre contextos atravessam identificadores e read models, nunca referências a classes concretas de adapters. A apresentação consulta a application layer; somente a composição conecta as portas às implementações locais.

### Regras de ownership

1. `PersonalWorkspace` é o único dono da Captura original e de sua procedência.
2. `Study` é o único dono da evidência de estudo, domínio, sessão e revisão.
3. `Planning` é o único dono de uma ocorrência temporal de agenda, quando o contrato existir.
4. A Inbox não pode gravar em `Study` ou `Planning` sem executar um caso de uso de classificação.
5. `Study` e `Planning` não podem apagar a Captura original como efeito colateral.
6. Um read model pode combinar dados dos três contextos, mas não se torna fonte de verdade de nenhum deles.
7. A ausência ou falha de um contexto deve isolar a informação dependente; Capturas e progresso independentes continuam renderizando.
8. `CalendarEntry` é local e limitado neste recorte; recorrência continua sendo uma capacidade posterior e não é criada por uma Captura com data.

## M3-MODEL-001 — conversão sem cópia concorrente

A conversão é uma promoção explícita da `Captura`, não uma segunda gravação independente do mesmo texto. A identidade da Captura permanece a origem canônica da classificação; a Nota ou Atividade criada recebe uma relação de origem única e passa a ser o proprietário do estado classificado.

### Registro de origem

| Campo               | Regra                                                    |
| ------------------- | -------------------------------------------------------- |
| `captureId`         | obrigatório, estável e único por classificação           |
| `targetType`        | `note` ou `activity` neste recorte                       |
| `targetId`          | identificador do destino criado ou já associado          |
| `classifiedAt`      | timestamp local da classificação                         |
| `sourceTitle`       | título preservado no momento da promoção, para auditoria |
| `sourceDescription` | texto preservado no momento da promoção, para auditoria  |
| `sourceDueDate`     | prazo informado na Captura, quando existir               |
| `sourceContentKey`  | referência editorial existente, quando existir           |
| `status`            | `active`, `undone` ou `archived`                         |

Esse vínculo é a relação de procedência; não é uma cópia concorrente de Nota ou Atividade. A implementação pode persistir a relação em uma tabela/store próprio ou embuti-la no destino, mas não pode permitir duas classificações ativas para o mesmo `captureId`.

### Promoção para Nota

1. Ler a Captura pelo `captureId` dentro de uma transação local.
2. Rejeitar se ela já tiver uma classificação ativa diferente.
3. Criar `PersonalNote` com o conteúdo inicial da Captura: `title` recebe `title` e `body` recebe `description`.
4. Preservar `createdAt`, `updatedAt`, `contentKey` e procedência através do registro de origem.
5. Marcar a Captura como classificada/arquivada para que ela deixe de aparecer na Inbox, sem apagar o registro histórico.
6. Gravar o vínculo e a Nota na mesma transação.

Depois da promoção, a Nota é editável. Alterar a Nota não altera o texto original da Captura; desfazer remove a classificação e restaura a Captura na Inbox, mantendo a Nota recuperável enquanto a ação oferecer desfazer.

### Promoção para Atividade

1. Ler a Captura pelo `captureId` dentro de uma transação local.
2. Rejeitar se ela já tiver uma classificação ativa diferente.
3. Criar `StudyActivity` com o texto preservado, `sourceCaptureId`, `dueDate` e referência editorial, quando presentes.
4. Não registrar automaticamente uma evidência de estudo: criar uma Atividade não equivale a executá-la.
5. Marcar a Captura como classificada/arquivada para retirá-la da Inbox.
6. Gravar o vínculo e a Atividade na mesma transação.

O prazo da Captura pode virar prazo da Atividade, mas não vira `CalendarEntry` sem uma decisão posterior. Concluir a Atividade não conclui a Captura por uma segunda operação: o estado é projetado pela relação de classificação.

### Invariantes de conversão

1. `captureId` é obrigatório em toda conversão e só pode ter uma classificação ativa.
2. A classificação é idempotente: repetir o mesmo comando retorna o destino existente em vez de criar duplicata.
3. A conversão preserva texto, data, `contentKey` e procedência; não descarta campos silenciosamente.
4. A Captura não permanece simultaneamente como item ativo da Inbox e como origem classificada.
5. A Nota ou Atividade não pode ser criada sem o registro de procedência correspondente.
6. Uma falha parcial desfaz a transação local ou deixa a Captura intacta e não classificada; não há sucesso falso.
7. Editar o destino depois da conversão não reescreve o snapshot de origem.
8. Desfazer uma conversão restaura a Captura sem apagar tentativas, sessões, progresso ou conteúdo editorial.
9. Uma Captura classificada como Nota não pode ser tratada como Atividade sem uma nova decisão explícita; a troca encerra a classificação anterior de modo auditável.
10. O vínculo entre Captura e destino usa identificadores, não importações entre adapters ou acesso direto ao banco pela UI.

### Decisão sobre os modelos existentes

`StudyCapture`, `PersonalNote` e o futuro `StudyActivity` continuam sendo representações de contextos diferentes. O modelo existente de `StudyCapture` ainda não possui `sourceCaptureId`, `targetType` ou `classificationStatus`; portanto, esta seção é contrato de modelagem para os próximos casos de uso e não altera esses tipos nesta etapa. A lacuna deve ser resolvida antes de `M3-UC-002`, com migration local reversível e teste de idempotência.

## M3-MODEL-002 — recorrência simples

Recorrência é uma regra local que projeta ocorrências futuras de uma Atividade ou Evento. Ela não é uma lista de cópias independentes e não deve alterar retroativamente ocorrências já concluídas. O Patinete usa somente regras pequenas e explícitas; RRULE, exceções compostas, conflitos avançados e sincronização permanecem fora deste recorte.

### Regra de recorrência

| Campo                     | Regra do Patinete                                               |
| ------------------------- | --------------------------------------------------------------- |
| `recurrenceId`            | identificador estável da regra                                  |
| `ownerType`               | `activity` ou `event`                                           |
| `ownerId`                 | identificador do item que originou a regra                      |
| `frequency`               | `daily` ou `weekly`                                             |
| `interval`                | inteiro positivo limitado a `1` neste MVP                       |
| `weekdays`                | obrigatório para `weekly`, com um ou mais dias locais distintos |
| `startsOn`                | data local da primeira ocorrência                               |
| `endsOn`                  | data final opcional, inclusiva                                  |
| `status`                  | `active` ou `archived`                                          |
| `createdAt` / `updatedAt` | timestamps locais da regra                                      |

Não haverá combinação de frequência, mês variável, dependência de feriado, fuso remoto ou expressão textual. A regra é interpretada no calendário local da Pessoa.

### Ocorrência gerada

Uma ocorrência é uma projeção identificável por `occurrenceId = recurrenceId + occurrenceDate`. Ela carrega o vínculo com a regra, a data originalmente calculada, o estado próprio e, quando necessário, uma alteração local.

| Campo            | Regra                                                          |
| ---------------- | -------------------------------------------------------------- |
| `occurrenceId`   | único por regra e data original                                |
| `recurrenceId`   | obrigatório                                                    |
| `occurrenceDate` | data calculada pela regra, imutável                            |
| `scheduledDate`  | data efetiva; inicialmente igual a `occurrenceDate`            |
| `status`         | `planned`, `completed`, `postponed`, `cancelled` ou `archived` |
| `override`       | indica edição manual da ocorrência                             |
| `updatedAt`      | versão local mais recente da ocorrência                        |

A ocorrência não é criada antecipadamente em volume ilimitado. A consulta do período solicitado pode materializar apenas as datas necessárias; se uma ocorrência materializada for reaberta, sua identidade e sua procedência permanecem estáveis.

### Exceção manual

Uma exceção pertence a uma ocorrência específica e não altera a regra-mãe. O Patinete permite somente estas operações:

- `skip`: não apresentar a ocorrência como pendente naquele período;
- `move`: alterar `scheduledDate` para outra data local;
- `override`: editar o título, descrição ou prazo daquela ocorrência;
- `complete`: concluir a ocorrência sem alterar as demais.

Cada exceção referencia `recurrenceId` e `occurrenceDate`. Não há exceção que altere todas as ocorrências futuras; essa operação seria uma edição da regra e precisa de um caso de uso diferente.

### Arquivamento

Arquivar uma regra muda seu estado para `archived` e impede a geração de novas ocorrências depois do momento do arquivamento. Ocorrências passadas, concluídas e exceções permanecem consultáveis. Arquivar uma ocorrência individual apenas a retira da lista ativa; não arquiva a regra nem apaga o histórico.

Restaurar uma regra reativa a mesma `recurrenceId`, preservando `createdAt`, ocorrências passadas e exceções. A restauração não recria ocorrências já materializadas nem duplica uma data existente.

### Invariantes

1. Uma regra ativa possui exatamente um proprietário: uma Atividade ou um Evento.
2. `occurrenceId` é idempotente; reconsultar ou materializar a mesma data não cria duplicata.
3. A regra calcula somente datas dentro do período solicitado e respeita `startsOn`/`endsOn`.
4. `occurrenceDate` não muda; uma mudança manual altera apenas `scheduledDate` e registra `override`.
5. Concluir, adiar, cancelar e arquivar uma ocorrência não altera as outras ocorrências.
6. Uma exceção nunca modifica silenciosamente a regra-mãe.
7. Arquivar não equivale a excluir: regra, ocorrências e exceções continuam recuperáveis localmente.
8. Restaurar é idempotente e não materializa novamente ocorrências já existentes.
9. Falha ao gerar uma ocorrência não remove a regra nem as ocorrências anteriores.
10. Nenhuma regra consulta rede, calendário externo, participante, convite ou notificação remota.

### Limite para implementação

O contrato deve ser implementado depois de `M3-UC-004` definir as visões de lista, mês e semana. A primeira implementação deve cobrir apenas `daily`/`weekly`, conclusão, adiamento, arquivamento, restauração e uma exceção por ocorrência. Não adicionar RRULE ou edição em lote nesta fatia.

## M3-UC-001 — capturar rapidamente

O caso de uso já usa o fluxo local de `PersonalWorkspace`: a pessoa preenche título, descrição, referência opcional e prazo opcional; a aplicação cria um `StudyCapture` pendente e grava o workspace pelo `SavePersonalWorkspacePort`. A captura é persistida no IndexedDB/Dexie através do adapter configurado na composição, sem chamada de rede.

### Fluxo

```text
formulário de captura
  → StudyCaptureCreateInput
  → addStudyCapture
  → PersonalWorkspace.captures
  → SavePersonalWorkspaceCommandHandler
  → SavePersonalWorkspacePort.execute
  → IndexedDB/Dexie
  → invalidar personal-workspace
```

### Pré-condições

1. O workspace pessoal foi carregado ou a apresentação está em estado de criação local vazio.
2. Título e descrição possuem conteúdo não vazio depois de `trim`.
3. O identificador é fornecido pelo `IdGenerator` da composição.
4. O prazo e o `ContentKey` são opcionais; quando informados, são preservados.

### Pós-condições

1. Uma captura nova é adicionada sem alterar notas, checklists ou referências existentes.
2. A captura nasce com `completed: false`, `archived: false` e `priority: "medium"`.
3. `createdAt` e `updatedAt` recebem o mesmo timestamp local de criação.
4. Após sucesso, o formulário pode ser limpo e a consulta do workspace é invalidada.
5. Se a escrita falhar, o estado de erro fica no nível da ação; o workspace carregado permanece disponível para leitura e retry.

### Evidência

- `packages/app/src/features/personal/add-study-capture.function.ts` cria o registro sem mutar o workspace anterior.
- `packages/app/src/features/personal/use-create-study-capture.hook.ts` gera o identificador, cria o timestamp e delega a gravação.
- `packages/app/src/features/personal/use-save-personal-workspace-mutation.hook.ts` usa o serviço de aplicação e invalida somente `personal-workspace`.
- `packages/pkg-application/src/commands/save-personal-workspace.command-handler.ts` mantém a apresentação desacoplada do armazenamento.
- `packages/pkg-adapter-data-v1/src/adapters/progress/dexie/save-personal-workspace-adapter.adapter.ts` implementa a porta local.
- `packages/app/src/features/personal/add-study-capture.function.test.ts` verifica conteúdo, estado inicial, preservação de coleções e não mutação.

### Limites

Esta fatia não classifica a Captura, não cria recorrência, não dispara notificação e não registra evidência de estudo. A classificação é o próximo caso de uso (`M3-UC-002`).

## M3-UC-002 — classificar Captura

O caso de uso transforma uma Captura em uma Nota ou Atividade por decisão explícita da Pessoa. A função de domínio preserva o registro original, marca a Captura como arquivada para removê-la da Inbox e cria um único destino com `sourceCaptureId`. A aplicação expõe a intenção por `ClassifyStudyCaptureCommandHandler`; o adapter lê e salva o workspace local por IndexedDB/Dexie.

### Comando

| Elemento    | Contrato                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------ |
| Entrada     | `ClassifyStudyCaptureInput` com `workspace`, `captureId`, `targetId`, `targetType` e `now` |
| Porta       | `ClassifyStudyCapturePort.execute(input)`                                                  |
| Handler     | `ClassifyStudyCaptureCommandHandler`                                                       |
| Adapter     | `ClassifyStudyCaptureAdapter`                                                              |
| Destinos    | `PersonalNote` ou `PersonalActivity`                                                       |
| Procedência | `sourceCaptureId` no destino e `archived: true` na Captura original                        |

### Comportamento

1. A aplicação lê a Captura pelo identificador estável.
2. Se não existir, o comando falha sem alterar o workspace.
3. Se a Captura já tiver destino do mesmo tipo, a operação retorna o workspace existente sem criar duplicata.
4. Se já tiver destino de outro tipo, o comando falha e exige uma decisão explícita de troca.
5. Para Nota, `title` e `description` viram `title` e `body`; para Atividade, preservam título, descrição, `ContentKey` e prazo.
6. A Atividade nasce `planned`; classificá-la não registra estudo realizado nem altera domínio, sessão ou revisão.
7. A Captura original permanece armazenada e arquivada, preservando texto, prazo, referência e timestamps.
8. O adapter salva o workspace local e não acessa rede, UI, query cache ou conteúdo editorial.

### Compatibilidade local

`PersonalWorkspace.activities` é normalizado como lista vazia ao ler workspaces legados que ainda não possuem a coleção. `PersonalNote.sourceCaptureId` é opcional para preservar notas existentes. Nenhum registro anterior é apagado ou reinterpretado.

### Evidência

- `packages/pkg-domain/src/personal/classify-study-capture.function.ts` aplica a regra pura de promoção e idempotência.
- `packages/pkg-domain/src/personal/classify-study-capture.function.test.ts` cobre Nota, Atividade, repetição idempotente e conflito de destino.
- `packages/pkg-application/src/commands/classify-study-capture.command-handler.ts` coordena o caso de uso por uma porta única.
- `packages/pkg-adapter-data-v1/src/adapters/progress/dexie/classify-study-capture-adapter.adapter.ts` implementa a persistência local.
- `packages/pkg-adapter-data-v1/src/storage/progress.test.ts` verifica a leitura compatível de workspace legado.

### Limites

Ainda não há tela de classificação: a UI do Patinete será adicionada em `M3-UI-001`. Não há alteração em conteúdo editorial, calendário externo, sincronização, notificação ou evidência de estudo.

## M3-UC-003 — concluir, adiar, arquivar e restaurar Captura

As transições do ciclo de vida da Captura são comandos locais, idempotentes e independentes de calendário externo. Cada comando recebe um único input nomeado, preserva o identificador da Captura e grava somente no workspace local.

### Comandos e contratos

| Intenção  | Porta                                     | Handler                              | Adapter                       | Efeito                                      |
| --------- | ----------------------------------------- | ------------------------------------ | ----------------------------- | ------------------------------------------- |
| Concluir  | `CompleteStudyCapturePort.execute(input)` | `CompleteStudyCaptureCommandHandler` | `CompleteStudyCaptureAdapter` | define `completed: true`                    |
| Adiar     | `PostponeStudyCapturePort.execute(input)` | `PostponeStudyCaptureCommandHandler` | `PostponeStudyCaptureAdapter` | define um novo `dueDate` e reabre a Captura |
| Arquivar  | `ArchiveStudyCapturePort.execute(input)`  | `ArchiveStudyCaptureCommandHandler`  | `ArchiveStudyCaptureAdapter`  | define `archived: true`                     |
| Restaurar | `RestoreStudyCapturePort.execute(input)`  | `RestoreStudyCaptureCommandHandler`  | `RestoreStudyCaptureAdapter`  | define `archived: false`                    |
| Desfazer  | `UndoStudyCapturePort.execute(input)`     | `UndoStudyCaptureCommandHandler`     | `UndoStudyCaptureAdapter`     | restaura o snapshot anterior da Captura     |

### Invariantes

1. Repetir `Concluir`, `Arquivar` ou `Restaurar` produz o mesmo estado final e não cria outra Captura.
2. `Adiar` preserva o identificador, o texto, a procedência e o `ContentKey`; apenas atualiza o prazo, reabre a Captura e registra `updatedAt`.
3. Adiar não cria `CalendarEntry`, recorrência, notificação ou integração externa.
4. Arquivar retira a Captura das consultas ativas sem apagar seu registro ou seus destinos classificados.
5. Restaurar torna a Captura elegível para a Inbox sem apagar Nota, Atividade, Sessão ou progresso relacionado.
6. Desfazer recebe o estado anterior explicitamente e pode reverter conclusão, arquivamento e adiamento sem depender de uma API remota.
7. Um identificador inexistente deixa o workspace inalterado; a decisão de exibir o erro pertence à camada de aplicação/apresentação.

### Evidência

- `packages/pkg-domain/src/personal/complete-study-capture.function.ts`, `postpone-study-capture.function.ts`, `archive-study-capture.function.ts` e `restore-study-capture.function.ts` implementam transições puras.
- `packages/pkg-domain/src/personal/undo-study-capture.function.ts` aplica o estado anterior para desfazer uma ação local.
- `packages/pkg-application/src/commands/` expõe um handler CQRS e `execute()` por intenção.
- `packages/pkg-application/src/ports/` mantém uma porta por caso de uso, sem contrato de SQLite ou IndexedDB.
- `packages/pkg-adapter-data-v1/src/adapters/progress/dexie/` contém um adapter Dexie por porta.
- `packages/pkg-domain/src/personal/capture-lifecycle.function.test.ts` cobre conclusão, adiamento, arquivamento, restauração, idempotência e desfazer.

### Limites

O desfazer deste recorte depende de o chamador conservar o snapshot anterior enquanto a ação estiver disponível. Histórico durável, múltiplas ações encadeadas, recorrência e uma UI dedicada de Captura permanecem nas fatias seguintes.

## M3-UC-004 — lista, mês e semana

O calendário deste recorte é uma projeção local de `CalendarEntry`. A Pessoa pode criar uma entrada a partir da posição selecionada e consultar o mesmo conjunto em três visões, sem iCal, calendário externo, participante, convite ou sincronização.

### Contratos

| Intenção                     | Contrato                                                         | Regra                                                                                 |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Criar na posição selecionada | `CreateCalendarEntryPort.execute(input)`                         | `startsAt` recebe a posição escolhida e o identificador torna a repetição idempotente |
| Consultar lista              | `ListCalendarEntriesPort.execute({ view: "list", anchorDate })`  | retorna a data selecionada, ordenada por `startsAt`                                   |
| Consultar mês                | `ListCalendarEntriesPort.execute({ view: "month", anchorDate })` | retorna o intervalo do primeiro ao último dia do mês                                  |
| Consultar semana             | `ListCalendarEntriesPort.execute({ view: "week", anchorDate })`  | retorna segunda-feira a domingo da semana da posição                                  |

### Comportamento

1. Criar a partir de uma posição não cria recorrência e não altera a Captura original.
2. Uma entrada com o mesmo identificador retorna o workspace existente sem duplicação.
3. As consultas ignoram entradas arquivadas e ordenam o resultado pelo início.
4. A visão de lista usa o dia da posição; mês e semana usam intervalos derivados deterministicamente da posição.
5. A fonte continua sendo o workspace local; as visões não mantêm cópias concorrentes.
6. Falhas de leitura devem ficar isoladas no estado da consulta, sem impedir Capturas, Notas ou Progresso de continuarem disponíveis.

### Evidência

- `packages/pkg-domain/src/models/calendar-entry.interface.ts` define a entrada temporal local.
- `packages/pkg-domain/src/planning/create-calendar-entry.function.ts` cria a entrada na posição selecionada com idempotência.
- `packages/pkg-domain/src/planning/get-calendar-period-range.function.ts` deriva os intervalos de lista, mês e semana.
- `packages/pkg-domain/src/planning/list-calendar-entries.function.ts` filtra e ordena a projeção local.
- `packages/pkg-application/src/commands/create-calendar-entry.command-handler.ts` e `queries/list-calendar-entries.query-handler.ts` expõem CQRS.
- `packages/pkg-adapter-data-v1/src/adapters/progress/dexie/` persiste e consulta a projeção pelo workspace Dexie.
- `packages/pkg-domain/src/planning/calendar-entries.function.test.ts` cobre criação, idempotência, mês e semana.

### Limites

Não há iCal, integração, notificação, recorrência, exceção de ocorrência, drag-and-drop ou tela própria nesta fatia. Esses comportamentos exigem contratos adicionais e não são inferidos a partir de uma data simples.

## M3-UC-005 — lembrete interno e preferência explícita

O lembrete deste recorte é uma indicação local para retomar estudo ou revisão. Ele não solicita permissão do sistema operacional, não envia notificação externa e não cria um calendário paralelo.

### Contrato

`ReminderPreference` possui três valores explícitos:

| Valor     | Comportamento local                                     |
| --------- | ------------------------------------------------------- |
| `yes`     | permite exibir lembretes internos quando houver suporte |
| `not-now` | mantém os lembretes desativados por enquanto            |
| `never`   | mantém os lembretes desativados                         |

A preferência legada booleana `true` é normalizada para `yes`. Valores legados falsos, ausentes ou inválidos são normalizados para `not-now`, preservando uma migração segura e sem ativação inesperada.

### Comportamento

1. A preferência padrão é `not-now`; o app não liga lembretes sem decisão explícita da Pessoa.
2. A ação de alternância percorre `yes`, `not-now`, `never` e retorna a `yes` ao completar o ciclo.
3. Somente `yes` habilita a visibilidade de lembretes internos na área de estudo.
4. `not-now` e `never` permanecem distintos para que a intenção da Pessoa não seja perdida, mesmo que ambos não exibam lembretes no recorte atual.
5. A preferência é persistida no armazenamento local existente e não altera conteúdo editorial, agenda externa ou permissões do dispositivo.

### Evidência

- `packages/pkg-domain/src/models/reminder-preference.type.ts` define o vocabulário explícito.
- `packages/pkg-domain/src/preferences/is-reminder-enabled.function.ts` centraliza a regra de ativação.
- `packages/app/src/features/preferences/normalize-reminder-preference.function.ts` preserva valores válidos e compatibilidade com a preferência booleana antiga.
- `packages/app/src/features/preferences/get-next-reminder-preference.function.ts` implementa o ciclo de escolha.
- `packages/app/src/features/preferences/preferences.view-model.ts` expõe a escolha como estado da apresentação e mantém a persistência local via porta existente.
- `packages/app/src/features/my-study/get-my-study-feature-visibility.function.ts` usa a regra de domínio para decidir a visibilidade.
- `packages/app/src/features/preferences/get-default-preferences.function.test.ts` e `packages/app/src/features/my-study/get-my-study-feature-visibility.function.test.ts` cobrem o padrão seguro e a visibilidade desativada.

### Limites

Este recorte não implementa scheduler, push, notificação do sistema, recorrência, tela de lembretes, calendário externo ou permissão do navegador. A experiência visual e os controles completos entram em `M3-UI-001`.

## M3-UI-001 — shell e telas locais do Patinete

O shell existente passa a reunir o fluxo pessoal e a agenda local sem criar uma navegação paralela. A captura rápida continua no espaço pessoal, enquanto a agenda possui uma rota própria e lazy-loaded para não aumentar a carga inicial da SPA.

### Fluxos cobertos

- `Meu espaço`: captura, notas, checklists, pendências e referências permanecem no shell principal.
- `Agenda`: consulta local por dia, semana ou mês a partir de uma data de referência.
- Captura/compromisso: formulário curto com título, descrição, início e fim opcional.
- Estados alternativos: loading, erro recuperável, lista preenchida e vazio local.
- Preferências: permanece no mesmo shell e controla as capacidades opcionais sem sair do dispositivo.

### Evidência

- `packages/app/src/features/calendar/calendar-view.component.tsx` mantém loading e erro no nível da agenda.
- `packages/app/src/features/calendar/calendar.view-model.ts` coordena consulta, criação e seleção de período.
- `packages/app/src/features/calendar/use-calendar-entries-query.hook.ts` usa uma chave TanStack Query estável por visão e data.
- `packages/app/src/features/calendar/use-create-calendar-entry-mutation.hook.ts` grava localmente e invalida somente as consultas da agenda.
- `packages/app/src/features/calendar/calendar-ready-view.component.tsx` compõe cabeçalho, controles, formulário e conteúdo vazio/lista.
- `packages/app/src/lazy-views.config.ts` carrega a agenda sob demanda e `packages/app/src/components/create-shell-navigation-links.function.ts` a mantém na navegação lateral.

### Limites

O detalhe de uma Captura continua representado pelos editores locais existentes; esta fatia não adiciona modal, drag-and-drop, notificação ou integração externa. A revisão de teclado, densidade e retomada permanece em `M3-UI-002` e `M3-UI-003`.

## M3-UI-002 — formulários locais tolerantes ao teclado

Os formulários de captura, nota, checklist, referência e agenda mantêm os valores no estado da tela até a confirmação local. Campos essenciais são marcados como obrigatórios e o botão de criação permanece desabilitado enquanto a entrada mínima não estiver preenchida. Isso evita perda silenciosa da entrada em viewport estreito e fornece uma indicação imediata do próximo passo.

### Evidência

- `study-capture-create-fields.component.tsx`, `personal-note-create.component.tsx`, `study-checklist-create.component.tsx`, `personal-reference-create.component.tsx` e `calendar-entry-form.component.tsx` aplicam validação contextual mínima e preservam a entrada.
- Os campos de criação foram separados em componentes de entrada próprios para manter a composição curta e facilitar foco, teclado virtual e manutenção por tipo de formulário.

### Limites

Validação de formato rico, debounce assíncrono, upload, autocomplete e sincronização ficam fora do Patinete. A validação continua local e não depende de rede.

## Próximas tarefas desbloqueadas

- Adicionar a UI dessas transições somente em `M3-UI-001`, depois de validar os estados locais.
- Adicionar índices locais somente em `M3-INFRA-001`, depois que a tela demonstrar necessidade real.

## Limites da observação

Esta decisão não implementa banco, tela, scheduler, índice ou notificação. Ela registra o comportamento esperado para que as próximas fatias tenham uma linguagem e uma transição de estados verificáveis.
