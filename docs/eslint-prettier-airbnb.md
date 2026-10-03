# ESLint, Prettier e regras de arquitetura

O projeto usa ESLint para análise estática e Prettier para formatação. A única
configuração completa do ESLint está em
[`.config/eslint.config.mjs`](../.config/eslint.config.mjs).

As regras estritas incluem JSX com profundidade máxima de três níveis, contrato
de props nomeado, delegação de renderização condicional, listas que retornam
componentes importados, limites de complexidade, regras SonarJS, boundaries e
regras TypeScript de segurança. O plugin local em
[`.config/eslint/architecture-plugin.mjs`](../.config/eslint/architecture-plugin.mjs)
contém as regras que não possuem equivalente nativo suficiente.

O gate diário e o gate pesado usam a mesma configuração completa. A diferença
entre eles é apenas o conjunto de tarefas complementares executadas ao redor do
lint.

```text
Prettier → forma o código
ESLint → análise completa
ast-grep → padrões estruturais complementares
```
