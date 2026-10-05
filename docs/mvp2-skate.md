# MVP2 — Skate

## M2-DOM-001 — problema local prioritário

### Problema

Uma pessoa quer transformar um intervalo curto e imprevisível em estudo efetivo, mesmo quando está sem rede. O principal atrito não é a falta de conteúdo: é não saber qual é o próximo passo, perder o ponto em que parou e não ter confirmação de que a tentativa foi registrada.

### Primeiro cenário de estudo

1. A pessoa abre a PWA sem rede.
2. A Home mostra o próximo passo local disponível ou orienta a escolher uma trilha.
3. A pessoa abre uma trilha e escolhe uma lição disponível.
4. A lição apresenta uma unidade curta de teoria ou exemplo.
5. A pessoa responde uma questão.
6. O sistema registra a tentativa e o progresso no armazenamento local.
7. A pessoa vê o resultado e pode retornar à lição, seguir para a próxima atividade ou encerrar.
8. Ao fechar e reabrir a PWA, o próximo passo e o registro permanecem disponíveis.

### Hipótese do produto

Se uma pessoa conseguir completar esse ciclo sem conta, backend ou rede, então o produto já entrega uma unidade de valor observável: estudar, praticar e retomar sem perder o estado local.

### Evidências no produto

- `packages/app/src/features/my-study`: Home, próximo passo, progresso e retomada.
- `packages/app/src/features/courses`: trilha, módulos e itens estudáveis.
- `packages/app/src/features/lessons`: leitura de lição e progresso local.
- `packages/app/src/features/exercises`: questão, tentativa, feedback e sessão de prática.
- `packages/pkg-adapter-data-v1`: conteúdo local e persistência do progresso.

### Critérios de aceite

- O cenário pode ser executado com a rede desabilitada depois que a aplicação e o conteúdo sintético foram carregados.
- A resposta da questão gera uma tentativa local sem depender de uma API.
- Recarregar a página não apaga a sessão, a tentativa nem o progresso observável.
- Cada falha fica isolada no nível da informação afetada e não impede a Home de renderizar o restante do fluxo.
- O cenário não pressupõe conta, sincronização, colaboração, IA, OCR, plugin ou conteúdo editorial publicado.

### Limites desta decisão

- Uma única pessoa e um único contexto local.
- Uma questão por vez no ciclo mínimo.
- Conteúdo sintético ou já empacotado localmente.
- Recomendações simples e determinísticas.
- Revisão, calendário, colaboração e conteúdo editorial completo permanecem nas fatias posteriores ou em `FUTURE`, conforme o backlog.

## M2-LANG-001 — linguagem ubíqua do Skate

O vocabulário abaixo usa os conceitos já presentes no domínio e na aplicação. Um termo de interface não cria uma entidade nova; quando o nome técnico for diferente, ele é apenas a representação do mesmo contrato.

| Termo canônico | Contrato existente                                                           | Uso válido                                                                   | Uso inválido                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Pessoa         | proprietária dos dados locais                                                | “A pessoa exporta seu progresso.”                                            | “Usuário autenticado” ou “membro” no fluxo local sem conta.                                                                        |
| Contexto       | escopo pessoal de estudo                                                     | “A pessoa estuda dentro de um contexto local.”                               | “Grupo”, “equipe” ou “workspace compartilhado”. `PersonalWorkspace` continua sendo o modelo do espaço pessoal, não uma comunidade. |
| Curso          | `LearningCourse`/`CourseReadModel`                                           | “A pessoa começa um curso e acompanha suas lições.”                          | Usar “trilha” como outra entidade para o mesmo curso.                                                                              |
| Disciplina     | `AcademicDiscipline`                                                         | “A disciplina possui notas e frequência próprias.”                           | Misturar disciplina acadêmica com tópico, curso ou material.                                                                       |
| Atividade      | ação de estudo ou organização que pode ser registrada                        | “A atividade foi iniciada e pode gerar uma sessão.”                          | Usar atividade como sinônimo de sessão, nota ou evento externo.                                                                    |
| Nota           | `PersonalNote`                                                               | “A pessoa cria uma nota privada.”                                            | Tratar nota como tentativa, resposta ou nota acadêmica. A nota acadêmica permanece uma `AcademicGrade`.                            |
| Sessão         | `StudySession` ou `FocusSession`, sempre com qualificativo quando necessário | “Sessão de estudo” registra prática; “sessão de foco” registra foco e pausa. | Usar uma sessão como sinônimo de curso, atividade ou tentativa.                                                                    |
| Tópico         | tópico de conhecimento referenciado pelo conteúdo                            | “A questão está ligada a um tópico.”                                         | Criar um tópico concorrente para cada curso, lição ou lente.                                                                       |
| Material       | recurso ou referência de estudo                                              | “O material pode estar disponível localmente ou apontar para uma fonte.”     | Prometer download de uma fonte externa ou tratar material como conteúdo editorial duplicado.                                       |

### Regras de linguagem

- `Curso` é o termo canônico do MVP2 para `LearningCourse`; `Trilha` não será criada como entidade ou port diferente.
- `Sessão de estudo` e `sessão de foco` são conceitos diferentes e precisam do qualificativo na UI quando houver ambiguidade.
- `Nota` pessoal e `nota` acadêmica não são o mesmo conceito; a segunda deve ser chamada de `nota acadêmica` quando aparecer fora do contexto acadêmico.
- `Material` é uma referência de estudo; abrir uma fonte não significa incorporá-la ao banco editorial.
- `Tópico` é reutilizável e não deve ser duplicado por curso, lente ou tela.
- Nenhum termo desta decisão pressupõe conta, grupo, membro, servidor, sincronização ou publicação.

## M2-CTX-001 — ownership do primeiro fluxo

O primeiro fluxo atravessa duas responsabilidades de domínio e duas fronteiras técnicas. O contexto de Estudo e Aprendizagem possui o que representa aprendizagem e evidência de aprendizagem. O contexto de Preferências, Controle e Continuidade possui o escopo local e as políticas de retenção, restauração e privacidade. Apresentação e adapters não são contextos de domínio: a primeira projeta dados para a interface, e os segundos implementam portas.

| Dado ou decisão                      | Bounded context proprietário          | Forma no Skate                                                           | Relação permitida                                                              |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Pessoa e propriedade local           | Preferências, Controle e Continuidade | metadado de propriedade local, sem conta ou identidade remota            | governa escopo e privacidade; não vira membro ou usuário autenticado           |
| Contexto local de estudo             | Preferências, Controle e Continuidade | escopo local que identifica a origem da sessão e dos registros           | referencia Curso e progresso; não duplica o conteúdo do Curso                  |
| Curso e sua estrutura                | Estudo e Aprendizagem                 | `LearningCourse` e `CourseReadModel` vindos do snapshot local            | pode ser referenciado por Home, plano e sessão por identificador               |
| Lição, Tópico e Questão              | Estudo e Aprendizagem                 | read models de conteúdo disponíveis localmente                           | pertencem ao snapshot SQLite; não são recriados em notas ou atividades         |
| Material estudável                   | Estudo e Aprendizagem                 | referência ao material local associado à lição ou questão                | pode ser exibido pela apresentação, sem acesso direto ao banco pelo UI         |
| Sessão de estudo                     | Estudo e Aprendizagem                 | `StudySession`, com estado retomável e vínculo com o Curso/Lição/Questão | registra o ciclo de estudo; não é uma sessão de foco nem uma Atividade pessoal |
| Tentativa de questão                 | Estudo e Aprendizagem                 | `AttemptRecord`, append-only e vinculada a uma sessão                    | alimenta resultado, diagnóstico e domínio; não altera o conteúdo editorial     |
| Progresso de lição                   | Estudo e Aprendizagem                 | `LessonProgressRecord`, derivado das evidências locais                   | pode ser recalculado sem apagar tentativas                                     |
| Domínio e revisão                    | Estudo e Aprendizagem                 | projeções locais de domínio e `ReviewTarget` quando disponíveis          | dependem de tentativas e progresso; o scheduler não é dono do conteúdo         |
| Próximo passo da Home                | Apresentação                          | read model calculado a partir de Curso, sessão e progresso               | não é fonte de verdade e não cria uma cópia concorrente                        |
| Estado de carregamento, vazio e erro | Apresentação                          | estado da consulta ou da ação no nível da informação afetada             | não contamina entidades ou ports de domínio                                    |
| SQLite editorial                     | Adapter de conteúdo                   | fonte local somente leitura do snapshot de conteúdo                      | implementa portas; não possui regras de aprendizagem                           |
| IndexedDB/Dexie                      | Adapter de persistência               | fonte autoritativa do estado pessoal local                               | implementa portas; não é acessado diretamente pela apresentação                |

### Regras de ownership

- O snapshot SQLite é a fonte de conteúdo editorial do Skate; o IndexedDB é a fonte autoritativa de tentativas, sessões e progresso da pessoa.
- `CourseReadModel`, `LessonReadModel` e demais read models pertencem à aplicação como projeções; não são novas entidades concorrentes do domínio.
- A Home consulta projeções dos contextos proprietários. Ela não grava Curso, Sessão, Tentativa ou Progresso diretamente.
- Notas, atividades pessoais, calendário, disciplina acadêmica e foco permanecem fora do primeiro fluxo; se forem adicionados depois, referenciarão entidades de Estudo por identificador estável.
- Um adapter não pode importar a implementação concreta de outro adapter. A composição conecta ports e adapters sem mover ownership para a infraestrutura.
- Ausência de conteúdo editorial não apaga progresso pessoal: o estado deve ser preservado e a apresentação deve informar a referência indisponível no nível afetado.

## M2-MODEL-001 — modelo mínimo do Skate

Esta decisão descreve o modelo que o primeiro fluxo pode usar sem criar entidades concorrentes. Ela consolida os contratos existentes; não altera os tipos nesta etapa.

### Identificadores

| Elemento                       | Identificador canônico                                       | Regra                                                                                                     |
| ------------------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Conteúdo editorial             | `ContentKey` (`course:`, `lesson:`, `topic:` ou `question:`) | é estável entre sessões e versões compatíveis do snapshot; nunca usar o título como identidade            |
| Curso, lição, tópico e questão | `ContentKey`                                                 | pertencem ao snapshot SQLite e são somente leitura no Skate                                               |
| Sessão de estudo               | `StudySession.id`                                            | é gerado localmente, não depende de conta e permanece estável após pausa, fechamento e recarregamento     |
| Tentativa                      | `AttemptRecord.id`                                           | é gerado localmente; a tentativa referencia a sessão por `sessionId` e o conteúdo por `contentKey`        |
| Progresso de lição             | `LessonProgressRecord.contentKey`                            | há no máximo um estado vigente por conteúdo; tentativas históricas não são sobrescritas por esse registro |
| Escopo da pessoa               | armazenamento local da instalação                            | o Skate não cria `User`, identidade remota ou membro; o contexto é o escopo privado do banco local        |

Não será criado um `Trilha` ou `Contexto` concorrente para representar o Curso. Quando um registro pessoal precisar apontar para conteúdo, ele usará o `ContentKey` existente. IDs de banco, índices Dexie e posição visual não são identidades de domínio.

### Estados

| Elemento            | Estados do Skate                                                                         | Transições permitidas                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Sessão de estudo    | `active`, `paused`, `completed` (`StudySessionStatus`)                                   | `active → paused`, `active → completed`, `paused → active`, `paused → completed`; `completed` é terminal |
| Progresso de lição  | ausente = não iniciado; `completed: false` = em andamento; `completed: true` = concluído | não iniciado → em andamento → concluído; reabrir não apaga a evidência anterior                          |
| Tentativa           | respondida ou não respondida, indicada por `answeredAt` e `isCorrect`                    | uma tentativa persistida é histórica; nova resposta gera outra tentativa, não reescreve a anterior       |
| Conteúdo            | disponível, ausente ou inválido no snapshot local                                        | indisponibilidade do conteúdo bloqueia somente a informação dependente e preserva progresso local        |
| Recuperação da tela | carregando, pronto, vazio, erro recuperável ou indisponível                              | a falha deve ser localizada na consulta/ação afetada, com retry ou continuidade manual quando possível   |

`LearningState` (`unseen`, `learning`, `practicing`, `mastered`) e `ReviewState` pertencem às projeções de domínio e revisão. O Skate pode exibi-los quando já existirem dados, mas não exige que a primeira sessão invente um cálculo de domínio ou um scheduler.

### Timestamps e duração

- `startedAt`, `completedAt` e `answeredAt` são strings ISO 8601 em UTC, como já usado pelos registros locais.
- `startedAt` é obrigatório para uma sessão iniciada; `completedAt` só existe quando a sessão chega a `completed`.
- `answeredAt` é obrigatório para uma tentativa considerada respondida; `elapsedMs` e `durationMs` são inteiros maiores ou iguais a zero.
- `completedAt` nunca pode anteceder `startedAt`; `answeredAt` nunca pode anteceder o início da sessão vinculada.
- `updatedAt` identifica a versão mais recente de um estado mutável de progresso, quando o store o possuir; não substitui timestamps históricos de tentativas.
- `dueAt` somente será usado por `ReviewTarget` quando a revisão entrar no fluxo; não é requisito para concluir a primeira sessão.
- O snapshot editorial mantém seus próprios metadados (`contentVersion`, `schemaVersion` e `generatedAt`), sem misturá-los aos tempos de estudo da pessoa.

### Invariantes

1. Toda tentativa do primeiro fluxo referencia exatamente uma questão, uma sessão e um `ContentKey` válido.
2. Uma tentativa histórica não é editada para corrigir uma nova resposta; uma nova tentativa preserva a sequência por `attemptNumber`.
3. Uma sessão pausada pode ser retomada depois de fechar ou recarregar a PWA sem perder `currentIndex`, questões respondidas ou questões puladas.
4. Uma sessão concluída não aceita novas respostas; para continuar o estudo, inicia-se outra sessão ou retoma-se um fluxo ainda ativo.
5. A conclusão de uma lição atualiza sua projeção de progresso, mas não apaga tentativas, diagnósticos ou referências ao conteúdo.
6. Remover ou atualizar o snapshot editorial não apaga registros pessoais; uma referência ausente aparece como indisponível e pode ser recuperada quando o conteúdo voltar.
7. Escritas repetidas com o mesmo identificador são idempotentes ou rejeitadas de maneira explícita; nunca geram duas sessões ou duas tentativas com a mesma identidade.
8. Dados de uma sessão, tentativa ou progresso permanecem no escopo local da pessoa; o Skate não os publica, sincroniza ou envia automaticamente.
9. Uma falha em conteúdo, progresso ou revisão não impede a renderização de consultas independentes da Home.
10. O estado de domínio não é inferido apenas da leitura da teoria: estudo, prática e domínio continuam evidências distintas.

### Evidência no código

- `packages/pkg-domain/src/models/content-key.type.ts` define as chaves de conteúdo.
- `packages/pkg-application/src/models/study-session.interface.ts` e `study-session-status.type.ts` definem a sessão e seus estados.
- `packages/pkg-domain/src/models/attempt-record.interface.ts` define tentativa, vínculo de sessão, sequência e timestamps.
- `packages/pkg-domain/src/models/lesson-progress-record.interface.ts` define a projeção de progresso da lição.
- `packages/pkg-domain/src/models/domain.enums.ts` define `LearningState`, `ReviewState`, `ReviewTargetType`, diagnóstico e confiança.
- `packages/pkg-adapter-data-v1/src/storage/progress.database.ts` preserva índices e migrações locais de sessões, tentativas, progresso e revisão.

## M2-UC-001 — iniciar Curso no contexto local

### Decisão de linguagem

O nome do caso de uso é `Iniciar Curso`. “Criar contexto/trilha” descreve a necessidade de produto, mas não cria uma entidade concorrente: o Curso já é o conceito canônico, e o registro de matrícula estabelece a associação privada da Pessoa com esse Curso no armazenamento local.

### Comando

| Elemento          | Definição                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Ator              | Pessoa, sem conta e sem identidade remota                                                                          |
| Intenção          | iniciar um Curso localmente ou retomar um Curso já iniciado                                                        |
| Entrada           | `EnrollCourseInput`, com `contentKey` do Curso e dados locais opcionais (`courseId`, `slug`, `title`, `startedAt`) |
| Handler           | `EnrollCourseCommandHandler`                                                                                       |
| Port              | `EnrollCoursePort.execute(input)`                                                                                  |
| Adapter permitido | adapter de progresso local que persiste no store IndexedDB/Dexie                                                   |
| Efeito externo    | nenhum; rede, autenticação e sincronização não fazem parte do caso de uso                                          |

### Pré-condições

1. A aplicação possui um Curso resolvido pelo `GetCoursePort` ou por uma seleção equivalente do catálogo local.
2. O `contentKey` identifica um Curso (`course:<identificador>`) e não uma lição, questão ou plano.
3. O Curso pode estar disponível no snapshot local; se não estiver, o caso de uso não inventa um registro editorial.
4. O armazenamento de progresso está disponível para escrita.
5. Se já existir matrícula para o mesmo `contentKey`, a operação é tratada como retomada idempotente, não como uma segunda matrícula.

### Pós-condições de sucesso

1. Existe um único registro de matrícula local para o `contentKey` do Curso.
2. O registro possui `startedAt`; quando fornecido, o timestamp recebido é preservado, e quando ausente é criado pelo adapter local.
3. Dados pessoais de sessão, tentativa e progresso existentes continuam intactos.
4. A consulta de matrícula pode indicar que o Curso foi iniciado, permitindo que a UI ofereça “continuar” em vez de “começar”.
5. A invalidação de cache pertence à camada de apresentação/composição; o handler não conhece TanStack Query nem componentes.
6. Repetir o comando não duplica o registro nem reinicia silenciosamente o início do Curso.

### Falhas e recuperação

| Falha                                              | Resultado obrigatório                                               | Recuperação na interface                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Curso não encontrado no catálogo local             | nenhuma matrícula é criada                                          | informar que o Curso está indisponível e permitir voltar ou tentar novamente |
| `contentKey` inválido ou de outro tipo de conteúdo | comando rejeitado antes da escrita                                  | indicar erro de referência sem apagar dados existentes                       |
| IndexedDB/Dexie indisponível                       | não apresentar sucesso falso; progresso anterior permanece intocado | exibir erro no nível da matrícula e oferecer retry/continuidade de leitura   |
| matrícula já existente                             | operação idempotente; não criar duplicata                           | abrir o Curso no estado de retomada                                          |
| falha após a escrita local                         | reconsultar o registro antes de repetir                             | informar estado recuperado ou permitir nova tentativa sem duplicar           |

### Desfazer

Desfazer significa remover a associação de matrícula do Curso, não apagar tentativas, sessões, diagnósticos, favoritos ou progresso relacionados. O comando de desfazer deve ser explícito, local e reversível enquanto a tela permanecer no contexto; refazer deve executar `Iniciar Curso` novamente sobre o mesmo `contentKey`.

O código atual já implementa a escrita idempotente por `contentKey` em `EnrollCoursePort`/`ProgressDatabase.enrollCourse`, mas ainda não expõe uma porta específica para excluir a matrícula. Portanto, a implementação posterior deverá adicionar uma operação de desfazer na camada de aplicação/adapters sem usar `clearProgress` ou apagar o restante do estado local.

### Fluxo observável

```text
catálogo local
  → selecionar Curso
  → Iniciar Curso
  → EnrollCourseCommandHandler
  → EnrollCoursePort.execute
  → IndexedDB/Dexie
  → invalidar consulta de matrícula
  → abrir/retomar Curso
```

O fluxo permanece útil sem rede, e qualquer falha fica restrita à matrícula ou à consulta afetada. O Curso, a sessão e as tentativas continuam sendo conceitos distintos.

### Evidência no código

- `packages/pkg-application/src/models/enroll-course-input.interface.ts` define a entrada do comando.
- `packages/pkg-application/src/ports/enroll-course-port.port.ts` define `execute()` como contrato.
- `packages/pkg-application/src/commands/enroll-course.command-handler.ts` coordena o caso de uso sem conhecer a persistência.
- `packages/pkg-adapter-data-v1/src/adapters/progress/dexie/enroll-course-adapter.adapter.ts` implementa a porta usando o store local.
- `packages/pkg-adapter-data-v1/src/storage/progress.database.ts` grava a matrícula por `contentKey` e `startedAt`.
- `packages/app/src/features/courses/start-course.function.ts` compõe a intenção da UI com o Curso selecionado.

## M2-UC-002 — registrar Atividade ou Nota sem duplicação

“Atividade” e “Nota” são duas intenções diferentes que podem aparecer próximas na experiência, mas não são a mesma entidade. O Skate preserva essa distinção: uma atividade de estudo registra evidência de uma ação de aprendizagem; uma Nota é um registro pessoal editável. Nenhuma tela cria uma cópia concorrente só para exibir o mesmo dado.

### Variante A — registrar Atividade de estudo

| Elemento         | Definição                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Intenção         | registrar que uma ação local de estudo aconteceu                                                   |
| Comando          | `RecordStudyActivityCommandHandler.execute()`                                                      |
| Port             | `RecordStudyActivityPort.execute()`                                                                |
| Entrada do Skate | tipo de atividade permitido pelo fluxo, inicialmente `lesson` ou `question`, e data local opcional |
| Proprietário     | Estudo e Aprendizagem                                                                              |
| Fonte de verdade | registro de estudo/progresso local; a sessão e a tentativa continuam sendo registros próprios      |

Pré-condições:

1. A ação de estudo foi iniciada ou concluída dentro da aplicação local.
2. O tipo da atividade pertence ao vocabulário do Skate; não registrar integração externa ou atividade inventada pela UI.
3. O armazenamento local está disponível.

Pós-condições:

1. Existe uma evidência local da atividade, associada ao conteúdo/sessão quando essa referência estiver disponível.
2. A atividade pode atualizar projeções de Home e progresso, mas não reescreve a questão, a lição ou a tentativa original.
3. Repetir o evento não cria uma entidade paralela em cada tela; a consulta deriva as visões da fonte de estudo.

Falhas:

- se o registro falhar, a UI não apresenta a atividade como salva;
- a falha fica isolada no registro/progresso, preservando o conteúdo e as consultas independentes;
- retry deve ser explícito e seguro contra duplicação;
- ausência de `contentKey` não autoriza a UI a inventar uma referência editorial.

O registro histórico de uma atividade de estudo não deve ser apagado como se fosse uma Nota. Uma correção futura deverá preservar a evidência original e registrar a correção; o Skate não simula exclusão silenciosa.

### Variante B — registrar Nota pessoal

| Elemento            | Definição                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Intenção            | salvar uma anotação privada da Pessoa durante ou fora do estudo                                  |
| Modelo              | `PersonalNote` dentro de `PersonalWorkspace.notes`                                               |
| Port de leitura     | `GetPersonalWorkspacePort.execute()`                                                             |
| Port de escrita     | `SavePersonalWorkspacePort.execute(workspace)`                                                   |
| Proprietário        | Conhecimento Pessoal                                                                             |
| Referência opcional | `contentKey` do Curso, Lição, Tópico ou Questão; a Nota guarda o vínculo, não o conteúdo copiado |

Pré-condições:

1. `title` e `body` não são vazios após a normalização definida pelo formulário.
2. O `id` é gerado localmente e não colide com outra Nota.
3. `createdAt` e `updatedAt` são timestamps ISO 8601 em UTC.
4. `contentKey`, quando presente, aponta para uma referência de conteúdo válida ou é preservado como referência indisponível; nunca é convertido em conteúdo duplicado.

Pós-condições:

1. A Nota é acrescentada uma única vez a `PersonalWorkspace.notes`.
2. As demais notas, checklists, capturas e referências permanecem inalteradas.
3. A Nota pode ser reencontrada por `id` e exibida em mais de uma visão sem cópia concorrente.
4. Editar a Nota altera `updatedAt`; não altera a entidade referenciada nem a evidência de estudo.

Desfazer uma Nota é arquivamento recuperável: `archived: true` remove a Nota das listas ativas sem destruir seu conteúdo. Restaurar retorna a mesma Nota pelo mesmo `id`. Falha ao persistir não deve limpar o formulário nem informar sucesso falso.

### O que não será misturado

- `StudyCapture` é uma captura pessoal e não vira automaticamente `StudyRecord`, `StudySession` ou `PersonalNote`.
- `PersonalNote` não é resposta, tentativa, progresso ou nota acadêmica.
- `StudyRecord` não é um Curso, Lição, Questão ou Nota editável.
- Uma referência `contentKey` é uma âncora; ela não autoriza copiar o objeto editorial para o workspace pessoal.
- A UI pode combinar Atividade e Nota numa mesma tela, mas cada ação chama seu caso de uso e cada consulta retorna sua própria representação.

### Evidência no código

- `packages/pkg-application/src/commands/record-study-activity.command-handler.ts` e `record-study-activity-input.interface.ts` representam a atividade de estudo.
- `packages/pkg-application/src/ports/record-study-activity-port.port.ts` define a porta da atividade.
- `packages/app/src/features/lessons/save-lesson-progress.function.ts` e `submit-question-answer.function.ts` registram atividades após ações de estudo.
- `packages/pkg-domain/src/models/personal-note.interface.ts` define a Nota pessoal.
- `packages/pkg-domain/src/models/personal-workspace.interface.ts` define a coleção proprietária sem duplicar conteúdo editorial.
- `packages/app/src/features/personal/add-personal-note.function.ts` cria a Nota de forma pura.
- `packages/app/src/features/personal/delete-personal-note.function.ts` e `restore-personal-note.function.ts` representam o desfazer recuperável.
- `packages/pkg-application/src/ports/get-personal-workspace-port.port.ts` e `save-personal-workspace-port.port.ts` preservam a fronteira de persistência.

## M2-UC-003 — iniciar, pausar, concluir e retomar Sessão de estudo

### Intenção

Uma Sessão de estudo é o registro retomável do ciclo de aprendizagem da Pessoa. Ela não é uma Sessão de foco, uma Atividade pessoal ou uma tentativa individual. O Skate precisa salvar o estado antes de a pessoa fechar ou recarregar a PWA e recuperar a mesma sessão sem rede.

### Contratos envolvidos

| Elemento              | Contrato/implementação                       |
| --------------------- | -------------------------------------------- |
| Modelo                | `StudySession`                               |
| Estados               | `active`, `paused`, `completed`              |
| Escrita               | `SaveSessionPort.execute(session)`           |
| Leitura individual    | `GetSessionPort.execute(id)`                 |
| Leitura de retomáveis | `ListStudySessionsPort.execute()`            |
| Persistência          | store local de sessões no adapter Dexie      |
| Identidade            | `platform.ids.execute()` no composition root |

### Comandos e transições

| Ação     | Pré-condição                                                  | Mudança                                                                   | Pós-condição                                    |
| -------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- |
| Iniciar  | Curso/Lição/Questão disponível e nenhum estado novo da sessão | cria `id`, `contentKey`, `activityType`, `startedAt` e `status: "active"` | sessão pode ser retomada pelo `id`              |
| Pausar   | sessão `active` e ainda não concluída                         | persiste `status: "paused"` mantendo índice, questões e respostas         | sessão permanece retomável                      |
| Retomar  | sessão `paused` e localizada pelo `id`                        | persiste `status: "active"` sem reiniciar `startedAt` ou apagar respostas | a Pessoa continua do ponto salvo                |
| Concluir | sessão `active` ou `paused`                                   | persiste `completedAt` e `status: "completed"`                            | sessão é histórica e não aceita novas respostas |

As transições válidas são `active → paused`, `active → completed`, `paused → active` e `paused → completed`. `completed` é terminal no Skate. Não há transição implícita de `completed` para `active`; para estudar novamente, cria-se outra sessão vinculada ao mesmo conteúdo.

### Pré-condições gerais

1. A sessão recebe um identificador local estável; a composição é responsável por fornecer o gerador, e o caso de uso não instancia a implementação.
2. `contentKey` identifica o Curso, Lição ou Questão estudado e `activityType` pertence ao vocabulário permitido (`lesson`, `question`, `assessment` ou `review` quando a respectiva tela existir).
3. `startedAt` é um timestamp ISO 8601 UTC válido.
4. Para retomar, a sessão é carregada pelo próprio `id`; a UI não reconstrói o estado a partir de campos espalhados em componentes.
5. O armazenamento local está disponível; nenhuma operação depende de API, conta ou sincronização.

### Pós-condições de sucesso

- Toda pausa e conclusão salva o estado inteiro necessário para retomar: `currentIndex`, `questionKeys`, `answeredQuestionKeys`, `skippedQuestionKeys` e contagem de acertos quando aplicáveis.
- Recarregar ou fechar a PWA não converte silenciosamente uma sessão ativa em uma nova sessão nem apaga o ponto de parada.
- `completedAt` só é gravado ao concluir e nunca antecede `startedAt`.
- `durationMs`, quando calculado, é maior ou igual a zero e não substitui os timestamps históricos.
- Tentativas e progresso são registros relacionados, não campos descartáveis da sessão; salvar uma sessão não apaga nenhuma tentativa.
- A Home e a tela da sessão consultam o mesmo registro local, evitando uma cópia concorrente do estado.

### Fechamento, recarregamento e recuperação

Ao fechar ou recarregar durante uma sessão, o comportamento desejado é preservar uma sessão `active` ou transformá-la explicitamente em `paused` antes de perder o controle da tela. Na reabertura:

1. listar sessões `active` e `paused` locais;
2. oferecer a retomada da sessão mais recente compatível com o contexto;
3. recuperar o índice e as respostas salvas;
4. permitir continuar, pausar novamente ou concluir;
5. não criar uma segunda sessão apenas porque a página foi recarregada.

O hook atual de lição grava um encerramento no desmontar do componente. Essa implementação é evidência de persistência, mas não distingue conclusão intencional de fechamento/recarregamento. A implementação do caso de uso deve mover essa decisão para ações explícitas de pausa/conclusão antes de declarar a retomada completa.

### Falhas e recuperação

| Falha                                     | Resultado obrigatório                               | Continuidade                                                                   |
| ----------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| sessão não encontrada                     | nenhuma sessão nova é inventada para a retomada     | voltar à Lição/Questão e iniciar uma sessão explícita                          |
| IndexedDB indisponível ao salvar          | não informar que o estado foi salvo                 | manter o estado em memória enquanto possível e oferecer retry/contexto de erro |
| registro inválido ou estado impossível    | rejeitar a transição sem apagar o registro anterior | mostrar erro localizado e permitir voltar                                      |
| falha ao carregar uma questão do conteúdo | preservar a sessão e as respostas                   | mostrar indisponibilidade da questão, sem bloquear Home ou outras sessões      |
| tentativa de concluir duas vezes          | operação idempotente                                | manter a sessão concluída sem duplicar evento                                  |

### Desfazer e limites

Pausar é o desfazer operacional de uma sessão em andamento: retira a obrigação de concluir naquele momento e mantém o estado. Concluir não deve ser desfeito por sobrescrita silenciosa, porque a conclusão é evidência histórica. Se a Pessoa quiser estudar novamente, inicia outra Sessão de estudo; correções de histórico ficam fora do Skate.

### Evidência no código

- `packages/pkg-application/src/models/study-session.interface.ts` e `study-session-status.type.ts` definem a sessão e seus estados.
- `packages/pkg-application/src/ports/save-session-port.port.ts`, `get-session-port.port.ts` e `list-study-sessions-port.port.ts` definem as portas de escrita e retomada.
- `packages/app/src/features/exercises/create-question-study-session.function.ts` cria uma sessão ativa com estado inicial explícito.
- `packages/app/src/features/exercises/create-pause-question-study-session-action.function.ts`, `create-resume-question-study-session-action.function.ts` e `create-complete-question-study-session-action.function.ts` representam as transições.
- `packages/pkg-adapter-data-v1/src/storage/progress.database.ts` persiste sessões por `id` no store local.
- `packages/app/src/features/lessons/use-lesson-study-session.hook.ts` demonstra o ponto atual que precisa distinguir desmontagem de conclusão intencional.

## M2-INFRA-001 — portas locais e adapters do Skate

### Direção das dependências

```text
pkg-domain
    ↑
pkg-application (casos de uso, read models e ports)
    ↑
adapters locais (SQLite/sql.js, IndexedDB/Dexie, relógio e IDs)
    ↑
app/composition (tokens, bindings e composição)
    ↑
presentation/MVVM/UI
```

O domínio não conhece UI, React, IndexedDB, Dexie, SQLite, sql.js, TanStack Query ou APIs do navegador. A aplicação conhece apenas modelos de aplicação e ports. Um adapter conhece a tecnologia concreta e implementa uma port; a composição é o único lugar que escolhe e conecta implementações.

### Ports necessárias ao Skate

| Capacidade                    | Port pública                | Fonte/adaptação autorizada                         |
| ----------------------------- | --------------------------- | -------------------------------------------------- |
| Ler Curso                     | `GetCoursePort`             | snapshot SQLite somente leitura via adapter sql.js |
| Ler Lição                     | `GetLessonPort`             | snapshot SQLite somente leitura via adapter sql.js |
| Ler Questão                   | `GetQuestionPort`           | snapshot SQLite somente leitura via adapter sql.js |
| Iniciar Curso                 | `EnrollCoursePort`          | registro local de matrícula via adapter Dexie      |
| Salvar Sessão                 | `SaveSessionPort`           | store `sessions` via adapter Dexie                 |
| Obter Sessão                  | `GetSessionPort`            | store `sessions` via adapter Dexie                 |
| Listar Sessões retomáveis     | `ListStudySessionsPort`     | store `sessions` via adapter Dexie                 |
| Registrar Tentativa           | `RecordAttemptPort`         | store `attempts` via adapter Dexie                 |
| Salvar progresso de Lição     | `SaveLessonProgressPort`    | store `lessonProgress` via adapter Dexie           |
| Registrar atividade de estudo | `RecordStudyActivityPort`   | projeção de estudo via adapter local               |
| Ler workspace pessoal         | `GetPersonalWorkspacePort`  | snapshot local do workspace via adapter Dexie      |
| Salvar workspace pessoal      | `SavePersonalWorkspacePort` | snapshot local do workspace via adapter Dexie      |
| Gerar identificador           | `IdPort`                    | adapter de plataforma fornecido pela composição    |
| Obter horário                 | `ClockPort`                 | adapter de relógio fornecido pela composição       |

Cada port representa uma capacidade pequena e possui `execute()`, com zero ou um argumento. A aplicação não recebe uma classe de banco, uma tabela, um objeto `Dexie`, uma conexão SQLite ou um componente React. `CourseReadModel`, `LessonReadModel` e `QuestionReadModel` escondem a forma física do snapshot.

### Fronteira dos adapters

- O adapter de conteúdo é o único responsável por abrir o snapshot SQLite/sql.js, executar consultas e mapear linhas para read models.
- O adapter de progresso é o único responsável por IndexedDB/Dexie, nomes de stores, índices, upgrades e migrações locais.
- O adapter de plataforma fornece relógio e IDs; não contém regra de Curso, Lição, Tentativa ou Progresso.
- Adapters não importam React, componentes, hooks, TanStack Query ou rotas.
- Um adapter não importa a implementação concreta de outro adapter; quando uma implementação precisa de uma capacidade, recebe um contrato injetado.
- O contrato interno `ProgressDatabaseContract`/`ProgressStorageContract` é detalhe do adapter. Ele não deve ser usado como port de domínio pela UI ou pelos casos de uso.
- O schema do SQLite é detalhe do adapter de conteúdo; `contentKey` e read models são a fronteira estável.
- A persistência do progresso é autoritativa localmente e não é tratada como cache de rede.

### Composition root

`packages/app/src/composition` é responsável por:

1. criar o container e os tokens;
2. criar `ProgressDatabase`, `DexieProgressStore` e o repositório sql.js;
3. injetar dependências nos adapters;
4. registrar uma implementação por port;
5. montar os handlers da aplicação;
6. entregar `ApplicationServices` à camada de apresentação.

Features, view models e componentes só recebem `ApplicationServices` ou handlers/ports de aplicação já compostos. Eles não instanciam banco, store, adapter, relógio concreto ou gerador de IDs.

### Contrato de falhas

- ausência de conteúdo ou registro é um resultado de consulta (`null`/`undefined`) e deve ser renderizada como vazio ou indisponível no nível afetado;
- falha de leitura/escrita local é propagada ao caso de uso e convertida pela apresentação em erro recuperável, sem limpar o estado anterior;
- uma escrita local confirmada não deve depender de uma segunda escrita remota;
- retry deve repetir somente a capacidade que falhou e manter operações independentes disponíveis;
- nenhum adapter pode esconder erro retornando sucesso vazio;
- migrations/índices continuam dentro do adapter e não alteram o contrato dos casos de uso.

### Limite transacional

No Skate, cada escrita é atômica no store que possui o dado. Salvar Sessão, Tentativa, progresso de Lição e Nota são operações distintas e não formam uma transação entre bounded contexts. Se uma ação precisar atualizar mais de um registro no futuro, a aplicação deverá declarar a unidade de trabalho explicitamente; a UI não usará `db.transaction()`.

### Evidência no código

- As ports públicas estão em `packages/pkg-application/src/ports`.
- O repositório de conteúdo sql.js e os adapters de progresso Dexie estão em `packages/pkg-adapter-data-v1`.
- `packages/pkg-adapter-data-v1/src/storage/progress.database.ts` concentra schema e migrações do IndexedDB sem expor Dexie à aplicação.
- `packages/app/src/composition` registra tokens e implementações concretas no composition root.
- `docs/architecture.md` registra a separação View → ViewModel → Use case → Port → Adapter.

## M2-UI-001 — shell visual comum do Skate

O shell comum já está concentrado no pacote `pkg-ui`, e a aplicação o compõe sem importar MUI diretamente. A primeira versão do Skate usa a mesma gramática no desktop e no mobile, mudando a composição de navegação conforme a largura.

### Kit comum

| Necessidade                  | API visual adotada                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| superfície/base da aplicação | `UIPageSurface`, `UIPageContent` e `UICssBaseline`                                                                             |
| grid e composição            | `UIGrid`, `UICatalogCardGrid`, `UIMetricGrid`, `UIQuickAccessGrid`, `UITwoColumnLayout`                                        |
| tipografia                   | `UITypography`, `UICodeText` e tema Roboto Slab                                                                                |
| superfície, borda e sombra   | `UICard`, `UIPaper`, `UIContentSurface`, `UISelectableSurface` e tokens do tema                                                |
| ações                        | `UIButton`, `UIIconButton`, `UIStartAlignedButton` e `UIInlineActions`                                                         |
| campos                       | `UITextField`, `UIResponsiveFields`, `UIForm` e `UIFileInput`                                                                  |
| agrupamento                  | `UIContentGroup`, `UIStack`, `UIStartAlignedRow`, `UISplitContentRow` e `UIInlineActions`                                      |
| status                       | `UIAlert`, `UIContentAlert`, `UIOfflineStatusChip`, `UIChip`, `UILinearProgress` e `UICircularProgress`                        |
| navegação                    | `UIAppBar`, `UIToolbar`, `UIHeaderBrand`, `UIResponsiveNavigationDrawer`, `UIListItemButton` e `UIBottomNavigation`            |
| foco e leitura               | `UICssBaseline`, estados nativos dos controles, `aria-live` nos estados de conteúdo e `main-content` como destino de navegação |
| estados alternativos         | `UIContentLoadingLayout`, `UIContentLoadingLabel`, `UIContentAlert`, `UIContentNotFoundState` e `UIErrorMessage`               |

### Composição do shell

- No desktop, `UIAppBar` permanece acima da navegação e `UIResponsiveNavigationDrawer` é recortado sob a barra, sem cobrir o header.
- No mobile, a sidebar é ocultada e `UIBottomNavigation` fornece as tabs de acesso rápido com área segura inferior.
- O header mantém apenas a marca, busca/command palette e estado offline; os destinos de navegação ficam na sidebar ou nas tabs.
- `UIPageContent` reserva espaço para a sidebar no desktop e para as tabs no mobile, evitando conteúdo atrás da navegação fixa.
- Os itens de navegação recebem ícone, rótulo, seleção e destino a partir de uma lista única; desktop e mobile não duplicam a fonte de links.

### Regras do kit

1. MUI, Emotion, HTML estrutural e regras de layout de baixo nível ficam encapsulados no `pkg-ui`.
2. A aplicação consome componentes com prefixo `UI` e não define `sx`, `style`, `className` ou geometria estrutural para corrigir um componente individual.
3. Espaçamento entre irmãos pertence ao pai e usa tokens/gap do kit; `margin` não é usado como correção de alinhamento em features.
4. Cards equivalentes usam grids sem flex-wrap estrutural e mantêm largura, altura e alinhamento governados pelo container.
5. Bordas, sombras, raio, tipografia e cores semânticas vêm do tema; uma feature não espalha valores visuais concorrentes.
6. Todos os componentes de estado preservam uma saída textual e uma ação de recuperação quando houver falha ou indisponibilidade.

### Evidência no código

- `packages/pkg-ui/src/theme.config.ts` define tipografia, paleta, raio, bordas, sombras e ripple desabilitado.
- `packages/pkg-ui/src/index.ts` expõe somente wrappers `UI*` do pacote visual.
- `packages/app/src/components/shell.component.tsx` compõe header, sidebar, conteúdo e bottom tabs.
- `packages/app/src/components/navigation-drawer.component.tsx` usa a lista de navegação com ícones.
- `packages/app/src/components/mobile-bottom-navigation.component.tsx` reutiliza a mesma lista para tabs móveis.
- `packages/pkg-ui/src/responsive-navigation-drawer.component.tsx` implementa o recorte da sidebar sob o app bar.
- `packages/pkg-ui/src/page-content.component.tsx` reserva o espaço responsivo do conteúdo principal.

## M2-UI-002 — Home, Curso, Disciplina, Atividade e detalhe

As telas do Skate reutilizam o shell e a gramática do kit; não há uma composição visual paralela por feature.

| Superfície          | Rota/feature existente                                         | Composição comum                                                                   |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Home                | `/` e `/meu-estudo`, `features/my-study`                       | `UIContentGroup` de seção, header, feedback, métricas, cards de acesso e progresso |
| Curso               | `/cursos/:slug`, `features/courses`                            | hero do Curso, ação primária, progresso, módulos e itens com grid/lista            |
| Disciplina          | `/academico`, `features/academic`                              | cabeçalho de contexto, formulário, erro localizado, lista e detalhes de cálculo    |
| Atividade pessoal   | `/meu-espaco`, `features/personal`                             | formulário de captura/Nota, seções de registros, lista, arquivamento e restauração |
| Detalhe de conteúdo | `/licoes/:lessonId`, `/questoes/:questionId`, `/topicos/:slug` | carregamento, vazio/indisponível, conteúdo, navegação de retorno e ação contextual |

### Regras de composição aplicadas

- Cada feature fornece um propósito e um contexto antes do conteúdo principal; ações primárias ficam próximas do objeto afetado.
- Seções verticais usam `UIContentGroup` com `gap` semântico; ações irmãs usam `UIInlineActions` ou outro wrapper explícito.
- Formulários usam `UIResponsiveFields`, preservando campos em coluna estreita e alinhando-os em linha quando há espaço.
- Grids de cards usam primitives de grid do `pkg-ui`, `minWidth: 0`, `maxWidth: 100%` e fechamento de linhas declarado.
- Cards e superfícies não definem largura arbitrária nas features; o container governa sizing e overflow.
- Conteúdo longo usa limites de largura, quebra de palavras e regiões de rolagem declaradas; não há import de MUI, `Box`, `Grid`, `Stack`, `sx` ou `style` nas features alvo.
- A Atividade pessoal continua representada por `StudyCapture`/captura no Meu espaço; não é criada uma tela ou entidade concorrente apenas para satisfazer o rótulo “atividade”.
- Detalhes retornam à origem pelo roteamento existente e preservam a separação entre Curso, Disciplina, Nota, Sessão e conteúdo editorial.

### Verificação arquitetural

O lint atual confirma que as features alvo não importam componentes MUI ou primitives de baixo nível, não definem estilos/spacing próprios e usam somente wrappers públicos de `pkg-ui`. A verificação de geometria em diferentes viewports permanece no item `M2-TEST-002`; esta fatia garante a composição estrutural e os contratos visuais reutilizáveis.

### Evidência no código

- `packages/app/src/features/my-study/my-study-ready-view.component.tsx` compõe a Home com feedback, métricas e seções.
- `packages/app/src/features/courses/course-ready-view.component.tsx` compõe o Curso com hero, progresso e módulos.
- `packages/app/src/features/academic/academic-ready-view.component.tsx` compõe Disciplina/formulário/lista com erro localizado.
- `packages/app/src/features/personal/personal-workspace-ready-view.component.tsx` e `personal-captures-section.component.tsx` compõem Atividade pessoal e registros.
- `packages/app/src/features/lessons`, `features/exercises` e `features/topics` fornecem as telas de detalhe.
- `packages/pkg-ui/src/content-group.component.tsx`, `responsive-fields.component.tsx`, `catalog-card-grid.component.tsx`, `metric-grid.component.tsx` e `quick-access-grid.component.tsx` concentram gap, grid e limites de overflow.

## M2-UI-003 — estados do primeiro fluxo

O primeiro fluxo não trata carregamento ou persistência como um estado global da aplicação. Cada tela mantém o estado no nível da informação que depende dele, preservando as demais áreas disponíveis.

| Estado     | Comportamento observável                                                                                         | Evidência                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| vazio      | conteúdo ausente, lista sem registros ou tópico sem material aparece com mensagem contextual, sem quebrar a tela | componentes `*EmptyState`, `ContentNotFoundState` e estados de listas das features                                    |
| carregando | consultas de conteúdo e progresso exibem `ContentLoadingState`/`UIContentLoadingLayout` no painel afetado        | `ContentLoadingState`, `getQueryViewState` e views de Home, Curso, Lição e Questão                                    |
| erro       | falha de conteúdo ou progresso é apresentada com retry local; consultas independentes continuam renderizando     | `ContentErrorState`, `CourseProgressError`, `LessonProgressError` e `ContentErrorDetails`                             |
| offline    | o shell mantém o chip `Offline`; o estudo continua usando o snapshot local e o IndexedDB quando disponíveis      | `UIOfflineStatusChip`, `NavigationHeader` e adapters locais                                                           |
| salvando   | iniciar Curso, salvar progresso/marcador de Lição e registrar resposta desabilitam a ação e anunciam progresso   | `ActionState`, `useCourseStartAction`, `useLessonProgressAction`, `useLessonBookmarkAction` e `useQuestionSubmission` |
| salvo      | a escrita local confirmada apresenta feedback de sucesso e o resultado da questão permanece disponível           | `ActionFeedback`, `QuestionSubmissionFeedback` e invalidação das queries locais                                       |
| cancelado  | cancelar a restauração volta a um estado explícito sem apagar os dados atuais                                    | `LocalBackupState`, `createCancelLocalBackupAction` e `LocalBackupPanel`                                              |

### Regras de isolamento

- Falha ao carregar o snapshot não remove progresso local nem impede a renderização do shell e das consultas independentes.
- Falha ao salvar Curso, Lição ou Questão não apresenta sucesso falso; o erro permanece junto da ação que falhou e permite nova tentativa.
- Enquanto uma escrita está em andamento, somente a ação correspondente é desabilitada; navegação e leitura continuam disponíveis.
- Cancelar uma restauração limpa a prévia pendente, preserva os stores atuais e informa a decisão no próprio painel.
- O estado salvo representa confirmação local, não sincronização remota nem publicação.
- Toda mensagem de estado possui saída textual e `role="status"`/`role="alert"` quando aplicável.

### Evidência no código

- `packages/app/src/components/action-feedback.component.tsx` centraliza feedback de salvamento, sucesso, cancelamento e erro com i18n.
- `packages/app/src/features/courses/use-course-start-action.hook.ts` expõe o estado da matrícula local do Curso.
- `packages/app/src/features/lessons/use-lesson-progress-action.hook.ts` e `use-lesson-bookmark-action.hook.ts` expõem os estados das escritas da Lição.
- `packages/app/src/features/exercises/use-question-submission.hook.ts` mantém resposta, erro e estado de registro sem apagar a tentativa digitada.
- `packages/app/src/features/my-study/local-backup-state.type.ts` e `create-cancel-local-backup-action.function.ts` tornam o cancelamento explícito.
- `packages/app/src/features/my-study/my-study-view.component.tsx`, `course-view.component.tsx`, `lesson-view.component.tsx` e `question-view.component.tsx` preservam estados de consulta localizados.

### Verificação

- `just format` passou com ESLint e Prettier dentro do container.
- `just typecheck` passou com TypeScript estrito.
- `just test` passou com 67 arquivos e 134 testes.

O teste visual por viewport e a matriz de persistência/retomada continuam nos itens `M2-TEST-001` e `M2-TEST-002`; esta tarefa entrega a modelagem e a renderização dos estados, sem antecipar esses gates.

## M2-UI-004 — acesso responsivo e preferências do sistema

O shell do primeiro fluxo foi validado em larguras estreitas, largas, tablet e desktop. A navegação muda de drawer para bottom navigation sem criar overflow horizontal, e o conteúdo principal mantém um landmark `main` estável.

### Contratos entregues

| Capacidade     | Regra                                                                                                           | Evidência                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| responsividade | abaixo de `md`, o drawer fica oculto e a navegação inferior fica disponível; a partir de `md`, ocorre o inverso | `UIResponsiveNavigationDrawer`, `UIBottomNavigation` e `mvp2-ui004.spec.ts`        |
| toque          | botões, ícones e itens de navegação recebem área mínima de 44 CSS px quando o componente UI controla o alvo     | `theme.config.ts`, overrides de `MuiButton`, `MuiIconButton` e `MuiListItemButton` |
| teclado        | o primeiro foco navegável permanece visível e preserva indicador de foco                                        | `mvp2-ui004.spec.ts`                                                               |
| leitor de tela | o fluxo continua sem violações axe e mantém `main`, navegação e estados anunciáveis                             | `accessibility.spec.ts`, `accessibility-routes.spec.ts` e `mvp2-ui004.spec.ts`     |
| modo escuro    | o tema respeita `prefers-color-scheme` por meio do `ThemeProvider` e de `colorSchemes` claro/escuro             | `theme.config.ts`, `AppThemeProvider` e teste de tema                              |
| fonte ampliada | aumento de 125% no tamanho base não cria overflow horizontal no fluxo inicial                                   | `mvp2-ui004.spec.ts`                                                               |

### Limites

- Não há seletor persistente de tema; a preferência usada nesta fatia é a do sistema.
- Não há auditoria visual de todos os roteiros e breakpoints; isso permanece em `M2-TEST-002`.
- Não há validação de leitor de tela específico ou teste com hardware assistivo; axe e landmarks cobrem o gate automatizado inicial.
- Não há alteração de conteúdo editorial, sincronização, calendário, plugin ou recurso de `FUTURE`.

### Verificação

- `just check` passou com formatação, lint, typecheck, 67 arquivos de teste, 134 testes, 55 testes arquiteturais e convenções de arquivo.
- O teste dedicado cobre 320 px, 430 px, 768 px e 1280 px, além de teclado, axe em modo escuro e fonte ampliada.

## M2-TEST-001 — evidência do ciclo local mínimo

O ciclo mínimo possui cobertura em três níveis, sem alterar o comportamento de produção:

- a regra de domínio de correção de resposta é coberta por `grade-question-answer.function.test.ts`;
- o caso de uso de início de Curso é coberto por `enroll-course.command-handler.test.ts`, verificando que a intenção chega à port sem acoplar o handler ao adapter;
- o armazenamento Dexie é coberto por `progress.test.ts`, incluindo escrita/listagem, reabertura do banco, restauração de sessão interrompida, exportação/importação e preservação de referências a conteúdo indisponível;
- a compatibilidade entre versões é coberta por `progress-migration.test.ts`, que abre um banco legado e verifica a preservação dos registros pessoais.

### Verificação

O conjunto de testes unitários passou com 67 arquivos e 134 testes. O cenário de recuperação da sessão interrompida cria uma nova instância de `ProgressDatabase` sobre o mesmo nome, consulta o registro persistido e confirma a manutenção de `currentQuestionIndex`, conteúdo e estado retomável.

## M2-TEST-002 — roteiro visual responsivo

O roteiro visual automatizado percorre todas as rotas do primeiro fluxo em cinco contextos de viewport:

- mobile estreito: `320 × 812`;
- mobile largo: `430 × 812`;
- tablet: `768 × 900`;
- desktop: `1440 × 900`;
- janela dividida: `640 × 900`.

Cada combinação verifica renderização do root, metadados dos primitives de layout, gaps realizados no DOM, fechamento de grids, alinhamento, uniformidade, overflow horizontal, rótulos sobrepostos e ações estruturais excessivamente largas. O roteiro não altera snapshots nem conteúdo editorial; ele valida as invariantes visuais do Skate diretamente no DOM.

### Verificação

O comando `mvp2:visual:check` executa `mvp2-test002.spec.ts` dentro da imagem Playwright. A suíte percorre as 17 rotas do primeiro fluxo nos cinco viewports, totalizando 85 cenários de composição visual. A execução atual passou em 85/85 cenários após tornar as ações de curso responsivas em larguras estreitas.
