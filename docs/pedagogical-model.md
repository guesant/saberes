# Modelo pedagógico e DX

Este documento registra as regras editoriais e os contratos técnicos usados pelo Portal Guesant Saberes. A aplicação continua local-first: o SQLite é somente leitura, o conteúdo é pré-publicado e o progresso fica no IndexedDB por meio do Dexie.

## Progressão mínima de uma aula

Uma aula publicada precisa declarar metadados editoriais e cobrir todas as funções abaixo. Uma seção pode cumprir mais de uma função, mas cada função deve aparecer explicitamente no campo `pedagogical_role`:

```text
context
analogy
intuition
formalization
limitation
example
guided_practice
independent_practice
application
review
```

A sequência serve como contrato editorial, não como uma ordem rígida de tela. O autor pode combinar seções quando isso melhorar a leitura, desde que a progressão continue verificável.

O modelo usa analogias como ponte entre uma situação conhecida e a formalização. Toda analogia deve ser seguida por seus limites, para evitar que uma imagem intuitiva seja confundida com a definição do conceito.

## Metadados obrigatórios

Cada aula possui:

- objetivo de aprendizagem;
- público-alvo;
- nível;
- duração estimada;
- pré-requisitos;
- fontes;
- versão editorial;
- status de revisão.

O validador `.tools/validate-content.ts` rejeita aulas publicadas com metadados incompletos ou sem a progressão mínima.

## Conteúdo rico seguro

`lesson_sections.content` continua sendo Markdown sanitizado. Blocos estruturados são armazenados em JSON e aceitam somente os tipos definidos em `packages/app/src/content/schema.ts`:

- callout;
- fórmula;
- imagem local com texto alternativo;
- vídeo por URL controlada;
- questão relacionada;
- resumo;
- tabela comparativa;
- gráfico;
- mapa de conhecimento;
- cena 3D parametrizada.

HTML arbitrário, scripts, código executável e blocos desconhecidos são descartados na fronteira. Gráficos, mapas e cenas 3D são recursos auxiliares: toda aula deve continuar legível quando o dispositivo não conseguir carregar a visualização.

## Feedback e diagnóstico

O feedback depende do contexto:

- aulas, listas e treinos corrigem imediatamente;
- simulados completos mostram a correção ao final;
- discursivas e redações ficam registradas para revisão manual.

Após uma tentativa, o sistema sugere um diagnóstico usando resultado, tempo e número de tentativas. O estudante pode confirmar, alterar ou ignorar a sugestão. Os códigos são:

```text
concept_gap       lacuna conceitual
did_not_know      não sabia
procedural_gap    erro procedimental
interpretation_gap erro de interpretação
strategy_gap      erro de estratégia
inattention       desatenção
forgetting        esquecimento
correct_with_doubt acerto com dúvida
correct_by_guess  acerto por chute
correct_confident acerto seguro
```

O diagnóstico não é uma sentença sobre o estudante. Ele orienta a próxima ação:

```text
lacuna conceitual → voltar à teoria e prática básica
erro procedimental → exercício procedimental
interpretação/estratégia → exercício contextualizado
desatenção → nova tentativa
esquecimento/dúvida/chute → revisão
acerto seguro → intervalo maior
```

## Domínio e memória

O app mantém dois estados independentes:

- aprendizagem: não iniciado, praticando ou dominado;
- memória: dificuldade, estabilidade, recuperabilidade e vencimento.

O domínio do tópico combina acertos, diagnóstico, recência, quantidade e dificuldade das tentativas, além da conclusão da teoria. A interface apresenta percentual e confiança baixa, média ou alta; nunca trata o domínio como uma verdade absoluta.

O FSRS é usado somente para memória. O adapter em `packages/pkg-adapter-data-v1/src/study/services.ts` serializa o cartão e guarda a versão do scheduler, mantendo a UI independente do pacote `ts-fsrs`.

O estudante pode revisar agora, adiar, suspender, reativar, editar o diagnóstico, alterar a dificuldade e reiniciar o agendamento. A recomendação FSRS é explicável e não bloqueia o restante da aplicação.

## Paulo Freire

Pedagogia crítica é uma área editorial própria do Catálogo. Ela pode conter cursos e questões sobre educação bancária, dialogicidade, autonomia, práxis e conscientização, com bibliografia e discussões críticas.

Esses conceitos não são injetados artificialmente em aulas de Matemática, Física ou Linguagens. A contribuição adotada para o produto é o respeito ao estudante como sujeito: explicitar objetivos, partir de contextos compreensíveis, convidar à reflexão e permitir que ele controle o diagnóstico e a revisão.

## Contratos técnicos

O conteúdo é acessado por `ContentRepository`; o progresso por `ProgressRepository`. TanStack Query fornece leitura, cache e invalidação sobre esses repositórios. Dexie é a persistência; Valibot valida as fronteiras; `date-fns` concentra regras de calendário.

Chaves locais são estáveis e sem dependência do ID numérico de um snapshot:

```text
course:preparacao-unicamp-2027
lesson:fisica.mecanica.aula-1
topic:matematica.funcoes
question:unicamp-2026-first-phase-23
plan:trilha-30-dias-unicamp-2027
assessment:unicamp-2026-first-phase
```

Uma atualização do SQLite pode substituir o conteúdo editorial, mas nunca apaga tentativas, diagnósticos, favoritos, conquistas, planos ativos ou sequência do estudante.
