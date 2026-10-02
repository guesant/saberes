# Modelo de conteúdo multi-exame

O SQLite editorial local `.local/content/content.sqlite` é somente leitura durante o estudo no navegador e suporta múltiplos processos seletivos na mesma base. Ele não é publicado nesta fase.

## Hierarquia de provas

```text
universities
  -> admission_processes
    -> editions
      -> stages
        -> papers
          -> paper_versions
            -> question_occurrences
              -> questions
```

Uma `question` contém o conteúdo reutilizável. Uma `question_occurrence` representa sua presença em uma prova concreta e guarda número, disciplina, página, caderno e fonte.

## Tópicos e teoria

```text
topics                 catálogo global
  -> curricula          programa de uma edição
    -> curriculum_topics hierarquia daquele programa
```

Questões, aulas e materiais apontam para `curriculum_topics`, enquanto o tópico canônico fica em `topics`. Isso permite que Funções seja reutilizado entre ENEM, Unicamp e Fuvest com descrições e hierarquias específicas.

## Camada editorial de aprendizagem

Os cursos universitários são mantidos em `degree_programs`, enquanto `learning_courses` representa trilhas editoriais de estudo. Essa distinção evita que Medicina, por exemplo, seja confundida com um curso preparatório.

```text
learning_courses
  -> learning_course_modules
    -> learning_course_items
      -> lessons / assessment_sets / question_occurrences
```

Um curso pode ser geral, como `Fundamentos para Vestibulares`, ou específico, como `Preparação Unicamp 2027`. A relação `learning_course_targets` permite que uma mesma trilha seja compatível com vários processos ou edições.

Os tópicos canônicos também podem possuir relações em `topic_relations`:

- `parent`: hierarquia editorial;
- `prerequisite`: conhecimento recomendado antes de outro;
- `similar`: tópicos próximos;
- `related`: relação temática.

Tópicos irmãos são derivados pelo mesmo `curriculum_topics.parent_id`, sem duplicar relações no banco.

## Mapas e planos

`learning_maps` representa um mapa de domínio. Seus nós são tópicos de um currículo, em `learning_map_topics`, e suas dependências são registradas em `learning_map_edges`.

`study_plans` e `study_plan_steps` são planos editoriais publicados. O estudante pode iniciar uma cópia local no IndexedDB, marcar etapas, pausar e ajustar a ordem sem alterar o snapshot público.

O Catálogo é uma visão filtrável dos cursos, mapas, planos, aulas, questões e materiais publicados; não há uma tabela polimórfica duplicando esses conteúdos.

## Teoria rica e avaliações

`lesson_sections` usa Markdown sanitizado e `blocks_json` para blocos editoriais permitidos: chamadas, fórmulas, imagens locais, vídeos externos controlados, resumos, tabelas comparativas e links para questões. HTML arbitrário, scripts e URLs não seguras não são renderizados.

`assessment_sets` agrupa simulados, listas temáticas, redações e desafios avaliativos. `assessment_set_items` mantém a ordem, pontuação e referência para a ocorrência da questão. O conceito de Projeto não faz parte do domínio.

## Diferenças dos exames

- ENEM usa `assessment_areas`, `stages.day_number`, `paper_versions` e `languages`.
- Unicamp e Fuvest usam `stages` para fases, `question_parts` para subitens discursivos e `grading_rubrics` para correção por critérios.
- `scoring_rules.mode = raw_correct` é usado inicialmente. `tri_enabled` permanece desativado para o ENEM.
- Cursos, campi e modalidades são opcionais e ficam em `course_offerings` e `course_stage_requirements`.

## Rebuild do snapshot

O script `.tools/rebuild-content.ts` recebe uma base revisada em `SOURCE_DB` e gera o banco local final. O arquivo de origem não deve ser publicado:

```sh
SOURCE_DB=.local/content/source.sqlite \
OUTPUT_DB=.local/content/content.sqlite \
deno task content:rebuild
```

O progresso do estudante não entra no SQLite. Ele permanece no IndexedDB do navegador.

## Progresso local

Além de `attempts` e `sessions`, o IndexedDB usa identificadores estáveis para:

- `enrollments`: cursos iniciados;
- `lessonProgress`: aulas concluídas;
- `planProgress`: etapas concluídas dos planos;
- `bookmarks`: aulas e conteúdos salvos;
- `reviewItems`: itens separados para revisão.

O banco local é versionado para que a inclusão desses stores não apague o progresso já existente.

Também existem stores locais para `courseProgress`, `moduleProgress`, `dailyChallenges`, `studyGoals`, `streaks` e `achievements`. Pontos, sequência e conquistas são pedagógicos e não impõem limites de acesso.
