# Estado local

Esta pasta contém configurações e insumos locais que não devem ser publicados.

## Configuração do operador

Copie o exemplo antes de executar os serviços:

```sh
cp .local/operator/.env.example .local/operator/.env
```

O arquivo `.local/operator/.env` é ignorado pelo Git. Variáveis `VITE_*`
participam do build e tornam-se públicas no bundle; nunca coloque segredos
nessas variáveis.

- `content/source.sqlite`: SQLite editorial de entrada usado por
  `deno task content:rebuild`.
- `content/content.sqlite`: SQLite editorial local gerado pelo rebuild e servido
  somente durante o desenvolvimento.
- outros arquivos locais: credenciais, exports temporários ou snapshots de
  trabalho não revisados.

O conteúdo desta pasta é ignorado pelo Git, exceto este README e os arquivos
`*.example` versionados.
