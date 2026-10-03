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

Esse fluxo preserva todos os gates complementares: Markdownlint, CSpell para
português e inglês, links locais com Lychee, placeholders, política de
Conventional Commits, ast-grep, arquitetura, conteúdo, segurança estática,
duplicação, código morto, build publicado, E2E, acessibilidade, Lighthouse,
auditoria de segurança, supply chain, complexidade, lint de infraestrutura e
REUSE. Ele é executado manualmente enquanto o produto estiver em MVP.

Os gates absorvidos das referências foram escolhidos com escopo local: CSpell
verifica documentação e labels da UI, Lychee verifica somente referências
locais em modo offline e o detector de placeholders impede valores provisórios
de chegarem ao conteúdo publicado. Nenhum desses gates é executado pelo
just check diário ou pelo workflow rápido.

## Gates específicos

```sh
just format-check
just migration-format-check
just spelling
just docs-links
just placeholders
just commit-check
just typecheck
just ast-grep
just comments
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

`security-audit` executa Gitleaks, OSV-Scanner, Trivy e Semgrep em containers. O Trivy usa a configuração versionada em `.config/trivy.yaml`, desabilita arquivos de supressão fornecidos pelo checkout e usa o volume Docker `portal-guesant-saberes-trivy-cache` para preservar sua base local.

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

O smoke test de navegador executa Chromium no container oficial do Playwright:

```sh
just e2e
```

## Decisões

- Biome substitui ESLint e Prettier.
- A política Airbnb compatível com Biome, seus limites de paridade e a auditoria
  de escopo estão documentados em [`docs/airbnb-biome.md`](airbnb-biome.md).
- ast-grep aplica regras estruturais versionadas em `.config/ast-grep/rules`, executa seus próprios casos de teste e escaneia `packages/` e `.tools/`. Ele bloqueia HTML arbitrário, execução dinâmica (`eval`/`new Function`), atribuições a `innerHTML` e `console.log`; o gate Deno residual verifica apenas URLs `javascript:` dentro de texto.
- A política de comentários é de tolerância zero para narrativa. ast-grep valida comentários em TypeScript, TSX e YAML; `.tools/check-comments.ts` cobre formatos que não possuem parser ast-grep adequado no toolchain, incluindo Dockerfile, Justfile, HCL, JSONC, TOML, Markdown e SQL. Só são aceitas diretivas de ferramentas, como `@ts-*`, `# syntax=...`, shebangs de receitas, marcadores `renovate:`, a linha gerada pelo `mise lock` e `-- migrate:up/down` do Dbmate.
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
- Qlty, Scorecard, Lighthouse e Playwright permanecem auditorias complementares para a próxima etapa.
