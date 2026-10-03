# Arquitetura MVVM e Ports & Adapters

O Portal Guesant Saberes usa MVVM funcional sobre uma arquitetura Ports & Adapters. A aplicação permanece uma SPA/PWA estática e local-first.

```text
View React/MUI
    ↓
ViewModel hook
    ↓
Use case
    ↓
Port
    ↓
Adapter
    ↓
sql.js · Dexie · ts-fsrs · APIs do navegador
```

## Responsabilidades

- **View**: renderiza estado e dispara comandos; não conhece SQL, Dexie ou FSRS.
- **ViewModel**: hook funcional tipado; conecta TanStack Query, estado da tela e comandos.
- **Use case**: regra de aplicação testável sem React.
- **Port**: contrato estável que expressa uma capacidade do sistema.
- **Adapter**: implementação concreta para SQLite, IndexedDB, FSRS ou plataforma.
- **Composition root**: cria adapters, use cases e injeta dependências por React Context.

## SOLID e CQRS

Os casos de uso representam a intenção da aplicação e seguem CQRS:

- queries apenas leem read models;
- commands alteram o estado local ou registram uma ação;
- cada caso de uso é uma classe independente com `execute()`;
- cada caso de uso recebe somente o port de que precisa;
- nenhum caso de uso conhece React, Dexie, SQLite, sql.js ou APIs do navegador.

Os ports são segregados por capacidade e expõem uma única operação `execute()`. Por
exemplo, `GetCatalogPort` recebe apenas os filtros do catálogo e
`SaveLessonProgressPort` recebe apenas os dados do progresso. Isso evita repositórios
com dezenas de responsabilidades e permite substituir cada adapter sem alterar os
casos de uso.

Não há container DI externo. Factories explícitas mantêm a inicialização previsível, reduzem magia em runtime e facilitam o build offline.

## Tokens de domínio

Os códigos persistidos e discriminadores compartilhados ficam em
`packages/pkg-domain/src/models/enums.ts`. Eles incluem processos (`ENEM`, `Unicamp` e
`Fuvest`), organizadores (`Comvest`, `Fuvest` e `Inep`), tipos de questão, tipos de
conteúdo, estados de progresso, diagnósticos e avaliações FSRS. Enums não são usados
para títulos, descrições, labels traduzíveis ou conteúdo editorial livre.

Adapters, scripts de rebuild e testes importam esses enums pelo contrato público do
`pkg-domain`. Assim, alterações de código persistido são localizadas e não ficam
espalhadas como strings literais em cada camada.

## Portas atuais

As portas públicas ficam em [`packages/pkg-application/src/ports.ts`](../packages/pkg-application/src/ports.ts)
e são contratos unitários, entre outros:

- `GetCatalogPort`, `GetCoursePort`, `GetLessonPort`, `GetQuestionPort`, `GetAssessmentPort`,
  `GetTopicMapPort` e `GetStudyPlanPort`;
- `ListAttemptsPort`, `RecordAttemptPort`, `SaveAttemptPort`, `SaveSessionPort`,
  `SaveLessonProgressPort`, `SavePlanProgressPort`, `SaveReviewTargetPort` e
  `SaveDiagnosisPort`;
- `ScheduleReviewPort`, `PreviewReviewPort`, `RecordStudyActivityPort`,
  `SuggestDiagnosisPort`, `RecommendNextPort` e `AddStudyPointsPort`;
- `ClockPort` e `IdPort` para capacidades de plataforma.

Os read models escondem tabelas e SQL. A UI recebe dados orientados ao caso de uso, evitando que mudanças no snapshot SQLite alterem as telas.

## Composition root

`packages/app/src/composition/create-app-dependencies.composition.ts` instancia:

- um adapter por port de leitura do SQLite;
- um adapter por port de progresso do Dexie;
- um adapter por operação do FSRS e dos serviços de estudo;
- `DateFnsClockAdapter`;
- `CryptoIdAdapter`.

Os ports são montados em um objeto plano por `createAppDependencies()`. O
`createApplication()` instancia cada classe de caso de uso uma única vez e os
disponibiliza aos ViewModels pelo `AppServicesContext`. O app depende dos pacotes
`pkg-domain`, `pkg-application` e `pkg-adapter-data-v1` por seus exports públicos;
não importa arquivos internos de adapters.

## Migração

A migração é incremental por fatias verticais. Catálogo, cursos, lições, questões, mapas e planos já usam ViewModels e read models. As demais rotas antigas continuam funcionando enquanto são migradas, mas novas telas não devem importar `storage`, `db`, `sql.js`, `dexie` ou `ts-fsrs` diretamente.

O comando `deno task architecture:check` verifica automaticamente as regras de dependência das camadas novas.

## Testabilidade

ViewModels e use cases podem receber fakes de uma única port, como
`GetCatalogPort` ou `SaveLessonProgressPort`. Adapters de produção não são
necessários para testar regras de filtro, progresso, diagnóstico ou recomendação.

## Convenção de arquivos

O código TypeScript sob `packages/` usa nomes `small-kebab-case` com um sufixo que identifica o papel do arquivo:

- `*.component.tsx`: componente React com JSX;
- `*.component.test.tsx`: teste de componente que usa JSX;
- `*.view-model.ts`: ViewModel de apresentação;
- `*.command-handler.ts` e `*.query-handler.ts`: handlers CQRS, com exatamente uma classe e um método `execute()`;
- `*.port.ts` ou `*.ports.ts`: porta de aplicação;
- `*.adapter.ts`, `*.store.ts`, `*.service.ts`: implementações e serviços de infraestrutura;
- `*.schema.ts`, `*.models.ts`, `*.database.ts`, `*.config.ts`: artefatos tipados por responsabilidade;
- `*.test.ts` ou `*.spec.ts`: testes sem JSX.

Ferramentas em `packages/pkg-tooling/src/tools/` usam `*.tool.ts`. Operações locais em `.local/operator/` usam `*.operator.ts`. Configurações em `.config/` usam `*.config.ts` quando forem TypeScript.

Casos de uso seguem CQRS granular: `*.command.ts`, `*.command-handler.ts` e `*.command-result.ts` para comandos; `*.query.ts`, `*.query-handler.ts` e `*.query-result.ts` para consultas. Cada handler possui uma classe e um `execute()`. Arquivos `*.use-case.ts` legados e arquivos `*.adapters.ts` agregadores são rejeitados pelo linter arquitetural.

Arquivos `index.ts` e `index.tsx` são exceções para APIs públicas de pacote. O gate `file:conventions` verifica os nomes, restringe JSX aos arquivos de componente e garante um único tipo de caso de uso por arquivo.

O linter arquitetural também enforça uma função de produção exportada por arquivo
quando a função é de topo. Funções auxiliares não exportadas e funções anônimas não
devem ser acumuladas em módulos de implementação; elas devem ser extraídas para
arquivos próprios. Métodos de classes, componentes e arquivos de configuração são
tratados como fronteiras técnicas pelas regras específicas de cada camada.

Funções de domínio devem permanecer em `packages/pkg-domain` e ser puras: o gate
detecta acesso direto a relógio, aleatoriedade, rede, console e estado do navegador,
além de mutação de parâmetros. Funções de infraestrutura não são automaticamente
reclassificadas como domínio; a regra impede especificamente que a camada de estudo
do adapter defina lógica de domínio.

O futuro pacote `packages/pkg-utils` será reservado para funções genéricas sem
dependência de domínio, aplicação ou adapters. A regra de fronteira já rejeita esses
imports, mesmo antes de o pacote ser criado.

Esses gates foram configurados nesta etapa apenas para detectar violações. A correção
das violações existentes será feita em uma etapa posterior de refatoração.

## Nomenclatura orientada à responsabilidade

O gate `architecture/purposeful-naming` mantém uma convenção única para símbolos:

- funções usam `lowerCamelCase` e um verbo de intenção (`get`, `list`, `create`, `save`, `calculate`, `validate`, `use` e equivalentes);
- componentes React usam `PascalCase`;
- hooks de ViewModel usam `use<Name>ViewModel`;
- classes usam `PascalCase` e o sufixo da responsabilidade do arquivo (`Adapter`, `Store`, `Service`, `Handler` ou `Database`);
- interfaces e aliases usam `PascalCase` e respeitam os contratos `Port`, `Command`, `Query` e `Result` quando o arquivo os declara;
- tipos sem contrato específico continuam livres para expressar o modelo sem sufixos artificiais.

A regra é deliberadamente baseada no caminho e no papel do arquivo, não em uma lista
de nomes de vestibulares ou em conteúdo editorial. Ela apenas diagnostica nomes
existentes nesta etapa; renomeações serão feitas posteriormente.
