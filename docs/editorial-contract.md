# Contrato editorial

## Capacidades do schema

O schema 5 é uma extensão aditiva do schema 4. Consumidores verificam tabelas e
colunas com `sqlite_master` e `PRAGMA table_info` antes de consultar capacidades
novas. IDs existentes, `occurrence_key`, slugs e chaves de progresso permanecem
estáveis. As migrations anteriores e o SQLite editorial não são substituídos.

| Tabela                         | Identidade e campos de leitura                                                                                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canonical_question_topics`    | `question_id`, `topic_id`, `relation_type`, `confidence`                                                                                                                                                                |
| `canonical_answer_keys`        | `id`, `question_id`, `occurrence_id` opcional, `question_part_id` opcional, `version`, `status`, `answer_type`, `answer_value`, `explanation`, `is_automatically_gradable`, `max_points`, `source_document_id` opcional |
| `canonical_answer_key_options` | `answer_key_id`, `question_option_id`                                                                                                                                                                                   |
| `question_occurrence_options`  | `occurrence_id`, `question_option_id`, `code`, `position`                                                                                                                                                               |
| `stimuli`                      | `id`, `slug`, `title`, `content`, `content_format`, `source_document_id`, `source_page`                                                                                                                                 |
| `content_assets`               | `id`, `path`, `media_type`, `alt_text`, `source_document_id`, `checksum`                                                                                                                                                |
| `question_stimuli`             | `question_id`, `stimulus_id`, `position`                                                                                                                                                                                |
| `stimulus_assets`              | `stimulus_id`, `asset_id`, `position`                                                                                                                                                                                   |
| `question_assets`              | `question_id`, `asset_id`, `position`                                                                                                                                                                                   |

`assessment_set_items.question_id` e `learning_course_items.question_id` permitem
questões autorais sem ocorrência. `question_occurrence_options.code` é o rótulo
da alternativa no caderno; `question_options.id` é a identidade canônica usada
para comparar respostas. Uma consulta nunca usa o rótulo de outro caderno para
corrigir uma resposta.

## Seleção de gabarito

`canonical_answer_keys.status` aceita `provisional`, `definitive` e `cancelled`.
A versão é um inteiro positivo crescente dentro de um escopo: questão,
ocorrência opcional e subitem opcional. Cada versão é única nesse escopo.

Para uma ocorrência, o consumidor escolhe primeiro seu escopo específico; se
ausente, escolhe o escopo canônico da questão. Dentro do escopo escolhido, usa a
versão definitiva ou cancelada mais recente antes de uma provisória. Um
cancelamento impede correção automática. Subitens são resolvidos separadamente.
Uma questão independente só usa o escopo canônico, sem ocorrência.

No schema 4, ou quando nenhum gabarito novo se aplica, `answer_keys` e
`answer_key_options` continuam sendo o contrato legado para aquela ocorrência.
Nunca se busca um gabarito legado de outra ocorrência ou questão.
