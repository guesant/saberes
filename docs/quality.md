# Qualidade e segurança

O projeto usa Docker como ambiente oficial de desenvolvimento, validação e build. O comando `just check` é o gate rápido principal para alterações durante o MVP. Os gates demorados permanecem disponíveis em `just heavy-checks`, mas não fazem parte do fluxo diário.

## Gate rápido principal

```sh
just check
```

O gate executa somente Biome, TypeScript e Vitest. Ele não executa build de publicação, navegador, scanners, validações editoriais ou análises demoradas.

O mesmo gate é usado pelo `just ci` e pelo workflow automático de qualidade. No CI,
o workflow constrói a imagem `quality-ci` uma vez com cache BuildKit/GitHub Actions
e executa os gates diretamente nela, sem instalar Deno ou dependências novamente.

## Heavy checks

```sh
just heavy-checks
```

Esse fluxo preserva todos os gates complementares: Markdownlint, ast-grep, arquitetura, conteúdo, segurança estática, duplicação, código morto, build publicado, E2E, acessibilidade, Lighthouse, auditoria de segurança, supply chain, complexidade, lint de infraestrutura e REUSE. Ele é executado manualmente enquanto o produto estiver em MVP.

## Gates específicos

```sh
just format-check
just migration-format-check
just typecheck
just ast-grep
just test
just architecture
just content
just security
just duplication
just dead-code
just build-check
just repository-lint
just security-audit
```

`security-audit` executa Gitleaks, OSV-Scanner, Trivy e Semgrep em containers. O Trivy usa o volume Docker `portal-guesant-saberes-trivy-cache` para não baixar a base de vulnerabilidades a cada execução.

As migrations Dbmate são DML-only nesta fase e usam `sql-formatter` com a configuração versionada em
`.config/sql-formatter.json`. Para formatar arquivos alterados ou verificar o gate:

```sh
just migration-format
just migration-format-check
```

`migration-format-check` faz parte de `just heavy-checks`, mas permanece fora de `just check`
durante o MVP. Os marcadores `-- migrate:up` e `-- migrate:down` são validados para evitar que
a formatação quebre o contrato do Dbmate.

O smoke test de navegador executa Chromium no container oficial do Playwright:

```sh
just e2e
```

## Decisões

- Biome substitui ESLint e Prettier.
- A política Airbnb compatível com Biome, seus limites de paridade e a auditoria
  de escopo estão documentados em [`docs/airbnb-biome.md`](airbnb-biome.md).
- ast-grep aplica regras estruturais versionadas em `.config/ast-grep/rules` e executa seus próprios casos de teste antes de escanear os pacotes. As regras atuais bloqueiam HTML arbitrário, execução dinâmica (`eval`/`new Function`) e `console.log` em código publicado.
- Deno usa `deno.lock` e instalação congelada no CI. O `.container/Dockerfile` usa cache mount do BuildKit para o `DENO_DIR`; o Compose mantém o mesmo cache em `.cache/deno` no desenvolvimento.
- O CI rápido usa cache remoto do BuildKit por branch e evita `apt-get`, `just` e `deno install` durante a execução dos gates.
- O SQLite editorial local é validado quando o arquivo existe; ele não entra no artefato publicado.
- O progresso local não é incluído no build.
- Knip ignora contratos e stores locais que formam APIs públicas internas durante a migração gradual.
- jscpd mantém um limite de duplicação de 10% enquanto o legado é absorvido; o limite deve ser reduzido após a migração.
- Qlty, Scorecard, Lighthouse e Playwright permanecem auditorias complementares para a próxima etapa.
