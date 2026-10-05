# MVP4 — Bicicleta

## Primeiro slice: relações pessoais tipadas

O primeiro slice do Bicicleta estabelece uma relação local entre registros já existentes sem copiar o conteúdo de nenhum contexto. A relação pertence ao contexto de Conhecimento Pessoal; os registros apontados continuam pertencendo aos seus contextos proprietários.

O slice é deliberadamente pequeno: ele define o contrato, persiste a relação, permite arquivá-la/restaurá-la, consulta por tipo ou endpoint e oferece um composer local genérico. A mesma fonte agora também alimenta árvore, board e lentes persistidas; reindexação e visualizações gráficas continuam em fatias posteriores.

## Linguagem ubíqua

| Termo            | Significado canônico                                               | Representação atual                                    | Não significa                      |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------- |
| `Âncora`         | vínculo que prende uma referência pessoal a um ponto identificável | `PersonalRelationKind = "anchor"`                      | cópia do conteúdo de origem        |
| `Backlink`       | relação navegável entre dois registros pessoais                    | `PersonalRelationKind = "backlink"`                    | histórico remoto ou link externo   |
| `Referência`     | registro pessoal que aponta para uma fonte ou material             | `PersonalReference` e endpoint `reference`             | material editorial duplicado       |
| `Relação tipada` | vínculo com tipo, origem, destino, identidade e ciclo de vida      | `PersonalRelation`                                     | associação implícita por texto     |
| `Dependência`    | vínculo que indica que um registro depende de outro                | `PersonalRelationKind = "depends-on"`                  | automação que altera dados sozinha |
| `Evidência`      | registro que sustenta uma conclusão de estudo                      | tentativa, sessão, progresso ou diagnóstico existentes | relação criada automaticamente     |
| `Progresso`      | estado derivado das evidências de estudo                           | modelos de progresso existentes                        | propriedade da relação             |
| `Lente`          | visão local sobre a mesma fonte de registros                       | `PersonalLens`, persistida no workspace                | cópia ou fork do conteúdo          |

Os nomes existentes no domínio prevalecem: `PersonalNote`, `PersonalReference`, `StudyCapture`, `StudyChecklist`, `StudyGoal`, `CalendarEntry`, `AttemptRecord`, `StudySession` e `ReviewTarget` continuam sendo as entidades e registros canônicos. `PersonalRelation` apenas conecta identificadores e não substitui nenhum deles.

## Ownership e bounded contexts

| Registro                                    | Contexto proprietário            | O que a relação pode fazer                                               |
| ------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| `note`, `checklist`, `capture`, `reference` | Conhecimento/Organização Pessoal | apontar, ancorar, listar, arquivar e restaurar o vínculo                 |
| `activity`                                  | Organização Pessoal              | ser apontada como destino ou origem, sem copiar a atividade              |
| `goal`                                      | Organização/Estudo               | ser associado por `StudyGoal.contentKey`, sem duplicar a meta            |
| `question`                                  | Estudo                           | ser associado por identificador local, sem editar a questão              |
| `topic`                                     | Estudo/Conhecimento              | ser referenciado por identificador estável, sem ser editado pela relação |

`PersonalWorkspace` armazena as relações locais porque é o agregado de persistência que já contém os registros pessoais. A propriedade `relations` é opcional para preservar workspaces anteriores. O adapter Dexie lê e grava o workspace; o domínio não conhece IndexedDB, Dexie ou SQL.

As lentes também ficam no mesmo workspace, com identificador, nome, visão (`tree` ou `board`), tipos de registro e timestamps. Salvar uma lente altera somente a configuração da perspectiva; notas, capturas, checklists, referências e relações continuam sendo a fonte única.

Uma consulta pode projetar relações de vários contextos, mas não muda a propriedade do registro apontado. A resolução de endpoint distingue `disponível`, `arquivado`, `importado`, `ausente` e `inválido`; a relação agrega isso em estados como `missing-source`, `missing-target`, `imported-source`, `partially-restored` e `active`. Assim, a UI pode informar uma origem ausente ou parcialmente restaurada sem apagar a relação.

## Contrato da relação

```text
PersonalRelation
├── id
├── kind: anchor | backlink | supports | depends-on
├── source: { id, recordType }
├── target: { id, recordType }
├── archived
├── createdAt
└── updatedAt
```

Os endpoints aceitam somente os tipos pessoais e de estudo explicitamente conhecidos: `activity`, `capture`, `checklist`, `goal`, `note`, `question`, `reference` e `topic`. A direção é preservada em `source` e `target`; relações inversas devem ser criadas explicitamente, nunca inferidas silenciosamente.

### Invariantes implementadas

1. O identificador da relação é estável.
2. Uma relação ativa com o mesmo tipo, origem e destino é idempotente.
3. Arquivar remove a relação das consultas ativas sem apagar o registro.
4. Restaurar preserva identidade, endpoints e histórico temporal.
5. Listagens podem filtrar por tipo, endpoint e estado arquivado.
6. A escrita é local e ocorre no mesmo workspace persistido pelo adapter.
7. Nenhum adapter de relação importa outro adapter ou instancia a infraestrutura no construtor.
8. Cada porta expõe somente `execute()` e cada caso de uso é uma classe própria.
9. A resolução não transforma uma origem ausente, importada ou inválida em conteúdo inventado.
10. Relações arquivadas permanecem identificáveis e podem ser restauradas sem trocar seus endpoints.

## Casos de uso disponíveis

- `CreatePersonalRelationCommandHandler`: cria ou reaproveita uma relação ativa.
- `ArchivePersonalRelationCommandHandler`: arquiva uma relação sem apagar o workspace.
- `RestorePersonalRelationCommandHandler`: reativa uma relação arquivada.
- `ListPersonalRelationsQueryHandler`: consulta relações por filtros locais.

Cada caso de uso depende de uma porta da aplicação. A composição do app fornece os adapters Dexie por tokens Inversify; a apresentação ainda não acessa essas portas diretamente.

## UI local do slice

`PersonalRelationsSection` oferece a primeira superfície de uso: seleciona o tipo da relação, recebe endpoints tipados, lista os vínculos do workspace, abre a origem no contexto proprietário e permite desvincular ou restaurar. O tipo `backlink` é apresentado separadamente como `Mencionado em`, preservando a direção `source → target`; a consulta de domínio retorna somente backlinks ativos quando um endpoint-alvo é informado. Para registros pessoais, a abertura usa um hash estável no espaço pessoal; para tópicos, usa a rota de tópico. O composer usa somente componentes do pacote de UI e não abre diretamente IndexedDB, SQL ou adapters.

`PersonalKnowledgeViewsSection` apresenta a mesma coleção local em árvore e board. A árvore mantém a lista de nós e as relações direcionais; o board agrupa os mesmos nós por tipo de registro. `PersonalLens` salva a escolha da visão para reabertura posterior, sem duplicar ou renomear as entidades canônicas.

### Progresso conectado

`PersonalProgressReadModel` projeta evidências locais de sessões, tentativas, metas e atividades usando os identificadores canônicos de conteúdo, tópico e questão. Um vínculo representa a conexão entre a prática e o contexto que a originou; ele não copia nem altera as entidades proprietárias. Sessões, tentativas e atividades sem referência resolvida permanecem nos conjuntos de evidências não vinculadas, para que uma falha parcial não esconda progresso.

`PersonalProgressSection` consulta sessões, tentativas e metas separadamente e renderiza seus estados de carregamento, erro e pronto como uma ilha. A projeção é recalculada no navegador e permanece independente da árvore, dos backlinks e dos registros pessoais; uma consulta indisponível não impede o restante do espaço local de renderizar.

### Seleção persistida entre visões

`usePersonalEntitySelection` mantém uma única seleção por endpoint (`recordType` + `id`) no espaço pessoal. Notas, checklists, pendências, referências, relações, backlinks, árvore e board usam `PersonalEntitySelectionSurface`, permitindo que a mesma entidade permaneça destacada ao alternar a visão ou abrir sua origem. A seleção é uma preocupação de apresentação: não duplica o registro, não altera o domínio e desaparece somente quando o espaço pessoal é desmontado.

As relações agora mostram um breadcrumb local (`Meu espaço / Relações / tipo`), permitem filtrar por contexto (`Todas`, `Notas`, `Tópicos` e `Materiais`) e oferecem navegação para origem e destino. A disponibilidade de cada endpoint é projetada localmente como disponível, arquivado, externo ou ausente; quando ausente, a UI preserva o vínculo e informa que o registro não está neste dispositivo.

## Evidência

- `packages/pkg-domain/src/models/personal-relation.interface.ts`
- `packages/pkg-domain/src/models/personal-relation-kind.type.ts`
- `packages/pkg-domain/src/models/personal-relation-record-type.type.ts`
- `packages/pkg-domain/src/personal/personal-relations.function.test.ts`
- `packages/pkg-application/src/commands/create-personal-relation.command-handler.ts`
- `packages/pkg-application/src/commands/archive-personal-relation.command-handler.ts`
- `packages/pkg-application/src/commands/restore-personal-relation.command-handler.ts`
- `packages/pkg-application/src/queries/list-personal-relations.query-handler.ts`
- `packages/pkg-adapter-data-v1/src/adapters/progress/dexie/personal-relations-adapter.test.ts`
- `packages/pkg-domain/src/personal/resolve-personal-relation.function.ts`
- `packages/pkg-domain/src/personal/resolve-personal-relation.function.test.ts`
- `packages/pkg-domain/src/personal/list-personal-backlinks.function.ts`
- `packages/pkg-domain/src/personal/list-personal-backlinks.function.test.ts`
- `packages/app/src/features/personal/personal-relations-section.component.tsx`
- `packages/app/src/features/personal/personal-backlinks-section.component.tsx`
- `packages/app/src/features/personal/personal-relation-composer.component.tsx`
- `packages/app/src/features/personal/get-personal-relation-endpoint-path.function.ts`
- `packages/app/src/features/personal/get-personal-relation-endpoint-path.function.test.ts`
- `packages/app/src/features/goals/goal-item.component.tsx`
- `packages/pkg-domain/src/models/personal-lens.interface.ts`
- `packages/pkg-domain/src/personal/create-personal-lens.function.ts`
- `packages/pkg-domain/src/personal/create-personal-knowledge-projection.function.ts`
- `packages/pkg-domain/src/personal/create-personal-lens.function.test.ts`
- `packages/app/src/features/personal/personal-knowledge-views-section.component.tsx`
- `packages/app/src/features/personal/personal-knowledge-tree-view.component.tsx`
- `packages/app/src/features/personal/personal-knowledge-board-view.component.tsx`
- `packages/app/src/features/personal/personal-progress-read-model.interface.ts`
- `packages/app/src/features/personal/create-personal-progress-read-model.function.ts`
- `packages/app/src/features/personal/create-personal-progress-read-model.function.test.ts`
- `packages/app/src/features/personal/personal-progress-section.component.tsx`
- `packages/app/src/features/personal/use-personal-progress-queries.hook.ts`
- `packages/app/src/features/personal/use-personal-entity-selection.hook.ts`
- `packages/app/src/features/personal/personal-entity-selection-surface.component.tsx`
- `packages/app/src/features/personal/personal-relation-context-filter-controls.component.tsx`
- `packages/app/src/features/personal/get-personal-relations-for-context.function.ts`
- `packages/app/src/features/personal/get-personal-relation-endpoint-availability.function.ts`
- `packages/app/src/features/personal/personal-relation-endpoint-status.component.tsx`
- `packages/app/src/features/personal/personal-notes-section.component.tsx`
- `packages/app/src/features/personal/personal-checklists-section.component.tsx`
- `packages/app/src/features/personal/personal-captures-content.component.tsx`
- `packages/app/src/features/personal/personal-references-section.component.tsx`
- `packages/app/src/features/personal/personal-backlinks-section.component.tsx`

## Legibilidade de relações densas

O board usa `UIResponsiveGrid` para distribuir colunas em tracks responsivos e manter fechamento de linhas sem scroll horizontal acidental. Identificadores e endpoints são renderizados com `UIWrappedTypography`, que limita a largura e quebra tokens longos antes que sobreponham outras informações.

Evidências:

- `packages/pkg-ui/src/responsive-grid.component.tsx`
- `packages/pkg-ui/src/wrapped-typography.component.tsx`
- `packages/app/src/features/personal/personal-knowledge-board-view.component.tsx`
- `packages/app/src/features/personal/personal-knowledge-relation-row.component.tsx`

## Conexão por portas

O fluxo editorial e visual permanece separado por portas: `ParseEditorialBlocksPort` valida os blocos, `BuildKnowledgeGraphPort` produz o grafo e `GetTopicMapPort` consulta mapas editoriais. A composição registra os adapters concretos; a aplicação expõe handlers CQRS; a apresentação apenas consulta esses handlers e entrega read models ao renderizador.

Evidências:

- `packages/pkg-application/src/ports/parse-editorial-blocks-port.port.ts`
- `packages/pkg-application/src/ports/build-knowledge-graph-port.port.ts`
- `packages/pkg-application/src/ports/get-topic-map-port.port.ts`
- `packages/app/src/composition/create-content-dependencies.composition.ts`
- `packages/app/src/features/lessons/use-lesson-section-content-queries.hook.ts`
- `packages/pkg-ui-content/src/content-renderer.component.tsx`

## Contratos de acessibilidade das visões locais

As superfícies selecionáveis são botões reais, com nome acessível e operação por teclado. A árvore mantém os endpoints em texto e o board publica metadados de grid para auditoria, sem exigir suporte gráfico. O teste de apresentação verifica Enter, fallback textual, fechamento do grid e ausência de `canvas`/`svg` nas visões locais.

Evidência: `packages/app/src/features/personal/personal-knowledge-views.component.test.tsx`.

## Da captura à prática e à revisão

Uma captura com `contentKey` não exige recadastro para continuar o estudo. A superfície da captura resolve somente chaves editoriais suportadas para suas rotas canônicas de questão, aula ou tópico e oferece acesso à fila local de revisão. As ações ficam fora da superfície selecionável, evitando controles interativos aninhados e preservando a seleção pessoal como uma preocupação independente.

Evidências:

- `packages/app/src/features/personal/get-personal-capture-content-path.function.ts`
- `packages/app/src/features/personal/get-personal-capture-content-path.function.test.ts`
- `packages/app/src/features/personal/study-capture-display.component.tsx`

## Limites deste slice

Ainda não estão implementados: criação por seleção de texto, reindexação de relações e visualizações gráficas. Materiais (`PersonalReference`), metas (`StudyGoal`) e exercícios (`Question`) podem ser ligados pelo contrato tipado e abertos no contexto proprietário; a edição dessas fontes continua nos seus próprios contextos. A representação visual usa o estado local disponível e preserva vínculos ausentes sem inventar conteúdo. Colaboração, sincronização, plugins, IA, OCR e integrações continuam em `FUTURE`.
