# Airbnb JavaScript e Biome

O projeto adota as regras do Airbnb que possuem uma implementação verificável no
Biome. A configuração canônica está em [`.config/biome.json`](../.config/biome.json)
e é aplicada ao escopo inteiro de `packages/` e `.tools/`.

## Escopo obrigatório

O comando rápido sempre executa:

```sh
deno task biome:scope
deno task check:format
deno task check:lint
```

`biome:scope` enumera recursivamente todos os arquivos `.js`, `.jsx`, `.mjs`,
`.cjs`, `.ts` e `.tsx` sob `packages/` e `.tools/`. Ele falha quando encontra:

- `.biomeignore` dentro do escopo;
- uma configuração `files` restritiva no Biome;
- um comentário `biome-ignore` no código;
- a remoção de qualquer regra Airbnb compatível exigida;
- uma tarefa de format/lint que não inclua simultaneamente `packages .tools`.

Artefatos gerados, dependências e caches (`dist`, `node_modules`, `.cache` e
`coverage`) não são código-fonte e são excluídos da enumeração.

## Regras Airbnb representadas diretamente ou por equivalente

| Intenção do Airbnb | Regra Biome | Nível |
| --- | --- | --- |
| evitar CommonJS | `style.noCommonJs` | error |
| evitar namespace imports | `performance.noNamespaceImport` | error |
| não reatribuir parâmetros | `style.noParameterAssign` | error |
| evitar ternário aninhado | `style.noNestedTernary` | error |
| preferir `const` | `style.useConst` | error |
| parâmetros opcionais por último | `style.useDefaultParameterLast` | error |
| preferir operador de exponenciação | `style.useExponentiationOperator` | error |
| lançar instâncias de `Error` | `style.useThrowNewError` | error |
| não lançar valores arbitrários | `style.useThrowOnlyError` | error |
| imports e variáveis não usadas | `correctness.noUnusedImports` e `correctness.noUnusedVariables` | error |
| acessibilidade JSX/HTML | `a11y.recommended` | recomendado |

O preset `recommended` do Biome também permanece habilitado. Ele cobre regras
de correção, suspeita, segurança e hooks que são equivalentes funcionais úteis
para uma aplicação React, como dependências de hooks e regras de hooks.

## Limite de paridade

Não existe paridade 1:1 entre `eslint-config-airbnb` e Biome. O Airbnb é um
config compartilhado do ESLint e depende de `eslint-plugin-import`,
`eslint-plugin-react`, `eslint-plugin-react-hooks` e `eslint-plugin-jsx-a11y`.
O Biome não carrega plugins ESLint, resolvers de módulos ou regras arbitrárias
de terceiros.

Por isso, não declaramos que regras sem equivalente estão cobertas. Entre as
áreas que permanecem explicitamente sem equivalência integral estão:

- resolução de imports, ciclos, extensões, ordem e `import/no-unresolved`;
- regras específicas de componentes React e convenções de `prop-types`;
- o conjunto completo de regras `jsx-a11y` do plugin do Airbnb;
- regras de configuração do ESLint, resolvers e comportamento de plugins.

Essas lacunas são complementadas por gates separados quando fizerem sentido,
como TypeScript, ast-grep, axe-core/Playwright, arquitetura e testes. Elas não
são silenciosamente tratadas como aprovadas pelo Biome.

## Formatação

O repositório mantém uma única fonte de verdade para formatação: o Biome. A
configuração canônica fixa largura de linha de 100 colunas, quatro espaços para
TypeScript e JSON, LF, aspas duplas (inclusive JSX), ponto e vírgula, vírgulas
finais em todas as estruturas suportadas, parênteses em todos os parâmetros de
arrow functions e espaços internos em chaves de objetos.

Essas escolhas incorporam os aspectos relevantes das configurações do Prettier
analisadas sem introduzir Prettier como segundo formatter. O .editorconfig
continua sendo a regra de edição para arquivos que não passam por Biome,
especialmente Markdown, YAML e SQL.

## Regras adicionais de segurança e legibilidade

Além do preset recomendado, o Biome bloqueia explicitamente código inalcançável,
any explícito, igualdade frouxa, shadowing, debugger, fallthrough silencioso,
optional chaining inseguro e imports de namespace. A auditoria de escopo impede
arquivos de exclusão e supressões que poderiam ocultar arquivos de packages/ ou
.tools/.

## Fonte e atualização

A referência de política é o Airbnb JavaScript Style Guide e o pacote
`eslint-config-airbnb` da versão adotada no momento da revisão. A configuração
local não importa o Airbnb nem baixa regras durante o build; ela mantém somente
regras suportadas pelo toolchain oficial do projeto. Quando o Biome ou o Airbnb
mudarem, a matriz deve ser revisada junto com os testes de escopo.
