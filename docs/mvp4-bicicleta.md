# MVP4 — Bicicleta

## Primeiro slice: relações pessoais tipadas

O primeiro slice do Bicicleta estabelece uma relação local entre registros já existentes sem copiar o conteúdo de nenhum contexto. A relação pertence ao contexto de Conhecimento Pessoal; os registros apontados continuam pertencendo aos seus contextos proprietários.

O slice é deliberadamente pequeno: ele define o contrato, persiste a relação, permite arquivá-la/restaurá-la, consulta por tipo ou endpoint e oferece um composer local genérico. A UI de backlinks navegáveis, árvore, board, lentes e abertura de origem ainda é uma fatia posterior.

## Linguagem ubíqua

| Termo            | Significado canônico                                               | Representação atual                                            | Não significa                      |
| ---------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- | ---------------------------------- |
| `Âncora`         | vínculo que prende uma referência pessoal a um ponto identificável | `PersonalRelationKind = "anchor"`                              | cópia do conteúdo de origem        |
| `Backlink`       | relação navegável entre dois registros pessoais                    | `PersonalRelationKind = "backlink"`                            | histórico remoto ou link externo   |
| `Referência`     | registro pessoal que aponta para uma fonte ou material             | `PersonalReference` e endpoint `reference`                     | material editorial duplicado       |
| `Relação tipada` | vínculo com tipo, origem, destino, identidade e ciclo de vida      | `PersonalRelation`                                             | associação implícita por texto     |
| `Dependência`    | vínculo que indica que um registro depende de outro                | `PersonalRelationKind = "depends-on"`                          | automação que altera dados sozinha |
| `Evidência`      | registro que sustenta uma conclusão de estudo                      | tentativa, sessão, progresso ou diagnóstico existentes         | relação criada automaticamente     |
| `Progresso`      | estado derivado das evidências de estudo                           | modelos de progresso existentes                                | propriedade da relação             |
| `Lente`          | visão local sobre a mesma fonte de registros                       | projeção de apresentação, sem entidade concorrente neste slice | cópia ou fork do conteúdo          |

Os nomes existentes no domínio prevalecem: `PersonalNote`, `PersonalReference`, `StudyCapture`, `StudyChecklist`, `StudyGoal`, `CalendarEntry`, `AttemptRecord`, `StudySession` e `ReviewTarget` continuam sendo as entidades e registros canônicos. `PersonalRelation` apenas conecta identificadores e não substitui nenhum deles.

## Ownership e bounded contexts

| Registro                                    | Contexto proprietário            | O que a relação pode fazer                                               |
| ------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| `note`, `checklist`, `capture`, `reference` | Conhecimento/Organização Pessoal | apontar, ancorar, listar, arquivar e restaurar o vínculo                 |
| `activity`                                  | Organização Pessoal              | ser apontada como destino ou origem, sem copiar a atividade              |
| `topic`                                     | Estudo/Conhecimento              | ser referenciado por identificador estável, sem ser editado pela relação |

`PersonalWorkspace` armazena as relações locais porque é o agregado de persistência que já contém os registros pessoais. A propriedade `relations` é opcional para preservar workspaces anteriores. O adapter Dexie lê e grava o workspace; o domínio não conhece IndexedDB, Dexie ou SQL.

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

Os endpoints aceitam somente os tipos pessoais e de estudo explicitamente conhecidos: `activity`, `capture`, `checklist`, `note`, `reference` e `topic`. A direção é preservada em `source` e `target`; relações inversas devem ser criadas explicitamente, nunca inferidas silenciosamente.

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

`PersonalRelationsSection` oferece a primeira superfície de uso: seleciona o tipo da relação, recebe endpoints tipados, lista os vínculos do workspace, abre a origem no contexto proprietário e permite arquivar ou restaurar. Para registros pessoais, a abertura usa um hash estável no espaço pessoal; para tópicos, usa a rota de tópico. O composer usa somente componentes do pacote de UI e não abre diretamente IndexedDB, SQL ou adapters.

Essa superfície ainda não oferece breadcrumb, filtro de contexto ou representação visual detalhada do estado resolvido. Um endpoint ausente continua abrindo o contexto previsto, onde a aplicação poderá exibir o estado ausente sem apagar a relação.

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
- `packages/app/src/features/personal/personal-relations-section.component.tsx`
- `packages/app/src/features/personal/personal-relation-composer.component.tsx`
- `packages/app/src/features/personal/get-personal-relation-endpoint-path.function.ts`
- `packages/app/src/features/personal/get-personal-relation-endpoint-path.function.test.ts`

## Limites deste slice

Ainda não estão implementados: backlinks navegáveis na UI, abertura de origem, criação por seleção de texto, árvore, board, lentes persistidas, reindexação de relações, progresso conectado, exercícios associados e visualizações gráficas. A resolução de origem já existe no domínio, mas ainda não foi conectada a uma representação visual ou navegação. Essas capacidades permanecem próximas na fila do MVP4; colaboração, sincronização, plugins, IA, OCR e integrações continuam em `FUTURE`.
