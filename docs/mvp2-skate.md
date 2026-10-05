# MVP2 — Skate

## M2-DOM-001 — problema local prioritário

### Problema

Uma pessoa quer transformar um intervalo curto e imprevisível em estudo efetivo, mesmo quando está sem rede. O principal atrito não é a falta de conteúdo: é não saber qual é o próximo passo, perder o ponto em que parou e não ter confirmação de que a tentativa foi registrada.

### Primeiro cenário de estudo

1. A pessoa abre a PWA sem rede.
2. A Home mostra o próximo passo local disponível ou orienta a escolher uma trilha.
3. A pessoa abre uma trilha e escolhe uma lição disponível.
4. A lição apresenta uma unidade curta de teoria ou exemplo.
5. A pessoa responde uma questão.
6. O sistema registra a tentativa e o progresso no armazenamento local.
7. A pessoa vê o resultado e pode retornar à lição, seguir para a próxima atividade ou encerrar.
8. Ao fechar e reabrir a PWA, o próximo passo e o registro permanecem disponíveis.

### Hipótese do produto

Se uma pessoa conseguir completar esse ciclo sem conta, backend ou rede, então o produto já entrega uma unidade de valor observável: estudar, praticar e retomar sem perder o estado local.

### Evidências no produto

- `packages/app/src/features/my-study`: Home, próximo passo, progresso e retomada.
- `packages/app/src/features/courses`: trilha, módulos e itens estudáveis.
- `packages/app/src/features/lessons`: leitura de lição e progresso local.
- `packages/app/src/features/exercises`: questão, tentativa, feedback e sessão de prática.
- `packages/pkg-adapter-data-v1`: conteúdo local e persistência do progresso.

### Critérios de aceite

- O cenário pode ser executado com a rede desabilitada depois que a aplicação e o conteúdo sintético foram carregados.
- A resposta da questão gera uma tentativa local sem depender de uma API.
- Recarregar a página não apaga a sessão, a tentativa nem o progresso observável.
- Cada falha fica isolada no nível da informação afetada e não impede a Home de renderizar o restante do fluxo.
- O cenário não pressupõe conta, sincronização, colaboração, IA, OCR, plugin ou conteúdo editorial publicado.

### Limites desta decisão

- Uma única pessoa e um único contexto local.
- Uma questão por vez no ciclo mínimo.
- Conteúdo sintético ou já empacotado localmente.
- Recomendações simples e determinísticas.
- Revisão, calendário, colaboração e conteúdo editorial completo permanecem nas fatias posteriores ou em `FUTURE`, conforme o backlog.

## M2-LANG-001 — linguagem ubíqua do Skate

O vocabulário abaixo usa os conceitos já presentes no domínio e na aplicação. Um termo de interface não cria uma entidade nova; quando o nome técnico for diferente, ele é apenas a representação do mesmo contrato.

| Termo canônico | Contrato existente                                                           | Uso válido                                                                   | Uso inválido                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Pessoa         | proprietária dos dados locais                                                | “A pessoa exporta seu progresso.”                                            | “Usuário autenticado” ou “membro” no fluxo local sem conta.                                                                        |
| Contexto       | escopo pessoal de estudo                                                     | “A pessoa estuda dentro de um contexto local.”                               | “Grupo”, “equipe” ou “workspace compartilhado”. `PersonalWorkspace` continua sendo o modelo do espaço pessoal, não uma comunidade. |
| Curso          | `LearningCourse`/`CourseReadModel`                                           | “A pessoa começa um curso e acompanha suas lições.”                          | Usar “trilha” como outra entidade para o mesmo curso.                                                                              |
| Disciplina     | `AcademicDiscipline`                                                         | “A disciplina possui notas e frequência próprias.”                           | Misturar disciplina acadêmica com tópico, curso ou material.                                                                       |
| Atividade      | ação de estudo ou organização que pode ser registrada                        | “A atividade foi iniciada e pode gerar uma sessão.”                          | Usar atividade como sinônimo de sessão, nota ou evento externo.                                                                    |
| Nota           | `PersonalNote`                                                               | “A pessoa cria uma nota privada.”                                            | Tratar nota como tentativa, resposta ou nota acadêmica. A nota acadêmica permanece uma `AcademicGrade`.                            |
| Sessão         | `StudySession` ou `FocusSession`, sempre com qualificativo quando necessário | “Sessão de estudo” registra prática; “sessão de foco” registra foco e pausa. | Usar uma sessão como sinônimo de curso, atividade ou tentativa.                                                                    |
| Tópico         | tópico de conhecimento referenciado pelo conteúdo                            | “A questão está ligada a um tópico.”                                         | Criar um tópico concorrente para cada curso, lição ou lente.                                                                       |
| Material       | recurso ou referência de estudo                                              | “O material pode estar disponível localmente ou apontar para uma fonte.”     | Prometer download de uma fonte externa ou tratar material como conteúdo editorial duplicado.                                       |

### Regras de linguagem

- `Curso` é o termo canônico do MVP2 para `LearningCourse`; `Trilha` não será criada como entidade ou port diferente.
- `Sessão de estudo` e `sessão de foco` são conceitos diferentes e precisam do qualificativo na UI quando houver ambiguidade.
- `Nota` pessoal e `nota` acadêmica não são o mesmo conceito; a segunda deve ser chamada de `nota acadêmica` quando aparecer fora do contexto acadêmico.
- `Material` é uma referência de estudo; abrir uma fonte não significa incorporá-la ao banco editorial.
- `Tópico` é reutilizável e não deve ser duplicado por curso, lente ou tela.
- Nenhum termo desta decisão pressupõe conta, grupo, membro, servidor, sincronização ou publicação.
