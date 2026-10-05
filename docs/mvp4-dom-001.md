# M4-DOM-001 — observação de duplicação local

## Escopo

Esta é uma observação interna e reproduzível da implementação atual do MVP3/MVP4. Ela não representa entrevista, telemetria ou pesquisa com pessoas. O objetivo é localizar pontos em que a interface pede novamente uma informação que já existe em outro registro.

## Evidências observadas

### 1. Associação editorial repetida como texto livre

Nota, checklist, captura e referência possuem `contentKey` opcional. A criação e a edição de cada registro exibem um campo separado para a mesma associação. O mesmo tópico ou lição pode, portanto, ser digitado várias vezes, com risco de grafia divergente.

Decisão: manter `contentKey` por compatibilidade do modelo atual, mas tratar a escolha de um contexto editorial como uma relação selecionável em um incremento posterior. A relação tipada deve ser a fonte de verdade para novos vínculos explícitos; ela não deve copiar o conteúdo editorial.

### 2. Captura promovida mantém procedência e associação

Quando uma captura vira nota ou atividade, o modelo preserva `sourceCaptureId` e propaga `contentKey`. Isso é procedência útil, não duplicação acidental: o registro promovido representa um novo estado de trabalho e continua apontando para a captura original.

Decisão: não remover `sourceCaptureId` nem substituir a captura por uma cópia. A UI deve apresentar a procedência como vínculo, e não pedir que a pessoa recadastre a captura.

### 3. Relação manual repete identificador e tipo

O composer de relações recebe quatro campos livres: ID e tipo da origem, ID e tipo do destino. A mesma entidade pode ser digitada em várias relações, e um ID inválido só é descoberto na resolução posterior.

Decisão: o contrato tipado já impede tipos desconhecidos no domínio. A próxima evolução deve trocar os campos livres por seletores de registros existentes e manter o composer como fallback para referências importadas ou ainda não disponíveis. Não será criado um segundo registro para representar a mesma entidade.

### 4. Referência possui fonte própria e pode apontar para conteúdo

`PersonalReference` guarda `source`, `location` e `contentKey`. Esses campos têm responsabilidades diferentes: a fonte identifica a origem externa ou local, a localização identifica onde encontrá-la e `contentKey` associa o registro a conteúdo editorial. Nenhum deles deve ser usado como substituto silencioso de `PersonalRelation`.

Decisão: usar `PersonalReference` para os metadados da fonte e `PersonalRelation` para vínculos entre registros. Uma relação pode ser arquivada/restaurada sem apagar a referência.

## Linguagem e invariantes resultantes

- `contentKey` é uma associação editorial compatível e pode permanecer ausente.
- `sourceCaptureId` é procedência de promoção, não uma cópia editável da captura.
- `PersonalRelation` é o vínculo explícito entre registros; não é um novo registro de conteúdo.
- Um mesmo registro pode participar de várias relações sem ser duplicado.
- Um endpoint ausente, importado ou inválido permanece identificável e não gera conteúdo inventado.
- A apresentação deve preferir selecionar uma entidade existente a pedir novamente seu identificador.

## Próximo incremento desbloqueado

O próximo incremento de maior valor é `Ancorar nota` com seleção de origem existente e abertura/retorno contextual. A criação de árvore, board, lentes persistidas, sincronização, plugins, IA e integrações permanece fora deste MVP.
