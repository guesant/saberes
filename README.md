# Portal Guesant Saberes

Portal educacional local-first para vestibulares e aprendizagem estruturada, feito como uma SPA React com Material UI, Vite, PWA e SQLite em WebAssembly.

[![quality](https://img.shields.io/github/actions/workflow/status/guesant/saberes/quality.yml?branch=main&label=quality&style=for-the-badge&labelColor=0b1120&color=2563eb&logo=githubactions&logoColor=white)](https://github.com/guesant/saberes/actions/workflows/quality.yml)
[![deploy](https://img.shields.io/github/actions/workflow/status/guesant/saberes/deploy-pages.yml?branch=main&label=deploy&style=for-the-badge&labelColor=0b1120&color=2563eb&logo=githubactions&logoColor=white)](https://github.com/guesant/saberes/actions/workflows/deploy-pages.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/guesant/saberes/badge)](https://securityscorecards.dev/viewer/?uri=github.com/guesant/saberes)
[![licença do código](https://img.shields.io/badge/c%C3%B3digo-The%20Unlicense-7c3aed?style=for-the-badge&labelColor=0b1120)](LICENSE)
[![licença do conteúdo](https://img.shields.io/badge/conte%C3%BAdo-CC0%201.0-059669?style=for-the-badge&labelColor=0b1120)](LICENSE-CONTENT)

[![último commit](https://img.shields.io/github/last-commit/guesant/saberes/main?label=%C3%BAltimo%20commit&style=flat-square&labelColor=0b1120&color=b45309&logo=git&logoColor=white)](https://github.com/guesant/saberes/commits/main)
[![commits por mês](https://img.shields.io/github/commit-activity/m/guesant/saberes?label=commits%2Fm%C3%AAs&style=flat-square&labelColor=0b1120&color=b45309&logo=git&logoColor=white)](https://github.com/guesant/saberes/graphs/commit-activity)
[![PRs abertas](https://img.shields.io/github/issues-pr/guesant/saberes?label=PRs%20abertas&style=flat-square&labelColor=0b1120&color=b45309&logo=github&logoColor=white)](https://github.com/guesant/saberes/pulls)
[![issues abertas](https://img.shields.io/github/issues/guesant/saberes?label=issues%20abertas&style=flat-square&labelColor=0b1120&color=b45309&logo=github&logoColor=white)](https://github.com/guesant/saberes/issues)
[![stars](https://img.shields.io/github/stars/guesant/saberes?style=flat-square&labelColor=0b1120&color=b45309&logo=github&logoColor=white)](https://github.com/guesant/saberes/stargazers)

## Licenças

- Código, configurações, documentação técnica e scripts: [The Unlicense](LICENSE).
- Conteúdo editorial original mantido no SQLite local: [CC0 1.0 Universal](LICENSE-CONTENT), com a licença versionada em [`packages/app/public/data/LICENSE`](packages/app/public/data/LICENSE).
- A conformidade é declarada pelo REUSE em [`REUSE.toml`](REUSE.toml), com os textos SPDX em [`LICENSES/`](LICENSES).

O CC0 cobre o conteúdo editorial original deste projeto. Questões, trechos, imagens, referências e materiais de terceiros continuam sujeitos às licenças e aos direitos de seus respectivos autores ou instituições.

## Arquitetura

- React + React Router + MUI no navegador.
- Vite para desenvolvimento e build.
- PWA com service worker e cache offline.
- `sql.js` para consultar o snapshot SQLite no navegador.
- Dexie para persistir tentativas, simulados, progresso editorial e desempenho do estudante no IndexedDB.
- TanStack Query para consultas e invalidação sobre os repositórios locais; ele não substitui o Dexie.
- Valibot para validar conteúdo editorial, blocos ricos, progresso e importações.
- TypeScript nos contratos e serviços novos, com Biome como formatter e linter.
- `date-fns` para calendário, planos, metas, sequência e revisões.
- FSRS (`ts-fsrs`) atrás de um adaptador próprio para revisões espaçadas explicáveis e controláveis pelo estudante.
- Arquitetura MVVM com use cases, ports/adapters e factories tipadas para Dependency Injection.
- Catálogo editorial com cursos gerais e específicos, mapas de tópicos, planos de estudo e área Meu estudo.
- O SQLite editorial é local nesta fase e fica em `.local/content/content.sqlite`; durante o desenvolvimento o Vite o serve em `/data/content.sqlite`. A URL pode ser substituída por `VITE_CONTENT_DB_URL` em cenários locais alternativos.
- Nginx serve o build estático final da aplicação.
- A distribuição de produção é feita no GitHub Pages pelo GitHub Actions.

A estrutura de trabalho segue a convenção do projeto: a aplicação fica em [`packages/app/`](packages/app), o domínio puro em [`packages/pkg-core/`](packages/pkg-core), os adapters de dados em [`packages/pkg-adapter-data-v1/`](packages/pkg-adapter-data-v1), o pacote de dados e migrations em [`packages/thedata/`](packages/thedata), configurações de ferramentas em [`.config/`](.config), infraestrutura Docker em [`.config/container/`](.config/container), scripts de manutenção em [`.tools/`](.tools), insumos locais não publicados em [`.local/`](.local) e caches descartáveis em [`.cache/`](.cache). O Deno é a única ferramenta JavaScript/TypeScript do toolchain; o cache de dependências fica em `.cache/deno` e o build usa cache mount do BuildKit.

## Executar com Docker

O host não precisa ter Deno, SQLite ou qualquer dependência da aplicação.

Prepare a configuração local do operador:

```sh
cp .local/operator/.env.example .local/operator/.env
```

O Compose e os comandos `just` carregam `.local/operator/.env` explicitamente,
usando o arquivo de exemplo como fallback. Variáveis `VITE_*` são valores
públicos de build e ficam incorporadas ao bundle; não use segredos no frontend.

```sh
docker compose -f .config/container/docker-compose.yml build web
docker compose -f .config/container/docker-compose.yml up web
```

Acesse [http://localhost:8000](http://localhost:8000).

Para desenvolvimento com Vite:

```sh
docker compose -f .config/container/docker-compose.yml run --rm --service-ports dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## GitHub Pages

O workflow em `.github/workflows/deploy-pages.yml` constrói a aplicação dentro da imagem Docker e publica o conteúdo estático no GitHub Pages. O domínio público configurado é [saberes.guesant.net](https://saberes.guesant.net), com base `/` e [`CNAME`](packages/app/public/CNAME) incluído no artefato.

O workflow exige apenas que o GitHub Pages esteja configurado para usar GitHub Actions nas configurações do repositório. Nenhum runtime JavaScript é instalado diretamente no runner: o bundle é gerado pelo [`.config/container/Dockerfile`](.config/container/Dockerfile), que é a mesma fonte usada no desenvolvimento, build e CI.

## Banco SQLite local

O SQLite editorial não é publicado no GitHub Pages nem versionado. O arquivo local
`.local/content/content.sqlite` contém somente as tabelas de conteúdo: provas, questões,
alternativas, tópicos, aulas, materiais e relações. O progresso do usuário nunca é
armazenado nesse arquivo.

Para gerar um novo snapshot multi-exame a partir de outro SQLite previamente revisado:

```sh
docker buildx bake --file .config/container/docker-bake.hcl --load tools
docker run --rm -v "$PWD:/workspace" -v "$PWD/.cache/deno:/deno/cache" -w /workspace portal-guesant-saberes-tools:local deno task content:rebuild
```

O script lê `.local/content/source.sqlite` por padrão e gera `.local/content/content.sqlite` com o modelo multi-processo. É possível informar `SOURCE_DB` e `OUTPUT_DB` no container. O banco inicial pode conter diferentes processos seletivos, mas o app não faz crawling, downloads, leitura de PDF, busca de conteúdo ou geração de questões durante a execução.

As migrations em [`packages/thedata/dbmate/migrations/`](packages/thedata/dbmate/migrations) são a fonte de verdade do banco local: a migration inicial cria o schema completo e as seguintes aplicam alterações e dados editoriais versionados. O comando `content:rebuild` cria um banco vazio, aplica todas as migrations Dbmate e só então importa o conteúdo revisado. A documentação HTML do schema é gerada durante o build, sem substituir as migrations.

```sh
docker run --rm -v "$PWD:/workspace" -v "$PWD/.cache/deno:/deno/cache" -w /workspace portal-guesant-saberes-tools:local deno task db:status
docker run --rm -v "$PWD:/workspace" -v "$PWD/.cache/deno:/deno/cache" -w /workspace portal-guesant-saberes-tools:local deno task db:migrate
```

As migrations são formatadas e verificadas com `sql-formatter`, usando a configuração em
[`.config/sql-formatter.json`](.config/sql-formatter.json). O formatter preserva os marcadores
`-- migrate:up` e `-- migrate:down` exigidos pelo Dbmate:

```sh
just migration-format
just migration-format-check
```

A verificação também faz parte de `deno task heavy-checks`; não é executada pelo `just check`
diário enquanto o produto estiver em MVP.

## Documentação do schema

O build cria a documentação estática do banco em `/-/backstage/database/schema/`. O processo
parte de um SQLite vazio, aplica todas as migrations do Dbmate e executa o SchemaSpy dentro da
mesma imagem Docker de ferramentas. Assim, o mapa do schema publicado acompanha a aplicação sem
depender do banco editorial local.

```sh
just schema-docs
```

Após o build, o índice estará disponível em `saberes.guesant.net/-/backstage/database/schema/`.

O modelo diferencia cursos universitários (`degree_programs`) de cursos preparatórios (`learning_courses`). Cursos preparatórios são compostos por módulos e itens; mapas usam tópicos e pré-requisitos; planos organizam uma sequência editorial de estudo. O contrato completo está em [`docs/data-model.md`](docs/data-model.md).

O detalhamento das relações está em [`docs/data-model.md`](docs/data-model.md).

O contrato pedagógico, o diagnóstico de erros, o fluxo FSRS e as regras de conteúdo rico estão documentados em [`docs/pedagogical-model.md`](docs/pedagogical-model.md).

A separação de responsabilidades está documentada em [`docs/architecture.md`](docs/architecture.md). Views não acessam SQLite ou IndexedDB; ViewModels chamam use cases; adapters concretos são montados no composition root.

## Progresso local

Tentativas, sessões de simulado, cursos iniciados, aulas concluídas, planos, favoritos e fila de revisão são salvos no IndexedDB do navegador. O menu Desempenho permite limpar o progresso. Para o estudo offline completo, abra a aplicação ao menos uma vez online para que o bundle, o SQLite e o WASM sejam armazenados pelo PWA.

## Testes e build

```sh
just test
just typecheck
just check
just architecture
just content
just build
```

`deno task check` executa somente os gates rápidos da aplicação. Os gates completos ficam disponíveis em `deno task heavy-checks` e `just heavy-checks`.

## Quality gates

O comando diário de qualidade é executado integralmente no Docker:

```sh
just check
```

Ele valida formatação, lint, TypeScript e testes unitários. As auditorias completas podem ser executadas com:

```sh
just heavy-checks
```

Os detalhes estão em [`docs/quality.md`](docs/quality.md).

O gate de licenças pode ser executado isoladamente com `just reuse-check`. Ele roda o REUSE dentro do Docker e valida que todos os arquivos possuem uma licença declarada.
