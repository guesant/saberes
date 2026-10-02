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

Não há container DI externo. Factories explícitas mantêm a inicialização previsível, reduzem magia em runtime e facilitam o build offline.

## Tokens de domínio

Os códigos persistidos e discriminadores compartilhados ficam em
`packages/pkg-core/src/models/enums.ts`. Eles incluem processos (`ENEM`, `Unicamp` e
`Fuvest`), organizadores (`Comvest`, `Fuvest` e `Inep`), tipos de questão, tipos de
conteúdo, estados de progresso, diagnósticos e avaliações FSRS. Enums não são usados
para títulos, descrições, labels traduzíveis ou conteúdo editorial livre.

Adapters, scripts de rebuild e testes importam esses enums pelo contrato público do
`pkg-core`. Assim, alterações de código persistido são localizadas e não ficam
espalhadas como strings literais em cada camada.

## Portas atuais

- `ContentPort`: read models de catálogo, curso, lição, questão, avaliação, mapa e plano.
- `ProgressPort`: tentativas, matrículas, progresso, favoritos, diagnósticos e revisões.
- `ReviewSchedulerPort`: agendamento e simulação de intervalos FSRS.
- `ClockPort`: data atual e chave de calendário.
- `IdPort`: identificadores locais.

Os read models escondem tabelas e SQL. A UI recebe dados orientados ao caso de uso, evitando que mudanças no snapshot SQLite alterem as telas.

## Composition root

`packages/app/src/composition/createAppDependencies.ts` instancia:

- `SqlJsContentAdapter`;
- `DexieProgressAdapter`;
- `TsFsrsReviewAdapter`;
- `DateFnsClockAdapter`;
- `CryptoIdAdapter`.

Os objetos são fornecidos por `AppDependenciesContext`. Os use cases são criados uma vez por `createUseCases()` e disponibilizados aos ViewModels pelo `AppServicesContext`. O app depende dos pacotes `pkg-core` e `pkg-adapter-data-v1` por seus contratos e exports públicos; não importa arquivos internos de adapters.

## Migração

A migração é incremental por fatias verticais. Catálogo, cursos, lições, questões, mapas e planos já usam ViewModels e read models. As demais rotas antigas continuam funcionando enquanto são migradas, mas novas telas não devem importar `storage`, `db`, `sql.js`, `dexie` ou `ts-fsrs` diretamente.

O comando `deno task architecture:check` verifica automaticamente as regras de dependência das camadas novas.

## Testabilidade

ViewModels e use cases podem receber fakes de `ContentPort` e `ProgressPort`. Adapters de produção não são necessários para testar regras de filtro, progresso, diagnóstico ou recomendação.
