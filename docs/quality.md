# Qualidade e segurança

O projeto usa Docker como ambiente oficial de desenvolvimento, validação e build. O comando `just check` é o gate rápido principal para alterações durante o MVP. Os gates demorados permanecem disponíveis em `just heavy-checks`, mas não fazem parte do fluxo diário.

## Gate rápido principal

```sh
just check
```

O gate rápido executa Prettier, ESLint completo, TypeScript e Vitest. Ele não executa build de publicação, navegador, scanners, validações editoriais ou análises demoradas.

O mesmo gate é usado pelo `just ci` e pelo workflow automático de qualidade. No CI,
o workflow constrói a imagem `quality-ci` uma vez com cache BuildKit/GitHub Actions
e executa os gates diretamente nela, sem instalar Deno ou dependências novamente.

Todos os arquivos JavaScript e TypeScript do repositório (`.js`, `.jsx`, `.mjs`, `.ts`
e `.tsx`) entram explicitamente no Prettier e no ESLint, inclusive em `.config/`,
`packages/pkg-tooling/`, `.github/` e nos pacotes. A política de código exige aspas duplas, imports
no topo em ordem alfabética, sem linhas vazias entre imports e com uma linha vazia após
o último import. Estruturas de controle usam chaves sempre; o ESLint também exige
separação visual antes e depois de controles e exports. A regra local
`import-format/no-empty-line-between-imports` complementa o `import/order` sem criar
conflito com a linha obrigatória após o último import.

## Heavy checks

```sh
just heavy-checks
```

Esse fluxo preserva todos os gates complementares: Markdownlint, CSpell para
português e inglês, links locais com Lychee, política de Conventional Commits,
ast-grep, arquitetura, segurança estática,
duplicação, código morto, build publicado, E2E, acessibilidade, Lighthouse,
auditoria de segurança, supply chain, complexidade, Stylelint, relatório Qlty,
lint de infraestrutura e REUSE. Ele é executado manualmente enquanto o produto
estiver em MVP.

Os gates absorvidos das referências foram escolhidos com escopo local: CSpell
verifica documentação e labels da UI e Lychee verifica somente referências
locais em modo offline. Nenhum desses gates é executado pelo just check diário
ou pelo workflow rápido.

## Gates específicos

```sh
just format-check
just migration-format-check
just spelling
just docs-links
just commit-check
just typecheck
just ast-grep
just comments
just test
just architecture
just content
just stylelint
just quality-report
just aqua-checksums-check
just security
just duplication
just dead-code
just build-check
just repository-lint
just security-audit
```

`security-audit` executa Gitleaks, OSV-Scanner, Trivy e Semgrep em containers. O Trivy usa a configuração versionada em `.config/trivy.yaml`, desabilita arquivos de supressão fornecidos pelo checkout e usa o volume Docker `portal-guesant-saberes-trivy-cache` para preservar sua base local.

Stylelint valida propriedades, seletores e valores CSS/SCSS usando a configuração
versionada em `.config/stylelint.config.json`. Qlty agrega análises disponíveis
por plugins e gera um relatório SARIF em `.cache/qlty-report.sarif`; o relatório
é complementar e não altera o gate rápido. A tarefa `aqua-checksums-check`
recalcula os checksums em ambiente isolado e detecta divergências no manifesto
versionado.

As migrations Dbmate são a fonte versionada do schema e dos dados editoriais e usam `sql-formatter`
com a configuração versionada em `.config/sql-formatter.json`. Para formatar arquivos alterados ou
verificar o gate:

```sh
just migration-format
just migration-format-check
```

`migration-format-check` faz parte de `just heavy-checks`, mas permanece fora de `just check`
durante o MVP. Os marcadores `-- migrate:up` e `-- migrate:down` são validados para evitar que
a formatação quebre o contrato do Dbmate.

Os utilitários de conteúdo ficam somente no ambiente local do operador, em
`.local/operator/content/`. Eles podem ser executados com `deno task content:validate`,
`deno task content:rebuild` e `deno task db:bootstrap`, mas não fazem parte do CI nem do fluxo
diário de qualidade.

O smoke test de navegador executa Chromium no container oficial do Playwright:

```sh
just e2e
```

## Decisões

- ESLint e Prettier são as ferramentas oficiais de análise e formatação.
- A configuração única do ESLint reúne as regras inspiradas no Airbnb e as regras próprias de React/TypeScript; não há perfil rápido alternativo.
  Essas regras estão
  documentadas em [`docs/eslint-prettier-airbnb.md`](eslint-prettier-airbnb.md).
- ast-grep aplica regras estruturais versionadas em `.config/ast-grep/rules`, executa seus próprios casos de teste e escaneia `packages/`, `.config/` e `.github/`; as regras específicas de tooling escaneiam `packages/pkg-tooling/src/` e `.local/operator/`. Em TypeScript e TSX, as regras cobrem contratos de props nomeados, ausência de desestruturação de props na assinatura, ausência de tipos de objeto inline em parâmetros, componentes React declarados no escopo do módulo, callbacks de `map` delegados a componentes e ausência de ternários aninhados ou JSX complexo em callbacks. O ESLint estrito limita a profundidade do JSX a três níveis. Ele também bloqueia HTML arbitrário, execução dinâmica (`eval`/`new Function`), atribuições a `innerHTML` e `console.log`; o gate Deno residual verifica apenas URLs `javascript:` dentro de texto.
- A política de comentários é de tolerância zero para narrativa. ast-grep valida comentários em TypeScript, TSX e YAML; `packages/pkg-tooling/src/tools/check-comments.tool.ts` cobre formatos que não possuem parser ast-grep adequado no toolchain, incluindo Dockerfile, Justfile, HCL, JSONC, TOML, Markdown e SQL. Só são aceitas diretivas de ferramentas, como `@ts-*`, `# syntax=...`, shebangs de receitas, marcadores `renovate:`, a linha gerada pelo `mise lock` e `-- migrate:up/down` do Dbmate.
- Deno usa `deno.lock` e instalação congelada no CI. O `.config/container/Dockerfile` usa cache mount do BuildKit para o `DENO_DIR`; o Compose mantém o mesmo cache em `.cache/deno` no desenvolvimento.
- O Mise é a fonte dos runtimes do projeto: `.config/mise/mise.toml` declara Deno
  e Python e `.config/mise/mise.lock` fixa as resoluções por plataforma. O Aqua é
  a fonte das CLIs distribuídas como releases, com checksums obrigatórios em
  `.config/aqua/aqua-checksums.json`. O registry local em
  `.config/aqua/registry.yaml` é a extensão para ferramentas próprias ou que não
  existam no registry padrão do Aqua.
- Para adicionar uma ferramenta própria, primeiro publique um artefato versionado
  e um package definition compatível com o registry Aqua local; depois adicione o
  pacote ao manifesto, gere/atualize os checksums e valide tudo dentro da imagem
  canônica. Ferramentas Python sem pacote nativo no Aqua ficam declaradas em
  `.config/aqua/python-tools.txt` e são instaladas por `uv`, que também é
  fornecido e verificado pelo Aqua, usando o Python fornecido pelo Mise.
- O CI rápido usa cache remoto do BuildKit por branch e evita `apt-get`, `just` e `deno install` durante a execução dos gates.
- O SQLite editorial local é validado quando o arquivo existe; ele não entra no artefato publicado.
- O progresso local não é incluído no build.
- Knip ignora contratos e stores locais que formam APIs públicas internas durante a migração gradual.
- jscpd mantém um limite de duplicação de 10% enquanto o legado é absorvido; o limite deve ser reduzido após a migração.
- Qlty permanece como auditoria complementar. Scorecard, Lighthouse e Playwright são executados em workflows específicos e não fazem parte do fluxo rápido.
