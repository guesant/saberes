# Backlog do Portal Saberes

Este arquivo contém somente trabalho ainda pendente. A sequência é uma progressão de produto local-first, não uma divisão de features por camada técnica:

`MVP1 núcleo de estudo → MVP2 Skate → MVP3 Patinete → MVP4 Bicicleta → MVP5 Moto → MVP6 Carro`

A regra central é: **todas as features de escopo local aparecem em todos os MVPs, mas com menos comportamento no início e mais completude no fim**. O MVP2 entrega a versão lite-lite; o MVP6 entrega a melhor versão possível em modo local-only singleplayer. O que depende de outras pessoas, rede, servidor ou processamento externo fica em `FUTURE`.

## Decisões de escopo

- `MVP1` permanece o núcleo local de estudo: PWA, conteúdo sintético, IndexedDB, curso, lição, questão, sessão, revisão, plano e Meu estudo.
- `MVP2` / **Skate:** registro manual, um contexto, poucos estados, uma pergunta respondida por vez.
- `MVP3` / **Patinete:** captura rápida, retomada, recorrência simples, inbox privado e organização cotidiana.
- `MVP4` / **Bicicleta:** relações entre objetos, checklists, materiais, prática, metas e progresso.
- `MVP5` / **Moto:** regras compostas, simulações, automações determinísticas, visualizações e tinta local.
- `MVP6` / **Carro:** versão local singleplayer mais completa, portátil, acessível, recuperável e preparada para grande volume.
- Cada MVP deve ser demonstrável sozinho e resolver uma necessidade real; nenhum depende da entrega do MVP seguinte.
- Todas as versões MVP2–MVP6 funcionam sem conta, backend, rede, servidor, identidade remota ou colaboração.
- OCR, IA, integrações externas, plugins, federação, self-host, sincronização remota, grupos, chat entre pessoas, comunidade, publicação pública e vocabulário personalizado ficam exclusivamente em `FUTURE`.
- Conteúdo editorial publicado, pipeline editorial e curadoria ficam em `FUTURE`; os MVPs podem usar fixtures sintéticas e dados criados localmente.

## Regras preservadas do backlog anterior

- [ ] Cada fatia de MVP deve ser demonstrável sem conta, backend ou rede.
- [ ] O progresso local é autoritativo e não pode ser perdido por atualização de schema, conteúdo ou restauração parcial.
- [ ] Loading, erro, vazio, indisponibilidade, conteúdo parcial e recuperação devem ser tratados no nível da informação afetada.
- [ ] Os termos canônicos existentes no domínio prevalecem; não criar sinônimos como entidades concorrentes.
- [ ] O check diário permanece leve; heavy-checks não entram no fluxo padrão.
- [ ] Nenhum item de `FUTURE` é requisito para estudar offline.

## Como ler a matriz

Cada linha abaixo é uma família de telas do mockup. Cada coluna é uma versão da **mesma feature**, com incremento de capacidade:

- **Skate:** o menor caso útil, manual e reversível.
- **Patinete:** menos atrito para capturar, repetir e retomar.
- **Bicicleta:** conexão com outras partes do estudo.
- **Moto:** regras, cenários, visualizações e automações locais.
- **Carro:** cobertura ampla, portabilidade, recuperação, acessibilidade e escala local.
- **FUTURE:** somente a capacidade que não pode ser singleplayer/local-only.

## Matriz de progressão local-only

| Telas/features                         | MVP2 — Skate                                        | MVP3 — Patinete                                  | MVP4 — Bicicleta                                     | MVP5 — Moto                                              | MVP6 — Carro                                                        | FUTURE                                                |
| -------------------------------------- | --------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| `HM1–HM3` Home                         | Home fixa: hoje, próximo passo e progresso          | ordenar/ocultar blocos e restaurar               | lentes por trilha e contexto pessoal                 | cards, filtros, presets e visões                         | composição completa, performance e pacote da Home                   | colaboração, feed social e Home compartilhada         |
| `T1–T3` Trilhas/regras                 | uma trilha, uma regra e onboarding curto            | várias trilhas e edição simples                  | metas, módulos e perfis ligados à trilha             | regras modulares, presets locais e cenários              | contextos pessoais completos, migração e exportação                 | vocabulário compartilhado e regras de grupo           |
| Calendário e `D1–D2`                   | atividade única, data, estado e captura textual     | lista/mês/semana, recorrência simples e retomada | checklist, preparação e dependência entre atividades | RRULE, exceções, conflitos e rearranjo determinístico    | grande volume, histórico, importação/exportação local e recuperação | calendários externos e colaboração                    |
| `M1–M2`, `F1–F4`, `JF1–JF2`            | uma disciplina, presença/falta e regra manual       | histórico, justificativas e alertas locais       | vínculos com aulas, atividades e calendário          | simulações, risco, frequência por disciplina/período     | regras compostas, auditoria, migração e projeções                   | integração institucional e dados de terceiros         |
| `GP1–GP2`, `NT1–NT2`, `IC1–IC3`        | período, nota, crédito e horas lançados manualmente | histórico e lembretes locais                     | dependências, provas, baldes e evidências            | cenários de aprovação e conclusão                        | curso completo, múltiplos períodos e pacote restaurável             | integração institucional e colaboração                |
| `GH1–GH3` Grade                        | horários manuais em uma semana                      | semana/mês pessoal e conflito simples            | recorrência e exceções básicas                       | cinco modelos de grade, RRULE e conflitos compostos      | consolidação, recuperação e grandes calendários locais              | iCal, calendários e fontes externas                   |
| `B1–B2`, `E2–E3` Busca/estados         | buscar itens básicos e tratar vazio                 | recentes, filtros e criar captura                | notas, materiais e referências indexados             | índice incremental, comandos e ações reversíveis         | reconstrução de índice, desempenho e escopos de privacidade         | busca em bases externas                               |
| `WB1–WB3` Retorno/feedback             | recap simples e dados locais                        | feedback contextual e retomada                   | histórico de evolução e revisão pessoal              | análise local de abandono, carga e sensação              | histórico exportável e controles de retenção                        | envio de feedback e perfil remoto                     |
| `G1–G2`, `J1–J2` Contexto/grupo        | contexto pessoal; criar/abrir espaço local          | alternar curso, período, disciplina e projeto    | contexto pessoal com atividades e referências        | regras e visões por contexto                             | múltiplos contextos, pacote e restauração                           | grupo, convite, membros e permissões                  |
| `GA1–GA2`, `DP1–DP2` Divisão           | checklist e partes atribuídas a si                  | subtarefas, dependências e cobertura pessoal     | partes ligadas a notas e atividades                  | cenários de esforço e rearranjo local                    | histórico, templates e exportação                                   | subgrupos e atribuição a pessoas                      |
| `RE1–RE2`, `EL1–EL2` Eventos           | evento pessoal e planejamento manual                | recorrência, lembrete e registro privado         | dependência com provas e atividades                  | sugestão determinística local e cenários                 | regras de calendário completas e recuperação                        | RSVP, presença e encontro compartilhado               |
| `ME1`, `MF1–MF3` Metas                 | meta única e sessão de estudo                       | hábito, streak e marcos simples                  | metas ligadas a trilhas e atividades                 | projeções, revisão e adaptação de cenários               | plano de longo prazo completo e histórico                           | metas compartilhadas                                  |
| `ED1–ED2`, `CL1` Concurso/curso        | checklist de edital ou módulo manual                | progresso por tópicos e sessões                  | simulado, revisão e progresso por módulo             | cobertura, risco e projeções locais                      | histórico completo, certificados e pacotes locais                   | conteúdo, prova ou certificado externo                |
| `DL1–DL2` Trilhas gamificadas          | sequência pessoal de passos                         | unidades, marcos e retomada                      | exercícios e revisão ligados à trilha                | desbloqueios, XP e regras configuráveis                  | editor local completo e exportação                                  | publicação e trilha compartilhada                     |
| `EX1–EX3`, `KH1` Exercícios/quiz       | um exercício criado e praticado                     | banco local e sessão simples                     | tópicos, confiança e revisão espaçada                | simulados, recomendações determinísticas e modo quiz     | banco grande, filtros, importação/exportação local                  | bases externas, quiz ao vivo e participantes          |
| `K1–K3`, `KC1–KC2` Notas               | uma nota textual e uma captura                      | cadernos, Markdown e checklist real              | backlinks, âncoras e notas conectadas                | blocos, tinta local simples e relações compostas         | editor local completo, histórico, busca e restauração               | OCR, IA, mídia processada e edição colaborativa       |
| `LK1–LK3`, `TC1–TC2` Conhecimento      | árvore simples e ligação manual                     | árvore/board pessoal                             | relações tipadas e backlinks                         | grafo, mapa, dependências e visualizações                | todos os tipos, filtros, fallback e pacote verificável              | merge, curadoria e mapa comunitário                   |
| `DM1–DM2` Lentes/mapas                 | trocar entre duas visões locais                     | salvar uma lente pessoal                         | presets locais e fork da própria organização         | lentes compostas e comparação                            | catálogo local, versão, restauração e exportação                    | catálogo comunitário, publicação e merge              |
| `AC1–AC2`, `MT1` Acervo/material       | referência, ficha e abertura da fonte               | favoritos, resenha e estado de acesso            | material ligado à disciplina, nota e atividade       | listas, filtros e recomendações determinísticas pessoais | acervo grande, backup e restauração                                 | player/integrador externo, perfil e comunidade        |
| `MT2–MT3` Acervo social                | perfil privado da própria biblioteca                | listas privadas e resenha pessoal                | recomendações com base apenas nos próprios dados     | preferências e explicações locais                        | biblioteca pessoal completa e exportável                            | seguir, perfil público, recomendações comunitárias    |
| `CH1–CH2`, `CX1–CX2` Conversas         | captura textual privada                             | inbox/thread consigo mesmo                       | âncoras em nota, atividade e material                | busca, filtros e organização local das capturas          | histórico, exportação e restauração completos                       | chat, canais, descoberta pública e sincronização      |
| `GM1–GM3`, `CO1–CO2` Gamificação/apoio | revisão e progresso individual                      | streak, XP simples e resumo pessoal              | flashcards, retenção e evolução                      | XP, conquistas, consentimentos e apoio local             | histórico completo e preferências por contexto                      | ligas, apoio entre pessoas e ranking                  |
| `PD1–PD3` Pausas                       | pomodoro simples e pausa solo                       | ciclos configuráveis e minijogos solo simples    | foco ligado a tema e sessão                          | pausa, respiração e minijogos solo completos             | histórico, acessibilidade e recuperação                             | duo, trio, multiplayer e presença                     |
| `CP1–CP4` Cadernos                     | um caderno privado                                  | árvore, seções e privacidade local               | notas, checklists e relações no caderno              | templates e pacotes locais                               | pré-visualizar/exportar/restaurar caderno completo                  | publicação pública, link e colaboração                |
| `FD1–FD3` Feed/widgets                 | timeline das próprias ações                         | filtros e blocos pessoais                        | timeline por contexto e disciplina                   | controle local de o quê/onde/quando                      | feed pessoal completo dentro da PWA                                 | feed social, amigos e widget de sistema               |
| `TP1–TP3` Tópicos                      | tópico privado e itens salvos                       | lista pessoal de interesses                      | referências ligadas a tópicos                        | lentes, filtros e recomendações locais                   | catálogo pessoal e exportação                                       | postagem pública, seguidores e comunidade             |
| `BE1–BE3` Bem-estar                    | check-in privado simples                            | histórico e lembretes opt-in                     | relação com sessões e carga                          | sinais locais de sobrecarga e sugestões não clínicas     | histórico, retenção e desligamento completos                        | serviço externo, diagnóstico ou acompanhamento remoto |
| `PM1`, `CN1–CN2` Modo/consentimento    | modo e sim/não/agora não                            | preferências por contexto                        | histórico de decisões                                | regras compostas e auditoria local                       | migração, revisão e exportação                                      | consentimento de serviços externos                    |
| `AJ1–AJ2`, `S1–S3` Ajustes/dados       | hub, privacidade, dados e ajuda                     | exportar/importar/apagar por escopo              | backup local e restauração simples                   | prévia, checksum e migração                              | pacote verificável, recuperação parcial e grande volume             | conta remota, servidor e sincronização                |

### Rastreabilidade dos códigos do anexo

Os códigos abaixo são os identificadores individuais cobertos pela matriz; um intervalo na tabela não elimina nenhuma tela intermediária.

- Home: `HM1`, `HM2`, `HM3`.
- Trilhas: `T1`, `T2`, `T3`.
- Atividades e calendário: `D1`, `D2`, `LX1`, `LX2`.
- Acadêmico: `M1`, `M2`, `F1`, `F2`, `F3`, `F4`, `JF1`, `JF2`, `GP1`, `GP2`, `NT1`, `NT2`, `IC1`, `IC2`, `IC3`.
- Grade, busca e estados: `GH1`, `GH2`, `GH3`, `B1`, `B2`, `E2`, `E3`, `WB1`, `WB2`, `WB3`.
- Contextos e eventos: `G1`, `G2`, `J1`, `J2`, `GA1`, `GA2`, `DP1`, `DP2`, `RE1`, `RE2`, `EL1`, `EL2`.
- Metas e aprendizagem: `ME1`, `MF1`, `MF2`, `MF3`, `ED1`, `ED2`, `CL1`, `DL1`, `DL2`, `EX1`, `EX2`, `EX3`, `KH1`.
- Conhecimento: `K1`, `K2`, `K3`, `KC1`, `KC2`, `LK1`, `LK2`, `LK3`, `TC1`, `TC2`, `DM1`, `DM2`.
- Acervo e conversas: `AC1`, `AC2`, `MT1`, `MT2`, `MT3`, `CH1`, `CH2`, `CX1`, `CX2`.
- Gamificação, pausas e bem-estar: `GM1`, `GM2`, `GM3`, `CO1`, `CO2`, `PD1`, `PD2`, `PD3`, `BE1`, `BE2`, `BE3`.
- Cadernos, feed e tópicos: `CP1`, `CP2`, `CP3`, `CP4`, `FD1`, `FD2`, `FD3`, `TP1`, `TP2`, `TP3`.
- Controle e configurações: `PM1`, `AJ1`, `AJ2`, `S1`, `S2`, `S3`, `CN1`, `CN2`.

## Checklist transversal da matriz

- [ ] Cada célula da matriz é implementada como uma fatia vertical demonstrável; não criar uma tela vazia apenas para marcar presença.
- [ ] A versão de uma feature em cada MVP mantém a mesma linguagem ubíqua e o mesmo identificador de domínio.
- [ ] O MVP seguinte amplia estados, regras, relações ou volume; não troca a necessidade por uma feature sem relação.
- [ ] O que ainda não couber em uma versão é ocultado, desativado ou apresentado como limite explícito, sem simular rede ou colaboração.
- [ ] Cada fatia tem estado vazio, erro, indisponibilidade, cancelamento, recuperação, acessibilidade e desfazer proporcional ao seu escopo.
- [ ] Dados pessoais, faltas, notas, humor e progresso permanecem privados em todos os MVPs.

## Checklist de modelagem do domínio

Esta ordem é obrigatória antes de transformar uma nova fatia em implementação.

1. [ ] **Entender o domínio antes da arquitetura:** observar o fluxo real, decisões, interrupções, evidências e perdas; registrar o problema que a fatia resolve.
2. [ ] **Construir a linguagem ubíqua:** definir termos, exemplos, estados, eventos e invariantes; não tratar atividade, sessão, nota, material, tópico, disciplina, plano, contexto e grupo como sinônimos.
3. [ ] **Identificar subdomínios:** separar estudo/aprendizagem, organização pessoal, situação acadêmica, conhecimento, comunicação, social e plataforma.
4. [ ] **Delimitar bounded contexts:** registrar entidades e regras de cada contexto e diferenciar referência, projeção e snapshot.
5. [ ] **Mapear relações entre contextos:** declarar tradução, cópia local, ausência de relação e comportamento quando a fonte não está disponível.
6. [ ] **Modelar cada contexto:** explicitar agregados, entidades, value objects, comandos, consultas, eventos, invariantes e estados de erro.
7. [ ] **Separar domínio de infraestrutura:** manter regras independentes de IndexedDB, PWA, browser APIs, rede, bibliotecas gráficas e provedores.
8. [ ] **Definir casos de uso:** escrever pré-condições, fluxo principal, alternativas, pós-condições, privacidade, desfazer e critérios de aceite.
9. [ ] **Integrar contextos conscientemente:** escolher referência, snapshot, tradução, fila ou integração externa somente quando houver valor demonstrado.
10. [ ] **Refinar o modelo continuamente:** revisar a linguagem após testes e remover abstrações que não melhoram a experiência.

### Vocabulário inicial

- **Pessoa:** proprietária dos dados locais e das decisões de privacidade.
- **Contexto pessoal:** curso, período, disciplina, concurso ou projeto local; não é grupo social.
- **Atividade:** algo que a pessoa pretende executar, com estado, prazo, recorrência, duração e referências.
- **Captura:** entrada rápida ainda não classificada como atividade, nota ou material.
- **Nota:** registro pessoal de conhecimento ligado opcionalmente a tópicos, aulas, questões, atividades ou materiais.
- **Material:** referência ou recurso de estudo; abrir uma fonte não significa baixá-la.
- **Sessão:** intervalo de estudo, prática, revisão ou realização de atividade.
- **Plano:** ordenação intencional de atividades, revisões ou metas.
- **Tópico:** conceito ou assunto em uma hierarquia que pode aparecer em várias lentes.
- **Lente:** organização/visualização dos mesmos dados; não cria cópia concorrente.
- **Contexto compartilhado:** espaço de mais de uma pessoa; não existe nos MVPs iniciais.

### Subdomínios e bounded contexts iniciais

- [ ] **Estudo:** catálogo local, curso, aula, questão, sessão, tentativa, revisão e tópicos.
- [ ] **Organização pessoal:** capturas, atividades, planos, calendário, recorrências, metas, hábitos e foco.
- [ ] **Situação acadêmica:** disciplinas, regras, notas, frequência, justificativas, integralização e projeções.
- [ ] **Conhecimento pessoal:** cadernos, notas, blocos, referências, relações, exercícios e mapas.
- [ ] **Preferências e controle:** Home, lentes, modo, consentimento, privacidade, backup, importação e exclusão.
- [ ] **Comunicação e colaboração:** grupo, convite, canal, mensagem, presença, divisão e sincronização; somente `FUTURE`.
- [ ] **Social e publicação:** perfil público, seguir, feed, recomendações, comunidade e federação; somente `FUTURE`.

## Mapa de bounded contexts e contratos de domínio

Esta seção é a ponte entre entender o domínio e escrever código. Nenhum contexto deve ser implementado apenas porque uma tela precisa de dados; primeiro marcar sua responsabilidade, seu vocabulário, seus invariantes e suas relações.

### Contexto de Estudo e Aprendizagem

- [ ] **Responsabilidade:** representar conteúdo estudável local, curso, aula, questão, tentativa, sessão, revisão, domínio e progresso de aprendizagem.
- [ ] **Possui:** `LearningCourse`, `Lesson`, `Question`, `StudySession`, `StudyAttempt`, `ReviewItem`, `Topic` e `TopicMastery`.
- [ ] **Não possui:** nota institucional, falta, calendário pessoal, publicação editorial, grupo, identidade ou recomendação baseada em IA.
- [ ] **Comandos:** iniciar/retomar/concluir sessão, responder questão, pausar, marcar favorito, registrar diagnóstico, agendar revisão e registrar domínio.
- [ ] **Consultas:** obter curso/aula/questão, progresso, resultado, fila de revisão, domínio por tópico e próximo passo determinístico.
- [ ] **Invariantes:** tentativa pertence a uma sessão; sessão não perde estado ao pausar; revisão usa somente dados disponíveis; progresso não é apagado por conteúdo editorial ausente.
- [ ] **Relações:** recebe referência de `Topic` do Conhecimento; expõe progresso para Home, Plano e Visualizações; não grava diretamente em Situação Acadêmica.
- [ ] **Portas locais:** repositório de conteúdo sintético, repositório de progresso, relógio, gerador de identificador e armazenamento de revisão; adapters ficam fora do domínio.
- [ ] **Evolução:** Skate lê e registra um item; Patinete retoma e revisa; Bicicleta liga tópico/exercício; Moto calcula recomendações determinísticas; Carro migra, exporta e recupera o contexto inteiro.

### Contexto de Organização Pessoal

- [ ] **Responsabilidade:** representar captura, atividade, checklist, plano, calendário pessoal, recorrência, meta, hábito, sessão de foco e evento privado.
- [ ] **Possui:** `Capture`, `StudyActivity`, `Checklist`, `StudyPlan`, `CalendarEntry`, `RecurrenceRule`, `Goal`, `Habit`, `FocusSession` e `PersonalEvent`.
- [ ] **Não possui:** presença institucional, membros de grupo, RSVP remoto, notificação externa, calendário de terceiros ou chat multiusuário.
- [ ] **Comandos:** criar/editar/concluir/adiar/arquivar/restaurar atividade, converter captura, adicionar checklist, iniciar foco, registrar hábito e replanejar.
- [ ] **Consultas:** agenda por período, hoje, próximos passos, atrasados, recorrências, conflitos, carga, metas e sequência.
- [ ] **Invariantes:** identificador é estável; arquivar não equivale a apagar; recorrência gera ocorrências rastreáveis; captura não exige classificação; plano não altera nota acadêmica sozinho.
- [ ] **Relações:** referencia `Lesson`, `Question`, `Topic`, `AcademicDiscipline` e `StudyGoal`; Home e Busca projetam seus dados; não possui o conteúdo referido.
- [ ] **Portas locais:** armazenamento de atividades, calendário, relógio/fuso local, notificações internas e scheduler local; nenhuma porta externa nos MVPs.
- [ ] **Evolução:** Skate registra uma atividade; Patinete captura e repete; Bicicleta conecta dependências; Moto simula conflitos/rearranjos; Carro exporta, restaura e suporta grande volume.

### Contexto de Situação Acadêmica

- [ ] **Responsabilidade:** registrar a interpretação pessoal de disciplinas, períodos, notas, faltas, regras, justificativas, créditos e integralização.
- [ ] **Possui:** `AcademicDiscipline`, `AcademicPeriod`, `AttendanceRule`, `AttendanceRecord`, `AcademicGrade`, `GradeRule`, `Justification`, `CreditBucket` e `AcademicEvidence`.
- [ ] **Não possui:** fonte institucional, verdade oficial da universidade, autenticação remota ou sincronização automática.
- [ ] **Comandos:** criar/editar/remover disciplina, registrar presença/falta, justificar, lançar nota, configurar peso, simular falta, simular nota e lançar horas.
- [ ] **Consultas:** faltas restantes, dias permitidos, risco por disciplina/período, nota necessária, progresso do curso e integralização.
- [ ] **Invariantes:** falta é individual; nota e frequência são regras separadas; cada cálculo expõe origem e fórmula; alteração inválida não destrói valor anterior; optativa pode ter regra própria.
- [ ] **Relações:** referencia calendário/grade e atividades; recebe evidências de materiais/arquivos locais; publica projeções para Home e Plano, não comandos ocultos.
- [ ] **Portas locais:** armazenamento acadêmico, calculadora pura, parser de regra local, exportação e importação; adapters institucionais ficam em `FUTURE`.
- [ ] **Evolução:** Skate lança dados simples; Patinete registra histórico/justificativas; Bicicleta liga provas e calendário; Moto simula cenários compostos; Carro migra histórico completo e restaura cálculos.

### Contexto de Conhecimento Pessoal

- [ ] **Responsabilidade:** organizar notas, cadernos, blocos, referências, tópicos, relações, mapas, exercícios e lentes pessoais.
- [ ] **Possui:** `Notebook`, `Note`, `NoteBlock`, `NoteChecklist`, `Reference`, `KnowledgeTopic`, `TypedRelation`, `KnowledgeMap`, `Exercise` e `PersonalLens`.
- [ ] **Não possui:** OCR, resumo por IA, publicação pública, autoria compartilhada, catálogo comunitário ou conteúdo editorial canônico.
- [ ] **Comandos:** criar/editar/mover nota, criar caderno, adicionar bloco, criar checklist, ligar/desligar relação, criar exercício, mudar lente e arquivar.
- [ ] **Consultas:** árvore de cadernos, nota por âncora, backlinks, mencionado em, tudo conectado, mapa, board, exercícios por tópico e referências.
- [ ] **Invariantes:** nota é o átomo; organização não duplica conteúdo; checklist ligado à tarefa é rastreável; relação tem tipo e origem; apagar uma lente não apaga o conceito.
- [ ] **Relações:** referencia entidades de Estudo, Organização e Acadêmico; fornece projeções para Busca, Home e Revisão; a fonte da relação continua no contexto proprietário.
- [ ] **Portas locais:** armazenamento de notas, parser Markdown, índice, renderizador, desenho local simples, exportador e importador; IA/OCR ficam em `FUTURE`.
- [ ] **Evolução:** Skate nota/árvore; Patinete cadernos/checklist; Bicicleta backlinks/exercícios; Moto grafo/mapa/tinta; Carro histórico, migração, pacote e restauração.

### Contexto de Preferências, Controle e Continuidade

- [ ] **Responsabilidade:** controlar Home, lentes, modos, consentimentos, privacidade, capacidades, exportação, importação, backup, migração e exclusão local.
- [ ] **Possui:** `HomeLayout`, `LensPreference`, `FeatureCapability`, `ConsentDecision`, `PrivacyScope`, `BackupPackage`, `MigrationRecord` e `DeletionReceipt`.
- [ ] **Não possui:** conta remota, identidade, sessão externa, servidor, sincronização ou vocabulário compartilhado.
- [ ] **Comandos:** ativar/desativar capacidade, aceitar/recusar/revisar consentimento, exportar, pré-visualizar, restaurar, migrar, apagar e desfazer.
- [ ] **Consultas:** capacidades ativas, escopo de privacidade, procedência, créditos, licenças, versão do banco, saúde do backup e histórico de decisões.
- [ ] **Invariantes:** consentimento é explícito e reversível; apagar informa escopo; pacote tem versão/checksum; restauração parcial não apaga dados válidos; capacidade indisponível não bloqueia o estudo.
- [ ] **Relações:** governa os demais contextos por política/projeção; não altera regras de domínio silenciosamente; recebe metadados dos contextos para exportação.
- [ ] **Portas locais:** IndexedDB, File API, armazenamento de preferências, checksum, migração e download/upload local; APIs remotas ficam em `FUTURE`.
- [ ] **Evolução:** Skate preferências básicas; Patinete escopos/exportação; Bicicleta backup; Moto checksum/migração; Carro pacotes verificáveis, restauração parcial e retenção.

### Contexto de Comunicação e Colaboração — `FUTURE`

- [ ] **Responsabilidade futura:** grupo, convite, membro, canal, mensagem, presença, divisão entre pessoas, RSVP e sincronização.
- [ ] **Versão local permitida:** captura/inbox/thread consigo mesmo permanece em Organização/Conhecimento; não criar um agregado `Chat` falso nos MVPs.
- [ ] **Invariantes futuras:** faltas, notas, humor e progresso privado não entram automaticamente em grupo ou chat; autoria, permissão e histórico são explícitos.
- [ ] **Relações futuras:** dependerá de Identidade/Sincronização; consumirá referências de Atividade/Conhecimento por snapshot ou âncora, nunca por acesso direto ao banco privado.
- [ ] **Evolução futura:** ETP com pacote fictício; EUP com grupo privado mínimo; ELP com transporte, conflitos, moderação, recuperação e revogação.

### Contexto Social, Publicação e Ecossistema — `FUTURE`

- [ ] **Responsabilidade futura:** perfil público, seguir, feed social, recomendações comunitárias, publicação, comunidade, plugins, federação e self-host.
- [ ] **Versão local permitida:** perfil da própria biblioteca, timeline das próprias ações, listas privadas e presets locais continuam nos contextos locais.
- [ ] **Invariantes futuras:** procedência, crédito, licença, privacidade e retirada devem acompanhar qualquer publicação; dados acadêmicos privados não são socializados.
- [ ] **Relações futuras:** receberá pacotes versionados de Conhecimento/Acervo e retornará referências adotadas, forks ou snapshots, sem sobrescrever dados pessoais.
- [ ] **Evolução futura:** ETP sem dados pessoais; EUP com publicação opt-in; ELP com moderação, migração, auditoria, federação e recuperação.

## Contratos entre contextos

- [ ] Definir `LearningCourse`/`Lesson` como fonte de conteúdo de Estudo; notas e atividades guardam referência ou snapshot, não cópia editorial concorrente.
- [ ] Definir `Topic` como referência compartilhável entre Estudo e Conhecimento; cada contexto mantém apenas os campos que possui.
- [ ] Definir `StudyActivity` como fonte de atividade pessoal; checklist de Nota aponta para ela por identificador estável e não cria uma segunda tarefa.
- [ ] Definir `AcademicDiscipline` como fonte de regra acadêmica; calendário/grade referencia disciplina, mas não recalcula a regra por conta própria.
- [ ] Definir `StudyPlan` como ordenação de passos; Home, calendário e metas projetam seu estado sem assumir propriedade do plano.
- [ ] Definir `PersonalReference` como fonte do acervo; nota, disciplina e atividade guardam vínculo, origem e estado de acesso.
- [ ] Definir `TypedRelation` como contrato de Conhecimento; origem, destino, tipo e autoria local são obrigatórios.
- [ ] Definir `PrivacyScope` antes de qualquer projeção para Home, Busca, exportação ou timeline.
- [ ] Definir comportamento quando a referência estiver ausente, inválida, arquivada, parcialmente restaurada ou indisponível.
- [ ] Proibir dependência circular entre adapters; composição deve ocorrer em casos de uso ou read models.

## Ficha obrigatória de cada fatia

Antes de marcar qualquer célula da matriz como “em desenvolvimento”, preencher esta ficha no backlog da própria fatia. A ficha é o Definition of Ready; sem ela, o item continua em descoberta.

- [ ] **Problema:** escrever quem precisa fazer o quê, em qual situação, com qual dor e qual evidência será observada.
- [ ] **Escopo da versão:** declarar o que entra nesta coluna do MVP, o que fica para a próxima coluna e o que é exclusivamente `FUTURE`.
- [ ] **Linguagem:** registrar termos canônicos, sinônimos proibidos, estados, eventos e exemplos válidos/ inválidos.
- [ ] **Contexto:** apontar bounded context proprietário, agregados envolvidos, referências externas e read models derivados.
- [ ] **Comando:** nomear ação, ator local, pré-condições, validações, mudança de estado, evento e pós-condições.
- [ ] **Consulta:** nomear pergunta, escopo de privacidade, fonte, ordenação, paginação/limite e comportamento sem dados.
- [ ] **Invariantes:** listar regras que nunca podem ser quebradas, inclusive ao editar, desfazer, migrar ou restaurar parcialmente.
- [ ] **Persistência:** definir identificador, campos obrigatórios/opcionais, timestamps, versão do registro, tombstone local e migração.
- [ ] **Infraestrutura:** declarar portas necessárias e adapters locais; o domínio não importa IndexedDB, React, browser API ou biblioteca visual.
- [ ] **Estados de interface:** especificar carregando, vazio, pronto, parcial, erro recuperável, erro permanente, indisponível e cancelado.
- [ ] **Privacidade:** declarar proprietário, escopo, procedência, exportação, retenção e comportamento ao apagar.
- [ ] **Acessibilidade:** definir foco inicial, ordem de teclado, nome acessível, contraste, toque, leitor de tela e fallback textual.
- [ ] **Teste de domínio:** cobrir regra pura, invariantes, transições válidas/ inválidas, datas, limites e casos de dados ausentes.
- [ ] **Teste de aplicação:** cobrir comando/consulta, adapter falso, erro de dependência, idempotência, desfazer e recuperação.
- [ ] **Teste de interface:** cobrir estados, navegação, foco, ação reversível, telas pequenas e conteúdo longo.
- [ ] **Demonstração:** descrever um roteiro sem rede que uma pessoa consiga executar e observar em poucos minutos.
- [ ] **Aprendizado:** registrar hipótese, sinal de sucesso, pergunta aberta, feedback esperado e decisão após teste.

## Definition of Done de cada fatia

- [ ] O caso de uso funciona sem rede e sem conta na coluna correspondente.
- [ ] O modelo de domínio não depende do componente visual ou do adapter de armazenamento.
- [ ] O registro sobrevive a fechar/reabrir, recarregar e atualizar schema dentro do suporte declarado.
- [ ] Erro de uma dependência não impede contextos independentes de renderizar.
- [ ] A ação destrutiva tem confirmação, escopo, exportação opcional e desfazer quando tecnicamente possível.
- [ ] Os dados exportados podem ser validados antes da restauração e a restauração informa o resultado por entidade.
- [ ] A tela não promete colaboração, sincronização, IA, integração ou conteúdo que a versão não oferece.
- [ ] Critérios de aceite foram executados com dados vazio, mínimo, normal, grande, inválido e parcialmente recuperado.
- [ ] O roteiro de demonstração foi executado por outra pessoa sem explicação do implementador.
- [ ] O aprendizado do teste foi incorporado ao vocabulário, modelo ou próxima fatia.

## Gates de passagem entre MVPs

### Entrada no MVP2 — Skate

- [ ] O problema local prioritário foi observado e descrito antes de escolher arquitetura.
- [ ] A linguagem ubíqua mínima foi validada para Pessoa, Contexto, Atividade, Nota, Sessão, Tópico e Material.
- [ ] O bounded context proprietário de cada dado está definido.
- [ ] Existe uma demonstração local de ponta a ponta usando dados sintéticos ou criados na hora.
- [ ] O escopo exclui explicitamente rede, conta, colaboração e processamento pesado.

### Saída do MVP2 / entrada no MVP3 — Patinete

- [ ] A pessoa consegue concluir o fluxo básico sem perder dados após recarregar.
- [ ] Estados vazios e erros das telas básicas são compreensíveis e recuperáveis.
- [ ] Há evidência de onde a captura manual, a retomada ou a recorrência simples reduzem atrito.
- [ ] Identificadores, eventos e migrações do Skate estão estáveis o suficiente para ampliar, sem congelar o modelo.
- [ ] O backlog registra o que deve permanecer simples no Patinete para não antecipar complexidade.

### Saída do MVP3 / entrada no MVP4 — Bicicleta

- [ ] Captura, atividade, nota, referência, tópico e sessão podem ser reencontrados por identificador e contexto.
- [ ] Checklist dentro de Nota e Atividade não geram duplicidade nem divergência de estado.
- [ ] Busca local e exportação básica cobrem os dados criados nos MVPs anteriores.
- [ ] Existem relações tipadas mínimas e uma política para referência ausente/arquivada.
- [ ] A pessoa consegue passar de captura a prática/revisão sem copiar dados manualmente entre telas.

### Saída do MVP4 / entrada no MVP5 — Moto

- [ ] Relações, dependências, regras acadêmicas e metas têm origem e fórmula explicáveis.
- [ ] O sistema distingue fato registrado, projeção, hipótese e recomendação determinística.
- [ ] Grafo, mapa, calendário e cálculos têm fallback textual e falha isolada.
- [ ] Há evidência de que cenários, visualizações ou automações locais resolvem uma decisão recorrente.
- [ ] Nenhuma automação altera dados canônicos sem confirmação, histórico e desfazer.

### Saída do MVP5 / entrada no MVP6 — Carro

- [ ] Todos os contextos pessoais possuem exportação, migração e restauração testadas.
- [ ] A reconstrução de índices e read models funciona após restauração parcial.
- [ ] A experiência permanece útil com grande volume local, armazenamento limitado e biblioteca visual indisponível.
- [ ] Privacidade, procedência, créditos, licenças, retenção e exclusão são observáveis pelo usuário.
- [ ] A complexidade restante foi classificada como qualidade local ou delta de `FUTURE`; nada pesado está escondido no Carro.

## Refinamento contínuo

- [ ] Após cada teste, registrar termo novo, termo ambíguo, regra descoberta, exceção, dor e decisão tomada.
- [ ] Atualizar a matriz somente depois de confirmar que a nova fatia preserva a necessidade e o contexto proprietário.
- [ ] Revisar se algum campo pertence a outro bounded context ou se é apenas uma projeção conveniente.
- [ ] Procurar duplicação de entidades, comandos que alteram dois contextos e integrações implícitas por componentes.
- [ ] Rebaixar para uma fatia menor qualquer item que exija infraestrutura não autorizada pelo MVP.
- [ ] Promover para `FUTURE` qualquer comportamento que dependa de identidade, terceiro, rede, modelo de IA, comunidade ou operação externa.
- [ ] Manter um registro da decisão: hipótese, evidência, alternativa descartada, impacto no modelo e próxima pergunta.

## MVP1 — núcleo local de estudo

### MVP1.2 — resiliência e retomada

- [ ] Cobrir com testes a falha isolada de cada consulta principal, garantindo que áreas independentes continuem renderizando.
- [ ] Recuperar questão e sessão interrompidas após fechamento, recarregamento e indisponibilidade temporária.
- [ ] Testar plano atrasado, banco editorial ausente e banco local indisponível com recuperação contextual.

### MVP1.3 — acessibilidade e primeiro estudo

- [ ] Cobrir o ciclo principal com teclado, foco visível, nomes acessíveis, contraste e alternativas textuais.
- [ ] Executar inspeção automatizada e manual nas telas de catálogo, curso, lição, questão, resultado, plano e Meu estudo.
- [ ] Garantir recuperação de foco após diálogos, lazy-loading, erro e retorno de uma questão.
- [ ] Validar alvos de toque e fallback equivalente para vídeo, gráfico, mapa e cena 3D.
- [ ] Mostrar progresso de carregamento e cancelamento quando um recurso pesado puder ser interrompido.

### MVP1.4 — evolução e recuperação do banco local

- [ ] Testar migração de versões anteriores contendo tentativas, diagnósticos, favoritos, planos, conquistas, sequência e revisão.
- [ ] Preservar registros órfãos e exibir a falha por entidade sem bloquear as demais telas.
- [ ] Registrar escopo, checksum, versão e resultado de cada restauração ou importação.
- [ ] Oferecer desfazer quando possível e validar banco vazio, populado e parcialmente recuperado.

## Checklist adicional derivado do Wireframes.dc.html

### Documentação viva e fluxo principal

- [ ] Manter no backlog a decisão de produto, a regra de negócio, o fluxo feliz, os estados alternativos e o limite de cada tela.
- [ ] Representar o fluxo local mínimo: onboarding → trilha/contexto → disciplina/regra → atividade → presença/falta → cálculo → revisão.
- [ ] Permitir estudar sem rede depois do onboarding; ausência de nuvem nunca pode bloquear notas, faltas, sessões, metas ou progresso local.
- [ ] Marcar visualmente dados digitados, dados sintéticos, dados importados localmente, projeções e hipóteses.
- [ ] Garantir que uma tela de detalhe sempre ofereça retorno por voltar, breadcrumb ou origem explícita.
- [ ] Garantir que uma entidade possa aparecer em mais de uma visão sem criar cópia concorrente.

### Onboarding `O1–O3`

- [ ] **Skate:** `O1` explica o propósito e oferece continuar; `O2` cria uma trilha/contexto e uma disciplina local; `O3` abre o estudo existente sem conta.
- [ ] **Patinete:** permitir pular e retomar onboarding, adicionar uma segunda trilha e restaurar um pacote local.
- [ ] **Bicicleta:** onboarding ramificado por objetivo (faculdade, curso livre, concurso/ENEM ou estudo livre), sem presumir faculdade.
- [ ] **Moto:** adaptar perguntas à combinação de regras escolhida, preservando respostas e permitindo revisar escolhas.
- [ ] **Carro:** reabrir onboarding cadastral, importar/exportar preferências e distinguir primeiro acesso, retorno e banco restaurado.
- [ ] Nunca exigir login, servidor, IA, plugin ou integração para concluir os caminhos locais de onboarding.

### Consentimento e controle

- [ ] Usar sempre as decisões `sim`, `não`, `agora não` e `nunca` para permissão, sugestão, automação, notificação e recurso opcional.
- [ ] Aplicar defaults gentis: nada liga sozinho sem explicação; recusar deve ser tão fácil quanto aceitar.
- [ ] Registrar decisão, escopo, data, versão do texto e possibilidade de revisão.
- [ ] Impedir que modo Dopamina, notificações, captura de humor, recomendações ou qualquer automação vire requisito do estudo.
- [ ] Garantir que desfazer uma decisão remova o efeito futuro sem apagar o histórico necessário para auditoria local.

### Notificações e permissões `N1–N2`

- [ ] **Skate:** modelar lembrete local de atividade/falta como estado interno, sem pedir permissão do sistema.
- [ ] **Patinete:** solicitar permissão de notificação apenas no momento de uso, explicar finalidade e oferecer não agora/nunca.
- [ ] **Bicicleta:** configurar lembretes de prova, recorrência, revisão e presença por contexto pessoal.
- [ ] **Moto:** priorizar, silenciar, agrupar e cancelar alertas locais; mostrar a regra que gerou cada alerta.
- [ ] **Carro:** exportar/restaurar preferências, testar fuso/horário de verão e funcionar sem a permissão do sistema por meio de avisos dentro da PWA.
- [ ] Integração com provedores externos, notificações de grupo e notificações sincronizadas ficam em `FUTURE`.

### Widgets `W1–W2` e controle de superfície

- [ ] **Skate:** oferecer cartões dentro da Home para faltas restantes, próximas atividades e progresso.
- [ ] **Patinete:** escolher, ordenar, ocultar e restaurar cartões locais.
- [ ] **Bicicleta:** filtrar cartões por trilha, disciplina e contexto pessoal.
- [ ] **Moto:** configurar o quê, onde e quando cada bloco aparece, sem notificações intrusivas.
- [ ] **Carro:** manter catálogo local, preferências migráveis e fallback dentro da PWA.
- [ ] Widget nativo da tela inicial do sistema operacional, presença e atualização externa ficam em `FUTURE`.

### Aparência e acessibilidade `DK0–DK2`

- [ ] Entregar tema claro, escuro e automático; persistir a preferência localmente.
- [ ] Nunca comunicar estado apenas por cor: usar ícone, texto e padrão/forma para ok, atenção, risco, presente, falta e pendente.
- [ ] Garantir alvos de toque de pelo menos 44px, fonte ampliada, leitor de tela, foco visível e ordem de teclado.
- [ ] Testar Home, calendário, detalhe, presença, calculadoras, notas, busca, grafo e estados vazios em modo escuro.
- [ ] Fornecer resumo textual para gráfico, mapa, grafo, tinta e qualquer visualização sem suporte.
- [ ] Testar zoom, reflow, texto longo, idioma/localidade, navegação sem mouse e dispositivo sem suporte gráfico.

## HIG, UI e UX — qualidade obrigatória em todos os MVPs

MVP não significa protótipo descuidado. A entrega mínima é uma versão menor em comportamento, mas já deve ser coerente, responsiva, alinhada, acessível e agradável de usar. Qualidade visual não é uma etapa reservada ao Carro: ela acompanha cada fatia desde o Skate.

### O que absorver do mockup Fable/Wireframes.dc.html

- [ ] Estudar o wireframe como referência de linguagem visual e interação: caderno de estudo, editorial humano, acolhedor, expressivo, calmo e com personalidade; não copiar HTML, CSS, medidas ou componentes literalmente.
- [ ] Preservar a ideia de uma aplicação que parece um caderno vivo: títulos expressivos, cartões com conteúdo bem agrupado, notas auxiliares, pequenas legendas, chamadas de contexto e hierarquia clara.
- [ ] Absorver o uso de contraste entre superfície neutra, destaque de hoje/seleção, estado saudável, risco/atenção e origem externa; transformar isso em tokens semânticos, não em cores espalhadas por componentes.
- [ ] Absorver bordas, sombras, formas orgânicas, marcadores, chips, cartões, callouts e linhas de separação como vocabulário de composição; aplicar irregularidade com intenção e consistência, nunca como ruído decorativo.
- [ ] Absorver a combinação de densidade e respiro: informação suficiente para decisões reais, mas com agrupamento, margens, títulos e espaço negativo que permitam escanear a tela.
- [ ] Absorver o padrão “uma ideia principal por bloco”: cada card, seção, painel, bottom sheet ou alerta deve ter propósito identificável, ação principal e consequência compreensível.
- [ ] Absorver a estrutura mobile-first mostrada no mockup e estendê-la para PWA/web/desktop com a mesma semântica: no desktop, ampliar para colunas/multipainel sem criar outra aplicação.
- [ ] Absorver a Home única, agregada e componível: a mesma entidade pode aparecer em lentes diferentes; a interface muda a perspectiva, não duplica o dado.
- [ ] Absorver navegação com barra inferior/hub, detalhe, voltar, breadcrumb, seletor de visão e cross-links; toda ida deve ter retorno previsível e preservar o contexto.
- [ ] Absorver consentimento como UX, não apenas regra: `sim`, `não`, `agora não`, `nunca`, revisão posterior e ausência de dark patterns.
- [ ] Absorver o tom de cuidado do mockup: estados de sobrecarga, pausa, erro e indisponibilidade devem ser claros e gentis; o produto não deve pressionar nem transformar bem-estar em pontuação.
- [ ] Adicionar somente padrões visuais que ainda não tenham análogo no mockup. Antes de criar um componente, localizar o padrão equivalente existente e justificar a diferença de comportamento, densidade ou acessibilidade.

### Direção visual e sistema de tokens

- [ ] Definir tokens semânticos para `superfície`, `texto principal`, `texto secundário`, `borda`, `seleção`, `hoje`, `sucesso`, `atenção`, `risco`, `informação`, `placeholder`, `origem externa`, `foco` e `desabilitado`.
- [ ] Manter os tokens independentes do significado acadêmico específico: `risco` não pode depender de vermelho em um componente, e `sucesso` não pode depender de verde em outro.
- [ ] Definir escala consistente de tipografia, peso, altura de linha, largura de leitura, títulos, rótulos, metadados e texto auxiliar; não resolver hierarquia aumentando tamanhos aleatoriamente.
- [ ] Definir escala de espaçamento, raio, borda, sombra, ícone e altura de controle; toda nova tela deve reutilizar a escala existente ou registrar a exceção.
- [ ] Manter textura/organicidade, quando usada, como camada sutil e opcional; nunca pode prejudicar contraste, leitura, performance, modo escuro ou impressão/exportação.
- [ ] Garantir que ícones, emojis, ilustrações e marcadores tenham função semântica ou expressiva clara; nenhum símbolo pode ser o único meio de descobrir uma ação ou estado.
- [ ] Definir regras para imagens, anexos, gráficos, mapas e canvas: proporção, recorte, carregamento, placeholder, erro, texto alternativo e fallback textual.
- [ ] Definir tokens para modo claro, escuro e automático sem inverter cores de forma ingênua; revisar bordas, sombras, superfícies, estados de risco e foco em cada tema.

### HIG e composição de interface

- [ ] Cada tela deve ter título/propósito, contexto atual, conteúdo principal, ação primária, ações secundárias e saída/retorno identificáveis.
- [ ] Uma ação destrutiva ou irreversível deve declarar escopo, consequência, alternativa de cancelamento e desfazer quando possível; nunca depender de gesto escondido.
- [ ] Ações devem acontecer perto do objeto afetado; não deslocar o usuário para um menu distante para editar, concluir, arquivar, relacionar ou desfazer.
- [ ] Usar botão primário para a decisão principal, botão secundário para alternativa e ação textual/ícone apenas para ações de baixo risco ou repetidas; evitar múltiplos primários competindo.
- [ ] Manter nomenclatura, posição, ícone, feedback e comportamento consistentes entre Home, lista, detalhe, calendário, nota, cálculo e configurações.
- [ ] Usar chips/filtros para estado e escopo, mas evitar transformar cada metadado em botão; o estado selecionado deve ser evidente e reversível.
- [ ] Bottom sheet/modal deve ter foco inicial, título, fechamento explícito, gesto opcional, limite de altura, rolagem interna e retorno ao elemento que o abriu.
- [ ] Tabelas, calendários, boards, mapas e grafos devem ter uma forma equivalente de lista/detalhe; visualização não pode ser o único caminho para acessar ou editar o dado.
- [ ] Formulários devem preservar entrada ao erro, validar no contexto, explicar formato esperado, mostrar unidade e distinguir valor importado, calculado, projetado e editado manualmente.
- [ ] Não usar skeleton, animação, badge, streak, vermelho ou notificação para criar urgência artificial; cada movimento deve explicar mudança de estado ou orientar a atenção.

### Responsividade, grid e escalabilidade

- [ ] Adotar mobile como baseline, mas definir comportamento também para telas estreitas, tablet, notebook, desktop largo, janela dividida e orientação alterada.
- [ ] Usar grid fluido com container, colunas, gutters e margens consistentes; nenhum componente pode depender de coordenadas fixas do mockup.
- [ ] Converter o frame mobile em composição responsiva: empilhar, reordenar, colapsar ou transformar em painel conforme a largura, preservando a ordem de leitura e a ação principal.
- [ ] Nunca fixar altura de uma tela ou card quando o conteúdo puder crescer; preferir min-height, rolagem contextual e expansão explícita sem cortar texto ou controles.
- [ ] Proibir overflow horizontal acidental, texto cortado, botão fora da viewport, card com conteúdo sobreposto, calendário ilegível e tooltip inacessível por toque.
- [ ] Definir largura máxima de leitura para texto e largura mínima de controles; impedir que uma tela larga estique conteúdo a ponto de perder relação visual.
- [ ] Em desktop, usar multipainel apenas quando a relação entre lista e detalhe trouxer ganho real; permitir voltar à composição de coluna única sem perder seleção ou contexto.
- [ ] Testar zoom de 200%, fonte do sistema ampliada, teclado, leitor de tela, toque, mouse, trackpad, viewport sem barra do navegador e teclado virtual em mobile.
- [ ] Testar texto longo em português, nomes grandes de disciplinas, datas extensas, estados de erro, ausência de imagem, muitos filtros, zero itens e milhares de itens.
- [ ] Definir comportamento de rolagem: página, região, painel e calendário não podem competir pelo gesto nem prender o usuário em uma área sem saída.

### Estados visuais e feedback

- [ ] Cada tela deve especificar `carregando`, `vazio`, `primeiro uso`, `preenchido`, `parcial`, `salvando`, `salvo`, `erro recuperável`, `erro persistente`, `indisponível`, `offline`, `cancelado` e `restaurado` quando aplicável.
- [ ] Estado vazio deve explicar por que está vazio e oferecer uma próxima ação útil; não usar uma ilustração bonita sem caminho de saída.
- [ ] Estado de erro deve informar o que falhou, o que foi preservado, como tentar novamente, como continuar manualmente e como exportar/recuperar quando necessário.
- [ ] Estado offline deve ser honesto e calmo: mostrar o que funciona localmente, não simular sincronização nem apresentar erro de rede para uma ação que não depende de rede.
- [ ] Toda ação relevante deve produzir confirmação local observável, sem toast que desaparece antes de ser lido; ações críticas devem ter resultado persistente na tela ou histórico.
- [ ] Após salvar, editar, navegar, abrir diálogo, fechar erro ou concluir fluxo, restaurar foco e posição de forma previsível.
- [ ] Diferenciar fato, cálculo, hipótese, importação, projeção, fixture e dado indisponível visualmente e textualmente.
- [ ] Usar animação curta apenas para transição de contexto, abertura/fechamento, progresso ou feedback de ação; respeitar redução de movimento e permitir interrupção quando houver custo.

### UX writing, acessibilidade e cuidado

- [ ] Escrever títulos, rótulos, ajuda, erros, confirmações e vazios em linguagem direta, neutra e acolhedora; evitar jargão técnico, culpa e mensagens passivo-agressivas.
- [ ] Não presumir faculdade, idade, gênero, rotina, disponibilidade, nível de conhecimento, desejo de competir ou conexão online; onboarding deve permitir curso livre, concurso, ENEM e estudo aberto.
- [ ] Exibir unidade, período, fonte, atualização e regra junto ao número que pode orientar uma decisão; “9 faltas livres” precisa explicar de qual regra veio.
- [ ] Nunca comunicar estado apenas por cor, posição, tamanho, animação ou ícone; combinar texto, rótulo, forma, padrão e relação espacial.
- [ ] Garantir nomes acessíveis para ícones, botões, campos, gráficos, tabs, chips, calendários, mapas, boards e controles customizados.
- [ ] Garantir foco visível, ordem lógica, navegação por teclado, suporte a leitor de tela, contraste, reflow, alvos de toque de pelo menos 44px e alternativa para gestos.
- [ ] Garantir que textos auxiliares, legendas e placeholders não sejam a única fonte de instrução ou informação importante.
- [ ] Permitir pausa, silêncio e desligamento de gamificação, lembretes, bem-estar, feedback e modo Dopamina sem perder dados ou acesso ao estudo.
- [ ] Tratar conteúdo de saúde/mente como apoio não diagnóstico, sem usar cor/linguagem alarmista e sem transformar o check-in em indicador de desempenho.

### Critério de qualidade visual por MVP

- [ ] **MVP2 — Skate:** todas as telas contempladas devem usar um kit visual mínimo comum: grid, tipografia, superfície, borda, sombra, botão, campo, card, chip, status, navegação, vazio, erro e foco. O comportamento é lite-lite, mas nenhuma tela pode ser desalinhada, quebrada ou visualmente provisória.
- [ ] **MVP3 — Patinete:** consolidar responsividade mobile/tablet, barra inferior, filtros, listas, calendários, formulários e captura rápida; validar rolagem, teclado virtual, retorno, persistência visual e estados de retomada.
- [ ] **MVP4 — Bicicleta:** harmonizar relações entre telas, backlinks, árvores, boards, acervo, notas e atividades; preservar a entidade selecionada ao trocar a visão e garantir que densidade maior não destrua legibilidade.
- [ ] **MVP5 — Moto:** projetar com cuidado gráficos, mapas, grafos, simuladores, painéis e automações; oferecer fallback textual, reduzir carga visual, manter hierarquia e não transformar complexidade do domínio em uma tela visualmente confusa.
- [ ] **MVP6 — Carro:** realizar passe completo de refinamento em todas as telas: alinhamento, ritmo, contraste, foco, responsividade, overflow, performance, estados extremos, acessibilidade, animação, impressão/exportação e consistência entre PWA, web e desktop.
- [ ] Em nenhum MVP aceitar “placeholder permanente”, “depois a gente arruma o CSS”, texto cortado, overflow conhecido, componente duplicado ou tela que só funciona no viewport do mockup.

### Checklist de validação visual antes de concluir uma fatia

- [ ] Comparar a tela com a gramática visual do wireframe, identificando o padrão análogo reutilizado e justificando qualquer novo padrão.
- [ ] Testar pelo menos uma largura mobile estreita, uma mobile larga, tablet, desktop e janela dividida.
- [ ] Testar conteúdo mínimo, normal, longo, ausente, inválido, parcialmente recuperado e grande.
- [ ] Testar tema claro, escuro e automático, fonte ampliada, zoom 200%, teclado, leitor de tela, toque e redução de movimento.
- [ ] Verificar alinhamento ao grid, consistência de espaçamento, hierarquia, contraste, densidade, largura de leitura e posição das ações.
- [ ] Verificar que não há overflow horizontal, clipping, sobreposição, scroll preso, foco perdido, tooltip inacessível ou ação escondida.
- [ ] Verificar estados offline, carregando, vazio, erro, cancelamento, salvamento, confirmação, desfazer e restauração.
- [ ] Verificar que a interface não inventa backend, colaboração, IA, sincronização, comunidade ou dados que a versão não possui.
- [ ] Registrar evidência visual no roteiro de demonstração e uma pendência somente quando ela for uma melhoria futura real, não correção básica de acabamento.

### Navegação e conectores `NAV1–NAV2`

- [ ] **Skate:** definir Home como hub e garantir entrada/retorno entre trilha, disciplina, atividade, nota e resultado.
- [ ] **Patinete:** adicionar barra inferior, breadcrumb, voltar e origem da captura sem perder o estado do formulário.
- [ ] **Bicicleta:** permitir cross-links entre o mesmo conceito em várias telas com filtro de contexto.
- [ ] **Moto:** permitir trocar lista/árvore/board/mapa/grafo sem mudar a entidade selecionada.
- [ ] **Carro:** testar deep link local, restauração da posição, histórico de navegação e retorno após erro/lazy-loading.
- [ ] Não usar navegação para esconder mudança de bounded context; a origem e o proprietário do dado devem permanecer visíveis.

### Legal, procedência e feedback `L1–L3`

- [ ] Exibir política de privacidade, termos, créditos, licenças, fonte e versão dos dados sintéticos.
- [ ] Permitir feedback local por tela, com estado pendente e exportação manual; não enviar automaticamente.
- [ ] Registrar procedência de material, exercício, mapa, preset, cálculo e dado importado.
- [ ] Implementar denúncia, moderação e reportar conteúdo somente em `FUTURE`; nos MVPs, oferecer apenas remoção/arquivamento privado.

### Regras acadêmicas adicionais do wireframe

- [ ] Modelar regra de frequência por `% da carga`, `número de aulas` ou `créditos`, sempre com limite explícito.
- [ ] Converter créditos/horas em carga de aulas usando uma regra configurável e mostrar a origem da conversão.
- [ ] Separar reprovação por disciplina de reprovação agregada por período/semestre.
- [ ] Calcular piso de frequência global do período e permitir que a simulação detecte reprovação pelo todo mesmo quando cada disciplina passa isoladamente.
- [ ] Classificar presença como comum, atestado/abono, cancelada, feriado, atraso, trancada ou DP, com regra explícita para cada tipo.
- [ ] Excluir feriado e aula cancelada da carga efetiva; manter dias futuros como pendentes até acontecerem.
- [ ] Permitir que atraso conte como fração configurável, sem converter automaticamente em falta inteira.
- [ ] Distinguir disciplina obrigatória de optativa/eletiva; permitir que optativa trancada fique fora do piso global quando a regra local determinar.
- [ ] Distinguir hora-aula de hora-relógio e permitir que um encontro valha N aulas/faltas.
- [ ] Manter faltas, notas e justificativas individuais e privadas em todos os contextos locais.
- [ ] Permitir que curso livre desligue faltas/notas e use progresso por módulo/certificado local.
- [ ] Marcar dados importados como importados e permitir ajuste manual sem perder o valor original.

### Integridade acadêmica e escopo de atividade

- [ ] Permitir marcar atividade como individual, colaborativa futura, avaliação, preparação ou opcional.
- [ ] Em atividade individual, não exibir divisão de partes, respostas compartilhadas ou recursos que incentivem cola.
- [ ] Guardar crédito e procedência de material, exercício, resposta, prova antiga e referência.
- [ ] Manter provas antigas e respostas locais sob permissão explícita do proprietário; publicação fica em `FUTURE`.

### Descentralização, plataformas e sincronização — `FUTURE`

- [ ] Manter `DE1–DE3` como especificação futura de onde os dados moram, backend por contexto e conexão de servidor.
- [ ] Manter `PL1` como requisito de compatibilidade de PWA/web/desktop; validar primeiro a mesma experiência local em telas maiores.
- [ ] Manter `SY1–SY2` em `FUTURE`: rede local, Bluetooth, pacote que funde e sincronização entre dispositivos.
- [ ] Manter `PG1–PG3` e `I2` em `FUTURE`: marketplace, backup por plugin, transportes combináveis e plugin conectado.
- [ ] Manter `SC1–SC2` e `SE3–SE4` em `FUTURE` para mudanças recebidas, conflitos, credencial expirada e falha de sync; nos MVPs, tratar apenas falhas de persistência/restauração local.
- [ ] Quando `FUTURE` for aberto, usar id estável, `updatedAt`, versão, origem, merge por campo, oplog, LWW por campo, tombstone e histórico; nunca fundir faltas entre pessoas.

### Propósito, comunidade e motivação — `FUTURE` parcial

- [ ] **Local nos MVPs:** onboarding por nível, vocabulário neutro, progresso sentido, modo Calmo/Dopamina opt-in, metas pessoais e recomendações determinísticas.
- [ ] **`PG1–PG3` futuro:** equilíbrio entre federação e pessoa, fontes curadas, adoção/fork e integração de fontes externas.
- [ ] **`CM1–CM3` futuro:** salas ao vivo, dicas oficiais comunitárias, modo cooperativo e pontes com outras plataformas.
- [ ] **`CC1` futuro:** escolha entre colaborar, competir ou estudar sozinho dentro de um grupo real; a opção singleplayer já é coberta pelos MVPs locais.

## Cortes adicionais do wireframe — todos os MVPs, sempre local-only

Esta seção fecha os itens do wireframe que ainda não estavam detalhados nas checklists de release. O mesmo contrato vale para todos eles: cada tela existe em todos os MVPs, começa com uma versão mínima no `MVP2 — Skate`, cresce em comportamento no `MVP3 — Patinete`, ganha relações locais no `MVP4 — Bicicleta`, recebe regras e visualizações compostas no `MVP5 — Moto` e chega à versão local-only mais completa no `MVP6 — Carro`.

Quando o wireframe usa palavras como “grupo”, “host”, “federação”, “servidor”, “comunidade”, “coletivo”, “compartilhar” ou “versão de outra pessoa”, o MVP deve reinterpretar o conceito como dado pessoal local, arquivo exportado/importado manualmente ou versão duplicada pelo próprio usuário. A interação real entre pessoas, a presença de terceiros e a rede continuam em `FUTURE`.

### Calendário e agenda `C1–C3`

- [ ] **`C1` — Lista/checklist:** no Skate, listar tarefas e eventos locais com título, data, estado e filtro de contexto; no Patinete, permitir captura rápida, concluído/adiado e recorrência simples; na Bicicleta, ligar item a disciplina, nota, atividade, material e meta; na Moto, suportar dependências, exceções e conflitos determinísticos; no Carro, preservar histórico, filtros salvos, restauração e grandes volumes.
- [ ] **`C2` — Mês/dia selecionado:** no Skate, mostrar o mês e abrir o dia; no Patinete, permitir criar e editar evento no dia selecionado sem perder a posição; na Bicicleta, destacar prova, aula, revisão, prazo e falta originados de outras entidades locais; na Moto, projetar recorrências e exceções; no Carro, reconstruir a visão após migração/importação e manter equivalência com a Lista e a Semana.
- [ ] **`C3` — Semana/dia por hora:** no Skate, mostrar blocos horários informados manualmente; no Patinete, mover um bloco e detectar sobreposição; na Bicicleta, relacionar horário à grade e às atividades; na Moto, calcular carga efetiva, deslocar eventos e sugerir rearranjo determinístico; no Carro, manter fuso/localidade configuráveis, auditoria da alteração e fallback textual acessível.
- [ ] Toda ocorrência deve ter origem, proprietário local, contexto, data de criação/alteração e estado; a mesma ocorrência vista na Home, na disciplina e no Calendário deve ser uma entidade, não uma cópia.
- [ ] Importação de calendário, iCal, agenda externa, RSVP e atualização de terceiros ficam em `FUTURE`; o Carro pode apenas importar/exportar arquivo local sob ação explícita.

### Vocabulário e linguagem da trilha `VC1–VC2`

- [ ] **`VC1` — Termos desta trilha:** no Skate, usar vocabulário canônico curto e neutro; no Patinete, mostrar glossário/ajuda local; na Bicicleta, exibir o termo junto ao contexto que o definiu; na Moto, permitir escolher entre sinônimos pré-definidos sem alterar o domínio; no Carro, exportar/importar a preferência de apresentação e explicar sempre o termo canônico.
- [ ] **`VC2` — Lugares com termos diferentes:** no Skate, não permitir vocabulário personalizado; no Patinete, registrar somente uma nota local “como eu chamo isto”; na Bicicleta, exibir aliases pessoais por trilha; na Moto, suportar presets pessoais por contexto; no Carro, migrar, revisar e remover aliases sem quebrar busca, links ou cálculos.
- [ ] Nenhuma camada local deve renomear silenciosamente entidades, regras ou eventos canônicos. Vocabulário personalizado compartilhado, herdado por escola/grupo ou sincronizado é exclusivamente `FUTURE-7`.

### Mapa mental, lentes e fontes `VL1–VL3`, `FO1–FO2`

- [ ] **`VL1` — Canvas livre:** no Skate, exibir uma lista/árvore com posição simples; no Patinete, permitir adicionar nós e mover/reordenar manualmente; na Bicicleta, conectar nós a notas, tópicos, materiais e atividades; na Moto, suportar mapa, grafo, filtros e tinta local reversível; no Carro, entregar canvas completo, grandes relações, acessibilidade e restauração sem OCR.
- [ ] **`VL2` — Lente e evolução:** no Skate, oferecer uma lente fixa; no Patinete, salvar uma lente por contexto; na Bicicleta, comparar lista, árvore, board e mapa sobre a mesma fonte; na Moto, combinar filtros de progresso, período, confiança e situação acadêmica; no Carro, versionar lentes, recuperar alterações e exportar uma visão verificável.
- [ ] **`VL3` — Compartilhar/integrar parcial:** nos MVPs, “compartilhar” significa duplicar uma lente própria ou exportar um pacote read-only para arquivo; no Skate, exportar imagem/texto simples; no Patinete, importar uma cópia local; na Bicicleta, preservar procedência e links internos; na Moto, comparar duas cópias próprias; no Carro, exportar pacote completo com manifesto, checksum e opção de desfazer a importação. Link para pessoa, edição colaborativa, federação e integração ficam em `FUTURE`.
- [ ] **`FO1` — Fontes da trilha:** no Skate, registrar fonte, autor, título e origem manualmente; no Patinete, anexar fonte a nota, tópico ou material; na Bicicleta, mostrar procedência por bloco e permitir várias fontes locais; na Moto, validar duplicidade e estado da fonte; no Carro, exportar a cadeia de procedência e sinalizar fonte indisponível sem apagar o conteúdo pessoal.
- [ ] **`FO2` — Adotar inteiro ou em parte:** no Skate, copiar apenas texto escolhido para uma nota privada; no Patinete, copiar itens selecionados; na Bicicleta, mapear o item copiado para a árvore pessoal; na Moto, comparar antes de adotar e registrar alterações; no Carro, permitir adotar, reverter ou manter duas versões próprias. Adoção de fonte externa, curadoria e proposta a uma federação ficam em `FUTURE`.

### Conhecimento avançado `K4–K6`

- [ ] **`K4` — OCR:** manter fora dos cinco MVPs. O Skate ao Carro pode anexar uma imagem como arquivo local, nomeá-la e escrever transcrição manual; reconhecer texto de imagem, quadro, livro ou PDF é `FUTURE-1`.
- [ ] **`K5` — IA:** manter fora dos cinco MVPs. O usuário pode editar manualmente notas, resumos, cartões e relações; resumo automático, geração, extração, classificação, recomendação sem regra explícita e sugestão de ligação são `FUTURE-1`.
- [ ] **`K6` — estrutura pessoal e conteúdo compartilhado:** no Skate, oferecer árvore pessoal simples; no Patinete, permitir mover/copiar nós; na Bicicleta, ligar nós a notas, atividades e materiais; na Moto, versionar e forkar a própria árvore; no Carro, exportar/importar a estrutura com manifesto e links. Conteúdo compartilhado, autoria de terceiros, merge e federação ficam em `FUTURE-5/6`.

### Backup local, recuperação e continuidade `BH1–BH2`, `HC1–HC2`

- [ ] **`BH1` — Oferta de backup:** no Skate, oferecer exportação manual do banco/pacote; no Patinete, criar backup local nomeado e mostrar data/tamanho; na Bicicleta, permitir escolher escopos e gerar checksum; na Moto, oferecer retenção, rotação e backup cifrado por senha/frase local; no Carro, suportar múltiplos destinos locais, restauração seletiva e verificação antes de substituir dados.
- [ ] **`BH2` — Restaurar/chave:** no Skate, restaurar um pacote em banco vazio; no Patinete, validar versão e mostrar prévia; na Bicicleta, restaurar por contexto e preservar órfãos; na Moto, simular falha de senha, pacote incompleto e conflito entre duas cópias próprias; no Carro, oferecer restauração parcial, relatório por entidade, migração e desfazer quando possível.
- [ ] O backup local deve informar o que entra, o que não entra, a data, a versão, a integridade e a possibilidade real de recuperação. Não prometer recuperação de chave perdida.
- [ ] **`HC1` — “O servidor sumiu”:** para os MVPs, traduzir para “o arquivo/destino local não está disponível”: manter o último estado local, permitir continuar offline, mostrar estado pendente e oferecer exportação para outro caminho. Servidor indisponível, host remoto e recuperação de grupo ficam em `FUTURE`.
- [ ] **`HC2` — Migrar/herdar grupo:** nos MVPs, limitar a migração a banco, pacote ou perfil pessoal próprio; mostrar prévia, origem, destino, mapeamentos e reversão. Migração de grupo, herança de permissões, troca de host e continuidade federada ficam em `FUTURE-6`.

### Privacidade, agenda, limites e controle `EC1–EC3`, `MR1–MR2`

- [ ] **`EC1` — Privacidade técnica:** no Skate, separar conteúdo privado de preferências; no Patinete, apagar por escopo; na Bicicleta, exibir procedência e conteúdo importado; na Moto, cifrar backups locais e auditar acesso local; no Carro, verificar isolamento entre contextos, exclusão verificável e restauração sem vazamento.
- [ ] **`EC2` — Tempo/agenda:** no Skate, usar horário local e calendário simples; no Patinete, configurar início da semana, duração e lembrete; na Bicicleta, suportar fuso/localidade e horário de verão; na Moto, tratar recorrência, exceção e alteração de regra; no Carro, migrar preferências e mostrar claramente o efeito da mudança sobre eventos existentes.
- [ ] **`EC3` — Limites, conflitos e acesso:** no Skate, impedir valores inválidos; no Patinete, explicar conflito e oferecer cancelar; na Bicicleta, validar relações entre contextos; na Moto, permitir resolver conflitos entre duas cópias próprias; no Carro, manter trilha de auditoria, limites configuráveis e recuperação de operação interrompida. ACL remota e autorização entre pessoas ficam em `FUTURE`.
- [ ] **`MR1` — Idade/preferências:** nos MVPs, armazenar apenas a faixa/preferência necessária para adaptar linguagem, conforto, notificações e bem-estar; cada resposta deve ser opcional, editável e local. Não inferir idade por comportamento.
- [ ] **`MR2` — Painel de responsável:** no Skate ao Carro, oferecer somente configurações locais de segurança, privacidade, acessibilidade e bloqueio da própria sessão; não criar conta de responsável, vínculo familiar, monitoramento ou acesso de terceiro. Esses recursos ficam em `FUTURE`.

### Integridade acadêmica, individualidade e bem-estar `IA1–IA2`, `CC2–CC3`

- [ ] **`IA1` — Onde fica a linha:** no Skate, marcar uma atividade como individual ou pessoal; no Patinete, impedir divisão automática e respostas compartilhadas no próprio dispositivo; na Bicicleta, mostrar a regra no detalhe e no formulário; na Moto, auditar mudança de escopo; no Carro, exportar a procedência da atividade sem publicar dados.
- [ ] **`IA2` — Aviso em atividade individual:** no Skate, mostrar aviso simples; no Patinete, permitir confirmar “continuar sozinho”; na Bicicleta, bloquear ações incompatíveis com a marca individual; na Moto, registrar exceção manual com justificativa local; no Carro, restaurar o aviso e a decisão sem transformá-los em policiamento invasivo.
- [ ] **`CC2` — Mesmo grupo, seu jeito:** nos MVPs não existe grupo real. Modelar apenas um conjunto local de modos pessoais: estudar sozinho, revisar, pausar, competir consigo mesmo ou ignorar gamificação.
- [ ] **`CC3` — Sem forçar ninguém:** permitir ligar/desligar metas, ranking local, notificações, co-presença simulada e estímulos; qualquer modo deve ser opt-in, reversível e sem bloquear conteúdo acadêmico. Grupo, competição entre pessoas e co-presença real ficam em `FUTURE`.
- [ ] O conteúdo de saúde/mente do wireframe pode ser fixture local, informativo e não diagnóstico; hotline, conteúdo curado por profissionais, acompanhamento e comunidade ficam fora dos MVPs.

### Compartilhamento por arquivo e ciclo individual/coletivo `SH1–SH3`, `CY1–CY3`

- [ ] **`SH1` — Modo de compartilhar:** no Skate, exportar texto/imagem privado; no Patinete, gerar pacote read-only; na Bicicleta, escolher itens, procedência e escopo; na Moto, gerar pacote “inspirável” como cópia própria editável; no Carro, oferecer somente leitura, cópia editável e manifesto verificável. Colaborativo, grupo, federação e link público ficam em `FUTURE`.
- [ ] **`SH2` — Versões:** nos MVPs, comparar a versão atual com uma versão anterior ou pacote importado pelo próprio usuário; preservar autor como “meu arquivo”/origem informada, data, checksum e diferença. Versão canônica de federação, versões de outras pessoas e curadoria ficam em `FUTURE`.
- [ ] **`SH3` — Hierarquias:** no Skate, importar conteúdo para um destino pessoal; no Patinete, escolher pasta/árvore; na Bicicleta, mapear conceitos equivalentes; na Moto, comparar duas hierarquias locais; no Carro, manter links por conceito e permitir fork pessoal. Sincronização de hierarquias entre pessoas fica em `FUTURE`.
- [ ] **`CY1` — Ciclo individual/coletivo:** nos MVPs, implementar somente o lado individual: criar, revisar, forkear, exportar e reimportar material próprio. O nó “coletivo” deve aparecer apenas como estado futuro, não como entidade operacional.
- [ ] **`CY2` — Contribuir de volta:** nos MVPs, traduzir para “exportar uma cópia escolhida” ou “guardar uma melhoria no meu arquivo”; não enviar, publicar ou propor a terceiros.
- [ ] **`CY3` — Receber de volta:** nos MVPs, traduzir para “importar um pacote local e aceitar/rejeitar item a item”; preservar a fonte e nunca sobrescrever silenciosamente a versão pessoal. Recebimento de federação/comunidade fica em `FUTURE`.

### Propósito, IA e ecossistema `PM2`, `PG1–PG3`, `CM1–CM3`

- [ ] **`PM2` — IA só onde quiser:** no Skate ao Carro, manter a tela como estado/explicação de capacidade futura, com todas as opções desligadas e sem envio de dados; qualquer OCR, resumo, sugestão, extração ou geração continua em `FUTURE-1`.
- [ ] **`PG1`, `PG2`, `PG3` do ecossistema:** marketplace, backup por plugin e transportes simultâneos são exclusivamente `FUTURE-4`; nos MVPs, permitir apenas adapters internos locais, importação/exportação explícita e nenhum código de terceiros.
- [ ] O wireframe reutiliza `PG1`, `PG2`, `PG3` em outra seção para propósito, níveis e federação. Para evitar ambiguidade, no backlog os três primeiros devem ser lidos como `PG-ECOSSISTEMA-1..3` e os três últimos como `PG-PROPÓSITO-1..3`; ambos os conjuntos têm apenas fixture/explicação local até `FUTURE`.
- [ ] **`CM1`, `CM2`, `CM3` — salas, conteúdo oficial e pontes:** não implementar nos MVPs. O máximo local é uma tela vazia/explicativa e um modo de estudo solo; salas ao vivo, dicas oficiais, cooperativo, ponte com plataformas e comunidade ficam em `FUTURE-5`.
- [ ] Recomendações locais podem usar somente regras determinísticas sobre os dados pessoais; recomendação comunitária, ranking, feed social e curadoria externa ficam em `FUTURE`.

### Segurança distribuída, moderação e resiliência de rede — somente `FUTURE`

- [ ] **`MX1`, `MX2`, `MX3`, `MX4` — armazenamento distribuído:** manter fora de todos os MVPs: pedaços cifrados em nós, RAID distribuído, restauração por consenso e distribuição geográfica exigem rede, nós e operação externa. O equivalente local permitido é backup cifrado em arquivos controlados pelo usuário.
- [ ] **`IN1`, `IN2`, `IN3` — confiança e forks de servidor:** manter fora de todos os MVPs: confiança de servidor, detecção de MITM e fork por desacordo pressupõem identidade/remoto. No Carro, fornecer somente checksum, manifesto e comparação de dois pacotes locais.
- [ ] **`MD1`, `MD2`, `MD3` — moderação:** manter fora de todos os MVPs: camadas de moderação, denúncia/apelação e listas federadas pertencem à comunidade. Nos MVPs, oferecer apenas apagar, arquivar, ocultar e bloquear a própria visualização local.
- [ ] **`AT1`, `AT2`, `AT3` — ataques:** manter fora de todos os MVPs: Sybil, flood/spam distribuído e resistência à censura são requisitos de rede/comunidade. O modo local deve limitar tamanho, frequência e custo de importação de arquivos para proteger o dispositivo, sem simular segurança federada.
- [ ] Qualquer protótipo futuro dessas capacidades deve começar pelo contrato ETP/EUP/ELP, sem dados reais, e só entrar no produto depois de identidade, transporte, observabilidade, recuperação e política de abuso definidos.

### Lacunas auditadas do wireframe `DE2`, `DK1`, `DM3`, `DM4`

- [ ] **`DK1` — Aparência:** no Skate, oferecer claro/escuro/automático e tamanho de fonte local; no Patinete, persistir preferências e redução de movimento; na Bicicleta, aplicar os tokens a Home, agenda, notas e acadêmico; na Moto, revisar contraste e densidade de visualizações; no Carro, validar todas as telas em claro/escuro/auto, alto contraste, zoom e fonte ampliada. A aparência deve seguir a gramática do mockup sem copiar CSS 1:1.
- [ ] **`DM3` — Forkar e editar a própria versão:** no Skate, permitir duplicar manualmente uma árvore/lente pessoal; no Patinete, renomear e reordenar a cópia; na Bicicleta, editar nós, relações e presets sem alterar a fonte; na Moto, comparar versões próprias e registrar procedência; no Carro, exportar/importar o fork com histórico, checksum e restauração. Fork de mapa de terceiros, publicação e atualização federada ficam em `FUTURE`.
- [ ] **`DM4` — Colaborar num mapa de turma:** manter fora de todos os MVPs. A tela pode existir apenas como limite/explicação visual; colaboração por nó, propostas, autoria, histórico de membros, merge, sincronização e turma pertencem a `FUTURE-5/6`.
- [ ] **`DE2` — Backend por contexto:** manter fora de todos os MVPs. O equivalente local permitido é separar contextos e escopos no mesmo banco/dispositivo, mostrar a origem local do dado e exportar/importar pacotes manualmente; múltiplos backends, roteamento por trilha, E2EE remoto, self-host e visão híbrida ficam em `FUTURE-6`.

## Releases locais — checklist de conclusão

A matriz é a visão resumida; os checklists abaixo são os critérios de entrega. Cada MVP precisa tocar todas as famílias, preservando a versão anterior e adicionando somente a próxima camada de comportamento.

### MVP2 — Skate

- [ ] **Home e trilhas (`HM1–HM3`, `T1–T3`):** entregar Home fixa, uma trilha, uma regra, onboarding curto e um contexto pessoal.
- [ ] **Agenda e atividades (Calendário, `D1–D2`, `LX1–LX2`):** criar uma atividade manual, definir prazo/estado e fazer uma captura textual.
- [ ] **Acadêmico (`M1–M2`, `F1–F4`, `JF1–JF2`, `GP1–GP2`, `NT1–NT2`, `IC1–IC3`):** registrar uma disciplina, presença, falta, nota, período, horas e regra simples.
- [ ] **Grade, busca e retorno (`GH1–GH3`, `B1–B2`, `E2–E3`, `WB1–WB3`):** informar horários manuais, buscar registros básicos, tratar vazio e exibir recap local.
- [ ] **Contextos e eventos (`G1–G2`, `J1–J2`, `RE1–RE2`, `EL1–EL2`):** criar/abrir espaço pessoal, planejar evento individual e registrar partes atribuídas à própria pessoa.
- [ ] **Divisão pessoal (`GA1–GA2`, `DP1–DP2`):** representar uma tarefa como checklist/partes próprias, sem terceiros.
- [ ] **Metas e aprendizagem (`ME1`, `MF1–MF3`, `ED1–ED2`, `CL1`, `DL1–DL2`):** criar uma meta, sessão, checklist de edital/módulo e sequência pessoal simples.
- [ ] **Prática (`EX1–EX3`, `KH1`, `GM1–GM3`):** criar um exercício, praticar uma vez, revisar um cartão e registrar progresso individual.
- [ ] **Conhecimento (`K1–K3`, `KC1–KC2`, `LK1–LK3`, `TC1–TC2`, `DM1–DM2`):** criar uma nota, caderno, checklist, árvore e uma ligação manual; tinta fica como traço local mínimo.
- [ ] **Acervo (`AC1–AC2`, `MT1–MT3`):** salvar uma referência, abrir sua fonte, criar ficha/resenha privada e manter biblioteca pessoal.
- [ ] **Inbox e gamificação (`CH1–CH2`, `CX1–CX2`, `CO1–CO2`, `PD1–PD3`):** tratar conversa como captura privada, mostrar resumo individual e executar pomodoro/pausa solo.
- [ ] **Cadernos, feed e tópicos (`CP1–CP4`, `FD1–FD3`, `TP1–TP3`):** manter caderno privado, timeline das próprias ações, tópico privado e itens salvos.
- [ ] **Controle (`BE1–BE3`, `PM1`, `CN1–CN2`, `AJ1–AJ2`, `S1–S3`):** entregar check-in, modo, consentimento, privacidade, dados, ajuda e exclusão local básica.
- [ ] Validar o primeiro fluxo completo: criar contexto → registrar atividade/nota → estudar → consultar resultado.
- [ ] Não introduzir recorrência complexa, grafo completo, automação, rede, colaboração ou dependência externa.

### MVP3 — Patinete

- [ ] **Home e trilhas (`HM1–HM3`, `T1–T3`):** ordenar/ocultar blocos, restaurar preferências, criar várias trilhas e editar o onboarding.
- [ ] **Agenda e atividades (Calendário, `D1–D2`, `LX1–LX2`):** oferecer lista/mês/semana, captura rápida offline, recorrência simples, checklist e retomada.
- [ ] **Acadêmico (`M1–M2`, `F1–F4`, `JF1–JF2`, `GP1–GP2`, `NT1–NT2`, `IC1–IC3`):** adicionar histórico, justificativas, alertas, lembretes, evidências e visão de período.
- [ ] **Grade, busca e retorno (`GH1–GH3`, `B1–B2`, `E2–E3`, `WB1–WB3`):** consolidar semana/mês, recentes, filtros, criação a partir da busca e feedback contextual local.
- [ ] **Contextos e eventos (`G1–G2`, `J1–J2`, `RE1–RE2`, `EL1–EL2`):** alternar contextos pessoais, registrar evento recorrente, lembrete e captura de partes/cobertura própria.
- [ ] **Metas e aprendizagem (`ME1`, `MF1–MF3`, `ED1–ED2`, `CL1`, `DL1–DL2`):** adicionar hábito, streak, marcos, progresso por tópico/módulo e retomada de trilha.
- [ ] **Prática (`EX1–EX3`, `KH1`, `GM1–GM3`):** criar banco local, sessão de quiz solo, revisão simples, XP individual e resumo de evolução.
- [ ] **Conhecimento (`K1–K3`, `KC1–KC2`, `LK1–LK3`, `TC1–TC2`, `DM1–DM2`):** organizar cadernos em árvore, usar Markdown, checklist real, board pessoal e lentes salvas.
- [ ] **Acervo (`AC1–AC2`, `MT1–MT3`):** favoritar, arquivar, resenhar, filtrar e controlar estado de acesso de materiais locais.
- [ ] **Inbox e gamificação (`CH1–CH2`, `CX1–CX2`, `CO1–CO2`, `PD1–PD3`):** permitir thread consigo mesmo, âncoras simples, ciclos configuráveis e minijogos solo.
- [ ] **Cadernos, feed e tópicos (`CP1–CP4`, `FD1–FD3`, `TP1–TP3`):** criar seções, privacidade local, timeline filtrável, lista pessoal de interesses e itens salvos.
- [ ] **Controle (`BE1–BE3`, `PM1`, `CN1–CN2`, `AJ1–AJ2`, `S1–S3`):** preferências por contexto, histórico de consentimento, exportar/importar/apagar por escopo e retomada.
- [ ] Validar o fluxo: capturar → organizar → reencontrar → concluir/adiar.
- [ ] Não transformar inbox pessoal em chat nem evento pessoal em RSVP compartilhado.

### MVP4 — Bicicleta

- [ ] **Home e trilhas (`HM1–HM3`, `T1–T3`):** agregar lentes por trilha/contexto, ligar metas, módulos, atividades e perfis locais.
- [ ] **Agenda e atividades (Calendário, `D1–D2`, `LX1–LX2`):** ligar checklist, preparação, prova, nota, material e dependências de prazo.
- [ ] **Acadêmico (`M1–M2`, `F1–F4`, `JF1–JF2`, `GP1–GP2`, `NT1–NT2`, `IC1–IC3`):** conectar faltas/notas a aulas, calendário, provas, créditos, baldes e evidências.
- [ ] **Grade, busca e retorno (`GH1–GH3`, `B1–B2`, `E2–E3`, `WB1–WB3`):** indexar notas, materiais e referências, com filtros por contexto e histórico de evolução.
- [ ] **Contextos e eventos (`G1–G2`, `J1–J2`, `RE1–RE2`, `EL1–EL2`):** relacionar projetos pessoais, eventos, tarefas, dependências e cobertura própria.
- [ ] **Metas e aprendizagem (`ME1`, `MF1–MF3`, `ED1–ED2`, `CL1`, `DL1–DL2`):** ligar meta a trilha/atividade, edital a tópico, simulado a revisão e curso a progresso.
- [ ] **Prática (`EX1–EX3`, `KH1`, `GM1–GM3`):** ligar exercícios a conceitos, confiança, flashcards, retenção e evolução individual.
- [ ] **Conhecimento (`K1–K3`, `KC1–KC2`, `LK1–LK3`, `TC1–TC2`, `DM1–DM2`):** entregar backlinks, âncoras, relações tipadas, árvore/board e presets locais.
- [ ] **Acervo (`AC1–AC2`, `MT1–MT3`):** ligar material a disciplina, nota, atividade e tópico; produzir recomendações apenas dos dados pessoais.
- [ ] **Inbox e gamificação (`CH1–CH2`, `CX1–CX2`, `CO1–CO2`, `PD1–PD3`):** ancorar capturas, sessões e revisão a temas, com progresso conectado e pausa ligada à sessão.
- [ ] **Cadernos, feed e tópicos (`CP1–CP4`, `FD1–FD3`, `TP1–TP3`):** relacionar notas, timeline, tópicos, referências e listas privadas.
- [ ] **Controle (`BE1–BE3`, `PM1`, `CN1–CN2`, `AJ1–AJ2`, `S1–S3`):** ligar bem-estar a carga/sessão, decisões a contexto e backup à privacidade.
- [ ] Validar o fluxo: captura → nota/atividade → tópico/material → prática → revisão.
- [ ] Usar somente relações e recomendações determinísticas com dados locais.

### MVP5 — Moto

- [ ] **Home e trilhas (`HM1–HM3`, `T1–T3`):** compor cards, filtros, presets e visões com regras modulares e cenários locais.
- [ ] **Agenda e atividades (Calendário, `D1–D2`, `LX1–LX2`):** suportar RRULE, exceções, conflitos, rearranjo determinístico e projeções de preparação.
- [ ] **Acadêmico (`M1–M2`, `F1–F4`, `JF1–JF2`, `GP1–GP2`, `NT1–NT2`, `IC1–IC3`):** simular risco, aprovação, frequência, integralização e conclusão com hipóteses editáveis.
- [ ] **Grade, busca e retorno (`GH1–GH3`, `B1–B2`, `E2–E3`, `WB1–WB3`):** suportar modelos de grade, RRULE, índice incremental, comandos e análise local de retomada.
- [ ] **Contextos e eventos (`G1–G2`, `J1–J2`, `RE1–RE2`, `EL1–EL2`):** aplicar regras e visões compostas a cada contexto pessoal e simular cenários de evento.
- [ ] **Metas e aprendizagem (`ME1`, `MF1–MF3`, `ED1–ED2`, `CL1`, `DL1–DL2`):** projetar esforço, adaptar metas, avaliar cobertura e controlar desbloqueios locais.
- [ ] **Prática (`EX1–EX3`, `KH1`, `GM1–GM3`):** oferecer simulados, recomendações determinísticas, XP/conquistas e modo quiz local completo.
- [ ] **Conhecimento (`K1–K3`, `KC1–KC2`, `LK1–LK3`, `TC1–TC2`, `DM1–DM2`):** entregar grafo, mapa, filtros, relações compostas, tinta local simples e comparação de lentes.
- [ ] **Acervo (`AC1–AC2`, `MT1–MT3`):** suportar listas, filtros, recomendações determinísticas explicadas e biblioteca privada por contexto.
- [ ] **Inbox e gamificação (`CH1–CH2`, `CX1–CX2`, `CO1–CO2`, `PD1–PD3`):** buscar/filtrar capturas, compor progresso, consentimentos, respiração e minijogos solo completos.
- [ ] **Cadernos, feed e tópicos (`CP1–CP4`, `FD1–FD3`, `TP1–TP3`):** oferecer templates, pacotes locais, filtros, controles de visibilidade local e recomendações pessoais.
- [ ] **Controle (`BE1–BE3`, `PM1`, `CN1–CN2`, `AJ1–AJ2`, `S1–S3`):** entregar regras compostas, auditoria local, checksum, migração e retenção configurável.
- [ ] Validar cenários, hipóteses, conflitos, desfazer, fallback textual e grandes relações locais.
- [ ] Não introduzir login, backend, identidade remota, grupo, chat entre pessoas ou colaboração.

### MVP6 — Carro

- [ ] **Home e trilhas (`HM1–HM3`, `T1–T3`):** entregar composição completa, todos os layouts locais, restauração, migração e desempenho.
- [ ] **Agenda e atividades (Calendário, `D1–D2`, `LX1–LX2`):** cobrir grande volume, histórico, dependências, recuperação e exportação local.
- [ ] **Acadêmico (`M1–M2`, `F1–F4`, `JF1–JF2`, `GP1–GP2`, `NT1–NT2`, `IC1–IC3`):** fechar regras compostas, curso completo, auditoria, projeções e pacote restaurável.
- [ ] **Grade, busca e retorno (`GH1–GH3`, `B1–B2`, `E2–E3`, `WB1–WB3`):** consolidar todos os calendários pessoais, reconstruir índices e preservar histórico/feedback.
- [ ] **Contextos e eventos (`G1–G2`, `J1–J2`, `RE1–RE2`, `EL1–EL2`):** suportar múltiplos contextos pessoais, templates, exportação e restauração sem criar colaboração.
- [ ] **Metas e aprendizagem (`ME1`, `MF1–MF3`, `ED1–ED2`, `CL1`, `DL1–DL2`):** entregar plano de longo prazo, histórico, certificados/registros locais e editor completo de trilhas pessoais.
- [ ] **Prática (`EX1–EX3`, `KH1`, `GM1–GM3`):** fechar banco grande, filtros, importação/exportação local, revisão, quiz e histórico individual.
- [ ] **Conhecimento (`K1–K3`, `KC1–KC2`, `LK1–LK3`, `TC1–TC2`, `DM1–DM2`):** suportar todos os tipos de relação, fallback, acessibilidade, versões de lente e pacote verificável.
- [ ] **Acervo (`AC1–AC2`, `MT1–MT3`):** entregar acervo privado completo, backup, restauração e explicação das recomendações locais.
- [ ] **Inbox e gamificação (`CH1–CH2`, `CX1–CX2`, `CO1–CO2`, `PD1–PD3`):** fechar histórico, busca, exportação, recuperação, preferências e acessibilidade das experiências solo.
- [ ] **Cadernos, feed e tópicos (`CP1–CP4`, `FD1–FD3`, `TP1–TP3`):** entregar pacote de caderno, timeline pessoal completa, catálogo privado e exportação reversível.
- [ ] **Controle (`BE1–BE3`, `PM1`, `CN1–CN2`, `AJ1–AJ2`, `S1–S3`):** garantir privacidade por escopo, migração, exclusão, restauração parcial, retenção e ajuda completa.
- [ ] Garantir a melhor experiência local-only singleplayer: completa, acessível, rápida, portável e recuperável.
- [ ] Validar o fluxo completo sem rede, incluindo backup, restauração, atualização e recuperação de falhas.
- [ ] Documentar claramente que colaboração, chat real, backend, sincronização, IA/OCR, plugins, integrações, comunidade e publicação externa permanecem em `FUTURE`.

## Passos detalhados de execução dos MVPs pendentes

Os passos abaixo são a ordem de trabalho dentro de cada fase. Eles não autorizam antecipar infraestrutura pesada: cada etapa deve terminar em uma fatia local demonstrável, e a decisão de arquitetura só pode ser tomada depois da descoberta do domínio correspondente.

### Roteiro do MVP3 — Patinete

1. [ ] **Entender o domínio antes da arquitetura:** observar como a pessoa captura uma ideia, compromisso, falta, nota ou lembrete rápido quando está longe do computador; registrar interrupções, retomadas, adiamentos e perdas.
2. [ ] **Construir a linguagem ubíqua:** validar `Captura`, `Atividade`, `Evento`, `Lembrete`, `Contexto`, `Nota`, `Inbox`, `Recorrência simples`, `Concluído`, `Adiado` e `Arquivado`; separar captura ainda não classificada de atividade já planejada.
3. [ ] **Identificar subdomínios:** manter o foco em Organização Pessoal, com projeções mínimas para Estudo, Conhecimento e Situação Acadêmica; não criar Chat, Grupo ou Notificação remota.
4. [ ] **Delimitar bounded contexts:** definir `Capture` como agregado de entrada, `StudyActivity` como agregado de execução e `CalendarEntry` como projeção/agenda; definir claramente quem pode alterar cada estado.
5. [ ] **Mapear relações entre contextos:** permitir que uma captura vire uma atividade ou uma nota por comando explícito; permitir referências a disciplina/tópico sem copiar esses dados; definir o comportamento quando a referência estiver ausente.
6. [ ] **Modelar cada contexto:** modelar estados, identificadores estáveis, timestamps, arquivamento, recorrência simples, checklist, justificativa e eventos de domínio locais; testar idempotência de concluir/adiar/restaurar.
7. [ ] **Separar domínio de infraestrutura:** implementar primeiro casos de uso com repositórios falsos; só depois conectar IndexedDB, relógio local, File API e scheduler de lembretes internos.
8. [ ] **Definir casos de uso:** `Capturar rapidamente`, `Classificar captura`, `Criar atividade`, `Editar prazo`, `Concluir`, `Adiar`, `Arquivar`, `Restaurar`, `Criar recorrência simples`, `Exportar escopo` e `Importar pacote`; escrever pré/pós-condições e desfazer.
9. [ ] **Integrar contextos conscientemente:** ligar Inbox, Home, Calendário, disciplina, nota e busca por identificadores/read models; validar que nenhuma tela grava diretamente em agregado de outro contexto.
10. [ ] **Refinar continuamente:** testar o fluxo `capturar → reencontrar → organizar → concluir/adiar` com pessoas reais; registrar termos confusos, remover campos sem uso e decidir o que continua simples antes do Bicicleta.
11. [ ] **Critério de saída:** demonstrar o fluxo em aparelho sem rede, fechar/reabrir o app, restaurar um pacote, filtrar recentes e provar que uma captura não vira chat ou colaboração.

### Roteiro do MVP4 — Bicicleta

1. [ ] **Entender o domínio antes da arquitetura:** observar como a pessoa conecta uma captura a uma disciplina, nota, tópico, material, meta, exercício ou sessão; identificar onde hoje ela duplica informação.
2. [ ] **Construir a linguagem ubíqua:** validar `Âncora`, `Referência`, `Backlink`, `Tópico`, `Material`, `Meta`, `Exercício`, `Dependência`, `Evidência`, `Relação tipada` e `Progresso`; separar relação de cópia de conteúdo.
3. [ ] **Identificar subdomínios:** aprofundar Conhecimento Pessoal e suas relações com Organização, Estudo e Situação Acadêmica; manter Acervo como fonte de referência e não como editor editorial.
4. [ ] **Delimitar bounded contexts:** declarar agregados `Note`, `KnowledgeTopic`, `PersonalReference`, `StudyActivity`, `Goal` e `Exercise`; declarar quais vínculos são referências, snapshots ou read models.
5. [ ] **Mapear relações entre contextos:** definir tradução entre tópico e conceito de Estudo, atividade e checklist, material e disciplina, nota e evidência; especificar o que acontece ao arquivar, apagar ou não encontrar a origem.
6. [ ] **Modelar cada contexto:** definir tipos de relação, direção, cardinalidade, origem, autoria local, ciclo de vida e política de exclusão; impedir backlinks órfãos silenciosos e duplicação de tarefas.
7. [ ] **Separar domínio de infraestrutura:** manter cálculo de relações, backlinks e progresso em serviços puros; conectar índice local, parser Markdown, renderizador e biblioteca visual somente por portas.
8. [ ] **Definir casos de uso:** `Ancorar nota`, `Criar backlink`, `Relacionar tópico`, `Ligar material`, `Criar checklist`, `Criar exercício`, `Associar meta`, `Abrir origem`, `Desvincular`, `Reindexar` e `Restaurar relação`.
9. [ ] **Integrar contextos conscientemente:** fazer Home, Busca, Calendário, Disciplina, Acervo, Nota, Árvore e Board consumirem read models consistentes; garantir que uma relação altere apenas o contexto proprietário.
10. [ ] **Refinar continuamente:** observar se os vínculos realmente reduzem cópia manual; revisar tipos de relação, nomes e navegação; promover para a próxima fase apenas relações usadas e compreendidas.
11. [ ] **Critério de saída:** demonstrar `captura → nota/atividade → tópico/material → prática → revisão`, com backlinks, busca local, referência indisponível e fallback textual.

### Roteiro do MVP5 — Moto

1. [ ] **Entender o domínio antes da arquitetura:** observar decisões difíceis que exigem cálculo ou comparação: “quanto preciso”, “e se eu faltar”, “o que revisar”, “qual conflito resolver” e “qual visão usar”.
2. [ ] **Construir a linguagem ubíqua:** validar `Regra composta`, `Hipótese`, `Projeção`, `Fato`, `Risco`, `Cenário`, `Exceção`, `Conflito`, `Lente`, `Preset`, `Recomendação determinística` e `Auditoria`; nunca chamar projeção de resultado oficial.
3. [ ] **Identificar subdomínios:** aprofundar Situação Acadêmica, Organização, Conhecimento e Visualizações; manter IA/OCR, integração institucional e recomendações comunitárias fora do escopo.
4. [ ] **Delimitar bounded contexts:** separar calculadora acadêmica, agenda/rearranjo, motor de regras, visualização e preferências; cada um recebe fatos e devolve projeções sem mutação oculta.
5. [ ] **Mapear relações entre contextos:** documentar quais fatos alimentam cada cenário, de onde vêm pesos/limites, como uma hipótese é isolada e como uma alteração de regra invalida uma projeção.
6. [ ] **Modelar cada contexto:** definir value objects para pesos, porcentagens, duração, créditos, frequência e risco; definir versionamento local de regra, origem do cálculo, arredondamento e precisão.
7. [ ] **Separar domínio de infraestrutura:** implementar motores puros e determinísticos antes de Workers, lazy-loading ou bibliotecas gráficas; qualquer tarefa pesada deve ser cancelável e ter resumo textual.
8. [ ] **Definir casos de uso:** `Simular nota`, `Simular falta`, `Calcular frequência`, `Projetar integralização`, `Detectar conflito`, `Replanejar`, `Criar lente`, `Salvar preset`, `Comparar cenários`, `Abrir grafo/mapa` e `Desfazer automação`.
9. [ ] **Integrar contextos conscientemente:** conectar projeções à Home, Calendário, Disciplina, Meta, Prática e Conhecimento por contratos/read models; nenhuma recomendação pode alterar atividade, nota ou falta sem confirmação.
10. [ ] **Refinar continuamente:** medir se cenários explicáveis ajudam decisões reais; revisar fórmulas, arredondamentos, acessibilidade e linguagem; remover automações que gerem ansiedade ou surpresa.
11. [ ] **Critério de saída:** demonstrar cenário acadêmico, conflito de agenda, lente/visualização e automação reversível com dados fato/hipótese separados, falha isolada e fallback textual.

### Roteiro do MVP6 — Carro

1. [ ] **Entender o domínio antes da arquitetura:** acompanhar um ciclo prolongado de estudo e organização, incluindo vários contextos, períodos, cadernos, regras, importações, exclusões e recuperação de falhas.
2. [ ] **Construir a linguagem ubíqua:** consolidar o glossário dos MVPs, eliminar sinônimos conflitantes e documentar fatos, snapshots, projeções, cópias, forks pessoais, pacotes e registros órfãos.
3. [ ] **Identificar subdomínios:** revisar todos os subdomínios locais e marcar cada capacidade como núcleo, apoio, genérica ou futura; nenhum requisito de grupo, identidade, servidor ou IA pode entrar por “completude”.
4. [ ] **Delimitar bounded contexts:** congelar somente os contratos necessários para a versão local; explicitar ownership, limites de transação local, read models reconstruíveis e campos de migração por contexto.
5. [ ] **Mapear relações entre contextos:** testar referências ausentes, banco parcialmente restaurado, versão antiga, arquivo duplicado, lente removida e mudança de regra; documentar tradução, fallback e relatório ao usuário.
6. [ ] **Modelar cada contexto:** fechar agregados, invariantes, eventos locais, auditoria, tombstones, versionamento de registro e políticas de retenção; validar que apagar uma projeção não apaga sua fonte.
7. [ ] **Separar domínio de infraestrutura:** validar adapters de IndexedDB/File API, exportação, importação, checksum, migração, renderização e performance; manter interfaces de rede ausentes ou explicitamente futuras.
8. [ ] **Definir casos de uso:** cobrir criação, edição, busca, prática, cálculo, visualização, exportação, importação, migração, restauração parcial, exclusão, retenção, ajuda e recuperação de cada contexto local.
9. [ ] **Integrar contextos conscientemente:** executar o fluxo completo de Home, Calendário, Acadêmico, Estudo, Conhecimento, Acervo, Inbox, Metas, Prática, Pausas e Controle; reconstruir read models sem divergência e sem dependência circular.
10. [ ] **Refinar continuamente:** rodar testes com banco vazio, mínimo, grande, inválido e parcialmente recuperado; revisar telemetria local/feedback exportado, acessibilidade, custo de armazenamento e decisões de produto.
11. [ ] **Critério de saída:** entregar a melhor versão local-only singleplayer: portável, acessível, rápida, recuperável, explicável e demonstrável sem rede, deixando colaboração, chat real, sync, backend, IA/OCR, plugins, integrações, comunidade e vocabulário personalizado em `FUTURE`.

## Operação do backlog por turnos independentes

Este backlog será consumido por um agente em turnos pequenos e incrementais. Os itens amplos da matriz e dos checklists de release são **épicos/pais**; eles não devem ser marcados diretamente enquanto as tarefas filhas não estiverem concluídas.

### Regras para escolher e executar uma tarefa

- [ ] Selecionar somente o primeiro item não concluído cuja dependência esteja concluída; respeitar a ordem do `ID` quando houver mais de uma tarefa pronta.
- [ ] Trabalhar em uma única tarefa por turno; não iniciar outra feature apenas porque a primeira terminou antes do esperado.
- [ ] Se a tarefa exigir mais de um resultado observável, quebrá-la em tarefas filhas no próprio backlog antes de implementar e manter a tarefa pai desmarcada.
- [ ] Antes de agir, ler o contexto da feature, o bounded context proprietário, os contratos, a escadinha do MVP e os limites de `FUTURE`.
- [ ] Não antecipar arquitetura, infraestrutura, abstração ou componente visual sem uma decisão de domínio registrada para a tarefa.
- [ ] Não implementar uma capacidade futura “pela metade” dentro de um MVP; substituir por estado local honesto, arquivo manual, fixture ou mensagem explicativa.
- [ ] Limitar cada turno a um resultado revisável: uma regra, um caso de uso, uma migração, uma tela/estado, um componente ou um conjunto pequeno de testes relacionados.
- [ ] Evitar alterações não relacionadas. Se uma descoberta exigir mudança fora do escopo, registrar a descoberta e abrir uma tarefa separada.
- [ ] Não marcar tarefa por compilação apenas: a saída precisa atender domínio, comportamento, UI/UX, acessibilidade e teste proporcional.

### Formato obrigatório de cada tarefa filha

Cada nova tarefa operacional deve conter, no texto ou em uma ficha vinculada no backlog:

- [ ] **ID estável:** `MVP-CONTEXTO-CATEGORIA-NÚMERO`, por exemplo `M3-ORG-UC-001`.
- [ ] **Objetivo único:** verbo + objeto + escopo, sem “implementar tudo”, “ajustar tela” ou “melhorar UX” sem delimitação.
- [ ] **Dependência:** IDs que precisam estar concluídos antes de começar.
- [ ] **Saída:** artefato observável, como regra documentada, caso de uso, componente, tela, migração, teste ou roteiro.
- [ ] **Critério de aceite:** comportamento verificável com dados mínimo, normal, inválido e vazio quando aplicável.
- [ ] **Limite:** o que deliberadamente não entra nesta tarefa e permanece para outra ou para `FUTURE`.
- [ ] **Evidência:** teste, captura, roteiro, decisão de domínio ou relatório que permite outro agente continuar.

### Encerramento obrigatório de cada turno

- [ ] Confirmar que a tarefa ficou implementada/documentada/testada no escopo declarado.
- [ ] Executar a verificação proporcional: regra pura, caso de uso, estado de UI, acessibilidade, persistência ou integração local.
- [ ] Registrar no backlog o que foi descoberto, o que mudou na linguagem e qual é o próximo ID desbloqueado.
- [ ] Registrar bloqueio concreto quando houver dependência ausente; não contornar o bloqueio inventando servidor, usuário, IA ou dado externo.
- [ ] Deixar o workspace em estado compreensível para o próximo turno, sem trabalho parcial silencioso ou checkbox adiantado.

## Fila granular de execução por MVP

As filas abaixo são o ponto de partida para o agente. Cada item é uma tarefa pequena; os itens de feature da seção `Releases locais` só podem ser marcados depois que a fila correspondente tiver evidência suficiente.

### Fila do MVP2 — Skate

- [x] **M2-DOM-001:** registrar o problema local prioritário e o cenário de primeiro estudo sem rede. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-LANG-001:** validar os termos `Pessoa`, `Contexto`, `Curso`, `Disciplina`, `Atividade`, `Nota`, `Sessão`, `Tópico` e `Material` com exemplos válidos e inválidos. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-CTX-001:** atribuir cada dado do primeiro fluxo ao bounded context proprietário. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-MODEL-001:** definir identificadores, estados, timestamps e invariantes do contexto mínimo. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-UC-001:** escrever o caso de uso `Criar contexto/trilha` com pré-condições, pós-condições, erro e desfazer. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-UC-002:** escrever o caso de uso `Registrar atividade/nota` sem duplicar entidade entre telas. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-UC-003:** escrever o caso de uso `Iniciar/concluir sessão` e a retomada após fechamento. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-INFRA-001:** definir portas locais e adapter de persistência sem acoplar domínio a UI ou IndexedDB. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-UI-001:** montar o shell visual comum com grid, navegação, tipografia, tokens, card, campo, botão, chip, status e foco. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-UI-002:** entregar Home, trilha, disciplina, atividade e detalhe com os mesmos padrões visuais e sem overflow. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-UI-003:** entregar estados vazio, carregando, erro, offline, salvando, salvo e cancelado para o primeiro fluxo. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-UI-004:** validar responsividade, toque, teclado, leitor de tela, modo escuro e fonte ampliada no fluxo principal. Evidência: [`docs/mvp2-skate.md`](mvp2-skate.md).
- [x] **M2-TEST-001:** testar regra de domínio, caso de uso, persistência após recarregar e restauração de estado interrompido. Evidência: testes de domínio, `enroll-course.command-handler.test.ts`, `progress.test.ts` e `progress-migration.test.ts`.
- [x] **M2-TEST-002:** executar o roteiro visual em mobile estreito, mobile largo, tablet, desktop e janela dividida. Evidência: `mvp2-test002.spec.ts` e tarefa `mvp2:visual:check`.
- [x] **M2-REVIEW-001:** conduzir uma demonstração sem rede e registrar vocabulário, atritos, decisões e tarefas do Patinete. Evidência: [`docs/mvp2-review-001.md`](mvp2-review-001.md), `mvp2-review-001.spec.ts` e tarefa `mvp2:review:check`.

### Fila do MVP3 — Patinete

- [x] **M3-DOM-001:** observar e registrar três cenários de captura rápida: ideia, compromisso e lembrete acadêmico. Evidência: [`docs/mvp3-patinete.md`](mvp3-patinete.md), com entradas mínimas, estados, invariantes e limites locais.
- [x] **M3-LANG-001:** fechar o significado de `Captura`, `Inbox`, `Atividade`, `Evento`, `Lembrete`, `Adiado`, `Arquivado` e `Recorrência simples`. Evidência: [`docs/mvp3-patinete.md`](mvp3-patinete.md), com contrato, estados, desambiguação e precedência dos modelos existentes.
- [x] **M3-CTX-001:** delimitar `Capture`, `StudyActivity` e `CalendarEntry`, incluindo ownership e read models. Evidência: [`docs/mvp3-patinete.md`](mvp3-patinete.md), com contextos, fontes de verdade, fluxo entre contextos e regras de ownership.
- [x] **M3-MODEL-001:** modelar conversão de captura em nota ou atividade sem cópia concorrente. Evidência: [`docs/mvp3-patinete.md`](mvp3-patinete.md), com procedência única, promoção transacional, idempotência e preservação do texto.
- [x] **M3-MODEL-002:** modelar recorrência simples, ocorrência gerada, exceção manual e arquivamento. Evidência: [`docs/mvp3-patinete.md`](mvp3-patinete.md), com regra local, identidade de ocorrência, exceções limitadas, arquivamento e invariantes.
- [x] **M3-UC-001:** implementar/documentar `Capturar rapidamente` com salvamento local imediato. Evidência: `add-study-capture.function.test.ts`, fluxo `SavePersonalWorkspacePort` e documentação em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-UC-002:** implementar/documentar `Classificar captura` preservando texto, data e procedência. Evidência: handler, porta, adapter Dexie, testes de domínio e documentação em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-UC-003:** implementar/documentar `Concluir`, `Adiar`, `Arquivar` e `Restaurar` com idempotência e desfazer. Evidência: transições puras no domínio, handlers/ports CQRS, adapters Dexie, testes de ciclo de vida e [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-UC-004:** implementar/documentar lista, mês e semana com criação a partir da posição selecionada. Evidência: modelo `CalendarEntry`, funções de domínio, handlers/ports CQRS, adapters Dexie, testes de criação/idempotência/períodos e [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-UC-005:** implementar/documentar lembrete interno e preferência `sim/agora não/nunca`, sem permissão externa obrigatória. Evidência: `ReminderPreference`, normalização compatível, ciclo de preferência, visibilidade local e testes em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-UI-001:** aplicar o shell do Skate a Inbox, captura rápida, lista, calendário, detalhe e preferências. Evidência: rota lazy de agenda local, controles dia/semana/mês, formulário de compromisso, estados alternativos e composição do espaço pessoal em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-UI-002:** revisar formulários para teclado virtual, preservação de entrada, validação contextual e retorno ao foco. Evidência: campos de criação separados, valores preservados durante a edição, campos essenciais obrigatórios e ações desabilitadas até a entrada mínima em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-UI-003:** revisar densidade, filtros, chips, estados vazios e mensagens de retomada conforme a linguagem do mockup. Evidência: [`docs/mvp3-patinete.md`](mvp3-patinete.md), seção `M3-UI-003`, filtros locais e estado vazio do espaço pessoal.
- [x] **M3-UI-004:** validar que nenhuma tela pareça chat, grupo ou RSVP; a representação é explicitamente pessoal. Evidência: [`packages/app/tests/e2e/mvp3-ui004.spec.ts`](../packages/app/tests/e2e/mvp3-ui004.spec.ts) e seção `M3-UI-004` em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-INFRA-001:** adicionar índice local incremental e scheduler local somente após os casos de uso estarem definidos. Evidência: `personal-search-index.test.ts`, `list-personal-reminder-candidates.function.test.ts` e seção `M3-INFRA-001` em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-TEST-001:** testar captura offline, conversão, recorrência, exceção, adiar, restaurar e reabrir o app. Evidência: `capture-lifecycle.function.test.ts`, `calendar-entries.function.test.ts`, `personal-workspace-reopen.test.ts`, `mvp3-test001.spec.ts` e seção `M3-TEST-001` em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-TEST-002:** testar lista/mês/semana com texto longo, nenhum item, muitos itens, conflito simples e viewport estreito. Evidência: `calendar-entries.function.test.ts`, `mvp3-test002.spec.ts` e seção `M3-TEST-002` em [`docs/mvp3-patinete.md`](mvp3-patinete.md).
- [x] **M3-REVIEW-001:** observar reencontro de uma captura depois de um dia e registrar se o atrito caiu. Evidência: `personal-workspace-reopen.test.ts`, `list-personal-reminder-candidates.function.test.ts`, `mvp3-test001.spec.ts` e seção `M3-REVIEW-001` em [`docs/mvp3-patinete.md`](mvp3-patinete.md); revisão interna reproduzível, sem alegar pesquisa externa.

### Fila do MVP4 — Bicicleta

- [x] **M4-DOM-001:** observar onde a pessoa duplica informação ao ligar nota, tópico, material, disciplina, atividade e meta. Evidência: [`docs/mvp4-dom-001.md`](mvp4-dom-001.md), com observação interna reproduzível, decisões de ownership e limites sem antecipar pesquisa com usuários.
- [x] **M4-LANG-001:** fechar `Âncora`, `Backlink`, `Referência`, `Relação tipada`, `Dependência`, `Evidência`, `Progresso` e `Lente`. Evidência: [`docs/mvp4-bicicleta.md`](mvp4-bicicleta.md), com precedência dos termos canônicos existentes e limites semânticos.
- [x] **M4-CTX-001:** delimitar ownership de `Note`, `KnowledgeTopic`, `PersonalReference`, `Goal` e `Exercise`. Evidência: [`docs/mvp4-bicicleta.md`](mvp4-bicicleta.md), com tabela de contextos proprietários e regra de não duplicação.
- [x] **M4-MODEL-001:** definir tipos, direção, cardinalidade, origem e ciclo de vida das relações locais. Evidência: [`docs/mvp4-bicicleta.md`](mvp4-bicicleta.md), contratos `PersonalRelation`, endpoints tipados, invariantes e testes de persistência.
- [x] **M4-MODEL-002:** definir comportamento para origem arquivada, ausente, importada, inválida ou parcialmente restaurada. Evidência: resolução pura `resolvePersonalRelation`, estados de endpoint e testes em [`docs/mvp4-bicicleta.md`](mvp4-bicicleta.md).
- [x] **M4-UC-001:** implementar/documentar `Ancorar nota` e `Abrir origem` sem mudar o contexto proprietário. Evidência: composer de relações, rota/hash por endpoint, âncoras estáveis nos registros pessoais, teste de caminhos e [`docs/mvp4-bicicleta.md`](mvp4-bicicleta.md).
- [x] **M4-UC-002:** implementar/documentar `Criar backlink`, `Mencionado em` e `Desvincular`. Evidência: consulta direcional `listPersonalBacklinks`, seção `Mencionado em`, seletor `Backlink` e ação reversível `Desvincular`/`Restaurar vínculo`; testes de filtro e arquivamento.
- [x] **M4-UC-003:** implementar/documentar `Ligar material`, `Associar meta` e `Criar exercício`. Evidência: endpoints canônicos `reference`, `goal` e `question`, parser/testes, rotas proprietárias e âncora de `StudyGoal`; sem cópia ou edição da fonte.
- [x] **M4-UC-004:** implementar/documentar árvore, board e lentes pessoais sobre a mesma fonte de dados. Evidência: `PersonalKnowledgeViewsSection`, projeção pura `createPersonalKnowledgeProjection`, `PersonalLens` persistida dentro de `PersonalWorkspace` e teste de domínio em `create-personal-lens.function.test.ts`.
- [x] **M4-UC-005:** implementar/documentar progresso conectado entre sessão, tópico, exercício, meta e atividade. Evidência: read model `PersonalProgressReadModel`, projeção por referências canônicas, preservação de evidências não vinculadas, ilha de loading/error e testes em `create-personal-progress-read-model.function.test.ts`.
- [x] **M4-UI-001:** revisar notas, cadernos, árvore, board, backlinks, acervo e detalhe para manter a entidade selecionada. Evidência: `usePersonalEntitySelection`, `PersonalEntitySelectionSurface` e integração nos registros pessoais, relações, backlinks, árvore e board.
- [x] **M4-UI-002:** criar navegação de origem/retorno para cada relação, com breadcrumb, filtro de contexto e estado ausente. Evidência: `PersonalRelationContent` exibe breadcrumb e ações de origem/destino; `PersonalRelationContextFilterControls` filtra por contexto; `getPersonalRelationEndpointAvailability` e `PersonalRelationEndpointStatus` preservam e informam endpoints pessoais ausentes ou arquivados.
- [x] **M4-UI-003:** garantir que densidade de relações não cause cartões ilegíveis, linhas sobrepostas ou scroll preso. Evidência: `UIResponsiveGrid` fecha as colunas do board em grid responsivo com `minmax`, `minWidth: 0` e quebra de identificadores; `UIWrappedTypography` impede que endpoints longos sobreponham ou estourem a superfície.
- [x] **M4-INFRA-001:** conectar índice, parser Markdown, renderizador e visualização por portas definidas no domínio. Evidência: `ParseEditorialBlocksPort`, `BuildKnowledgeGraphPort` e `GetTopicMapPort` são resolvidas pela composição; handlers CQRS expõem esses serviços à aplicação; o app consulta os handlers e `UIContentRenderer` recebe apenas o resultado tipado.
- [x] **M4-TEST-001:** testar criação, remoção, restauração, relação órfã, reindexação e consistência entre visões. Evidência: testes do adapter de relações e do domínio para ciclo de vida/orfandade, `personal-search-index.test.ts` para reindexação, `create-personal-lens.function.test.ts` e `create-personal-progress-read-model.function.test.ts` para consistência das projeções, além dos testes de filtro e disponibilidade de endpoint.
- [x] **M4-TEST-002:** testar árvore/board/lista com teclado, leitor de tela, fallback textual e ausência de suporte gráfico. Evidência: `personal-knowledge-views.component.test.tsx` verifica botões semânticos, seleção por Enter, labels acessíveis, fallback textual de endpoints, metadados de grid e ausência de `canvas`/`svg` nas visões locais.
- [x] **M4-REVIEW-001:** verificar se a pessoa consegue sair de captura e chegar à prática/revisão sem recadastrar dados. Evidência: `getPersonalCaptureContentPath` preserva o `contentKey` e resolve rotas locais para questão, aula e tópico; `StudyCaptureDisplay` oferece prática e revisão diretamente a partir da captura.

### Fila do MVP5 — Moto

- [x] **M5-DOM-001:** coletar decisões locais que exigem cálculo, comparação, projeção ou rearranjo. Evidência: [`docs/mvp5-moto.md`](mvp5-moto.md), com decisões, fatos de entrada, saídas, ownership e invariantes locais.
- [x] **M5-LANG-001:** fechar `Fato`, `Hipótese`, `Projeção`, `Cenário`, `Risco`, `Regra composta`, `Exceção`, `Conflito` e `Auditoria`. Evidência: [`docs/mvp5-moto.md`](mvp5-moto.md), com termos canônicos, contratos existentes e regras de desambiguação sem criar entidades prematuras.
- [x] **M5-CTX-001:** delimitar calculadora acadêmica, agenda/rearranjo, visualizações e preferências como responsabilidades distintas. Evidência: [`docs/mvp5-moto.md`](mvp5-moto.md), com tabela de ownership, regras de fronteira, fluxo permitido e contratos proprietários.
- [x] **M5-MODEL-001:** modelar value objects de peso, frequência, crédito, duração, limite, precisão e arredondamento. Evidência: [`docs/mvp5-moto.md`](mvp5-moto.md) e contratos `*.model.ts` em `packages/pkg-domain/src/models`, com unidades e invariantes explícitos sem alterar o SQLite.
- [x] **M5-MODEL-002:** modelar versão de regra, origem do cálculo, hipótese editável e invalidação de projeção. Evidência: [`docs/mvp5-moto.md`](mvp5-moto.md) e contratos de linhagem `calculation-*.model.ts`/`*.type.ts` em `packages/pkg-domain/src/models`, sem persistência nova.
- [x] **M5-UC-001:** implementar/documentar `Simular nota`, `Simular falta` e `Calcular frequência` com fórmula visível. Evidência: funções puras em `packages/pkg-domain/src/study`, fórmulas e limites em [`docs/mvp5-moto.md`](mvp5-moto.md), com testes de não mutação e arredondamento.
- [x] **M5-UC-002:** implementar/documentar `Detectar conflito`, `Replanejar` e `Desfazer rearranjo` sem alteração silenciosa. Evidência: ordenação existente, cálculo de permutação/conflito e restauração por cópia em `packages/app/src/features/study-plans`, com testes e regras em [`docs/mvp5-moto.md`](mvp5-moto.md).
- [x] **M5-UC-003:** implementar/documentar `Criar lente`, `Salvar preset`, `Comparar cenários` e `Trocar visualização`. Evidência: `createPersonalLens`, `savePersonalLens` e `calculatePersonalLensComparison` são funções puras do domínio; `usePersonalKnowledgeViewState` troca árvore/board sem mutar o workspace; testes cobrem criação, atualização sem duplicação, comparação e troca local.
- [x] **M5-UC-004:** implementar/documentar recomendações determinísticas somente com fatos locais e explicação da origem. Evidência: `getNextRecommendationDecision` reutiliza `recommendNext`, retorna `RecommendationReason` (`recent-error`, `weak-mastery`, `unblocked-item`, `fallback` ou `none`) e possui testes sem persistência ou rede.
- [x] **M5-UI-001:** revisar simuladores, gráficos, mapas, grafos, painéis e tabelas para hierarquia e carga cognitiva. Evidência: superfícies de visualização, métricas e cálculos usam título, estado isolado, camada visual e read models, conforme [`docs/mvp5-moto.md`](mvp5-moto.md).
- [x] **M5-UI-002:** fornecer sempre lista/resumo textual equivalente às visualizações complexas. Evidência: `UIVisualizationTextSummary` acompanha gráfico, mapa e cena 3D; testes verificam resumo textual de cada bloco.
- [x] **M5-UI-003:** tratar cancelamento, progresso, lazy-loading e erro isolado sem travar o restante da tela. Evidência: `Suspense`/`UIContentLoadingFallback`, imports dinâmicos, guards de atividade, cleanup de ECharts/Cytoscape/Three e fallback por bloco.
- [x] **M5-INFRA-001:** adicionar bibliotecas visuais ou Workers somente depois de medir necessidade e definir fallback. Evidência: ECharts, Cytoscape e Three.js ficam isolados em `pkg-ui-content`, são carregados sob demanda e possuem fallback textual/capability check; nenhum Worker ou editor livre foi introduzido.
- [x] **M5-TEST-001:** testar fórmulas, arredondamento, cenário inválido, conflito, undo, hipótese e projeção desatualizada. Evidência: testes de frequência, nota/falta, rearranjo, lentes, recomendação e `isCalculationProjectionCurrent` cobrem entradas vazias, arredondamento, não mutação, conflito e estados `stale`/`invalidated`.
- [x] **M5-TEST-002:** testar visualizações com muitos nós, tela pequena, fonte ampliada, leitor de tela e biblioteca indisponível. Evidência: teste de mapa com 48 nós e fallback de gráfico em `visualization-blocks.component.test.tsx`; viewport, fonte ampliada, overflow, teclado, foco e axe em `mvp2-ui004.spec.ts`, `accessibility-routes.spec.ts` e `layout-integrity.spec.ts`; detalhes em [`docs/mvp5-moto.md`](mvp5-moto.md).
- [x] **M5-REVIEW-001:** validar que cada automação reduz uma decisão repetitiva sem gerar surpresa, urgência ou perda de controle. Evidência: recomendação explica a origem, revisão é adiada/suspensa/avaliada manualmente, preferências permitem desligar recursos e nenhuma automação persiste mudança sem ação explícita; detalhes em [`docs/mvp5-moto.md`](mvp5-moto.md).

### Fila do MVP6 — Carro

- [x] **M6-DOM-001:** acompanhar um ciclo completo com vários contextos, períodos, cadernos, regras, importações e restaurações. Evidência: ciclo local de estudo, situação acadêmica, `PersonalWorkspace`, preferência, exportação com checksum e restauração `replace` em `progress.test.ts`; decisões em [`docs/mvp6-carro.md`](mvp6-carro.md).
- [x] **M6-LANG-001:** consolidar o glossário e remover termos concorrentes ou estados que não possam ser explicados ao usuário. Evidência: tabela de termos canônicos, estados de recuperação e distinção entre fato/projeção em [`docs/mvp6-carro.md`](mvp6-carro.md).
- [x] **M6-CTX-001:** revisar ownership, agregados, read models, contratos e dependências circulares de todos os contextos locais. Evidência: matriz de ownership e regras de fronteira em [`docs/mvp6-carro.md`](mvp6-carro.md), validada pelo teste arquitetural e pelos contratos de aplicação.
- [x] **M6-MODEL-001:** fechar versionamento, migração, tombstone local, auditoria, retenção e registros órfãos recuperáveis. Evidência: migração Dexie v8 com `tombstones`, `ProgressBackupEvent`, `BackupRetentionPolicy`, estados de relação recuperável e testes em `progress-migration.test.ts`/`progress-recovery-model.test.ts`; detalhes em [`docs/mvp6-carro.md`](mvp6-carro.md).
- [ ] **M6-UC-001:** fechar criação, edição, busca, prática, cálculo, visualização, exportação, importação, exclusão e restauração por contexto.
- [ ] **M6-UC-002:** implementar/documentar restauração parcial com prévia, validação, relatório por entidade e opção de interromper.
- [x] **M6-UC-003:** implementar/documentar reconstrução de índices e read models após migração ou restauração. Evidência: `ProgressDatabase.rebuildPersonalSearchIndex()` e reconstrução automática após importação; testes de perda do read model e restauração em `personal-search-index.test.ts`.
- [ ] **M6-UI-001:** executar revisão visual tela a tela contra a gramática Fable absorvida, sem copiar CSS 1:1.
- [ ] **M6-UI-002:** corrigir desalinhamento, inconsistência de componentes, overflow, clipping, scroll preso e foco perdido.
- [ ] **M6-UI-003:** validar PWA/web/desktop com coluna única, multipainel, janela dividida, zoom 200% e fonte ampliada.
- [ ] **M6-INFRA-001:** validar persistência, checksum, migração, exportação/importação e performance em armazenamento limitado.
- [ ] **M6-TEST-001:** executar matriz de banco vazio, mínimo, normal, grande, inválido e parcialmente recuperado.
- [ ] **M6-TEST-002:** executar matriz de acessibilidade, responsividade, tema, teclado, leitor de tela, impressão/exportação e redução de movimento.
- [ ] **M6-TEST-003:** executar fluxo completo sem rede e confirmar que nenhuma tela promete capacidade de `FUTURE`.
- [ ] **M6-REVIEW-001:** realizar revisão final de produto, domínio, UI, UX, acessibilidade, recuperação e portabilidade antes de fechar o Carro.

### Regra para transformar feature em fila

Para cada linha de tela/feature da matriz e para cada MVP, o agente deve criar, quando ainda não existirem, pelo menos estas tarefas filhas:

- [ ] `DOM`: cenário real e problema que a feature resolve.
- [ ] `LANG`: termos, estados, invariantes e exemplos.
- [ ] `CTX`: bounded context proprietário e relações.
- [ ] `MODEL`: entidades, comandos, consultas e persistência.
- [ ] `UC`: caso de uso mínimo da coluna do MVP.
- [ ] `UI`: composição usando padrões visuais existentes e comportamento responsivo.
- [ ] `STATES`: vazio, carregando, erro, offline, cancelado, salvo e recuperação aplicáveis.
- [ ] `A11Y`: foco, teclado, leitor de tela, contraste, toque e fallback equivalente.
- [ ] `TEST`: domínio, aplicação, interface e roteiro manual proporcional.
- [ ] `REFINE`: aprendizado, decisão e próximo incremento.

Uma tarefa só pode ser marcada quando sua saída for observável e o próximo agente conseguir continuar lendo apenas o backlog, o código existente e a evidência registrada. “Implementar a feature X” é sempre um épico e nunca uma tarefa de turno.

## Critérios herdados e escalonados nos cinco MVPs

Esta seção reincorpora os detalhes operacionais do backlog anterior. Cada item abaixo deve ser aplicado progressivamente à mesma feature, respeitando a coluna da matriz.

### Anotações privadas e âncoras

- [ ] **Skate:** criar uma nota simples ligada ao contexto atual, com estado vazio, erro, edição e exclusão recuperável.
- [ ] **Patinete:** ancorar notas em `LearningCourse`, `StudyPlan`, `Lesson`, `Question`, `Topic` ou `StudyRecord`, quando essas entidades estiverem disponíveis localmente; exportar notas e tratar estados vazio, erro e indisponibilidade.
- [ ] **Bicicleta:** permitir backlinks, checklist dentro da nota e navegação entre nota, aula, questão, tópico, atividade e material.
- [ ] **Moto:** suportar blocos, relações tipadas, histórico local, filtros por âncora e tinta local simples sem OCR.
- [ ] **Carro:** exportar, restaurar, versionar e recuperar notas ancoradas sem perder vínculos ou registros órfãos.

### Busca local e ações

- [ ] **Skate:** buscar por título/texto em um contexto local e apresentar vazio, erro e limpeza de filtros.
- [ ] **Patinete:** criar índice local incremental para conteúdo disponível, preservar recentes e agrupar resultados por tipo.
- [ ] **Bicicleta:** incluir notas, referências, atividades, materiais e tópicos; atualizar o índice após salvar, editar, arquivar ou restaurar.
- [ ] **Moto:** completar command palette com ações reversíveis, escopo explícito, posição de navegação e falha isolada por ação.
- [ ] **Carro:** reconstruir o índice após restauração/migração, suportar grande volume e respeitar privacidade por contexto.

### Acervo pessoal

- [ ] **Skate:** salvar uma referência com endereço, título e origem informados manualmente.
- [ ] **Patinete:** validar endereços, distinguir localização local de fonte externa sem baixar automaticamente, favoritar e arquivar.
- [ ] **Bicicleta:** ligar material a disciplina, nota, tópico e atividade; abrir player local ou fonte externa sem misturar conteúdo editorial.
- [ ] **Moto:** oferecer listas, filtros e recomendações determinísticas baseadas somente no acervo pessoal.
- [ ] **Carro:** exportar, restaurar, migrar e verificar referências, incluindo fonte indisponível e registros parcialmente recuperados.

### Visualizações pedagógicas

- [ ] **Skate:** oferecer lista e árvore simples usando uma única fonte local de tópicos, preparada para o `TopicMapReadModel`.
- [ ] **Patinete:** adicionar cards e sequência, mantendo a mesma fonte e tratando conteúdo parcial.
- [ ] **Bicicleta:** associar gráficos, mapas e métricas ao domínio e ao progresso existentes.
- [ ] **Moto:** carregar bibliotecas sob demanda, isolar erro por visualização e oferecer grafo/mapa com fallback textual equivalente.
- [ ] **Carro:** cobrir visualizações com testes de acessibilidade, dispositivos sem suporte gráfico, grandes volumes e recuperação após migração.

### Situação acadêmica local

- [ ] **Skate:** permitir criar, editar e remover disciplina; registrar nota, atividade, falta e justificativa manual.
- [ ] **Patinete:** registrar evidências, modalidade, limite de frequência e média mínima com recuperação de alteração inválida sem perder o registro anterior.
- [ ] **Bicicleta:** relacionar presença e notas com aulas, provas, calendário, período e integralização.
- [ ] **Moto:** suportar regras compostas por disciplina/período e cenários de aprovação/reprovação por nota e frequência.
- [ ] **Carro:** manter histórico completo do curso, migração, auditoria, exportação e restauração sem integração institucional.

### Cálculos acadêmicos transparentes

- [ ] **Skate:** configurar pesos simples, média mínima e regra separada de nota/frequência.
- [ ] **Patinete:** adicionar prova final, limites, créditos e horas informados manualmente.
- [ ] **Bicicleta:** exibir origem e fórmula de cada cálculo de frequência, média, risco e nota necessária.
- [ ] **Moto:** simular “quanto preciso”, “e se eu faltar?” e projeção de conclusão com hipóteses editáveis.
- [ ] **Carro:** exportar/restaurar cálculos, preservar versões e nunca misturar situação acadêmica com conteúdo editorial.

### Controle, privacidade e acessibilidade

- [ ] **Skate:** desligar recursos opcionais por capacidade sem quebrar o estudo; exibir privacidade, procedência, créditos, licenças e estado de dados sintéticos.
- [ ] **Patinete:** apagar dados por escopo com confirmação e exportação opcional antes da remoção.
- [ ] **Bicicleta:** documentar limites de backup local e não prometer recuperação quando a chave não puder ser recuperada.
- [ ] **Moto:** oferecer auditoria local, retenção configurável, histórico de consentimentos e acessibilidade de visualizações/ações.
- [ ] **Carro:** garantir migração, restauração parcial, exclusão verificável, créditos/licenças, foco, teclado, contraste e fallback textual.

## FUTURE — somente o delta pesado

Itens nesta seção não substituem as colunas locais dos MVPs. Eles adicionam capacidades que não são necessárias para entregar a versão singleplayer completa.

Toda capacidade futura deve seguir três cortes antes de qualquer implementação:

- **ETP — experimento técnico/produto:** provar o risco principal com dados descartáveis, cancelamento e fallback.
- **EUP — experiência de uso/produto:** entregar o caso de uso com consentimento, origem, revisão e erro isolado.
- **ELP — experiência local/produtiva:** operar com segurança, limites, recuperação, privacidade, custo e observabilidade.

### FUTURE-0 — conteúdo editorial e publicação

- [ ] **ETP:** validar aula e snapshot inválidos com erros editoriais acionáveis.
- [ ] **EUP:** exigir objetivo, pré-requisitos, público, dificuldade, duração, fontes, versão, revisão e progressão pedagógica em aula publicada.
- [ ] **ELP:** validar chaves, relações órfãs, blocos permitidos, referências, HTML, scripts, código executável, imagens e embeds.
- [ ] Pipeline editorial, curadoria, publicação e distribuição continuam fora dos MVPs locais.

### FUTURE-1 — OCR e IA

- [ ] **ETP:** converter imagem local em texto revisável ou gerar sugestão claramente identificada.
- [ ] **EUP:** persistir resultado com origem, revisão, custo, consentimento e erro isolado.
- [ ] **ELP:** integrar IA local ou remota com permissões, explicação, retenção, desligamento e revisão humana.
- [ ] OCR de imagem/quadro/livro, resumo, geração de flashcards, extração de tarefas e sugestões permanecem aqui.
- [ ] Nunca escrever automaticamente em `Lesson`, `Question`, `Topic`, `StudyPlan`, nota ou exercício canônico.

### FUTURE-2 — processamento pesado e mídia avançada

- [ ] **ETP:** executar tarefa cancelável em Worker com progresso e fallback.
- [ ] **EUP:** persistir e recuperar OCR, indexação, mídia ou transformação isolada sem travar a aplicação.
- [ ] **ELP:** oferecer filas, limites, retomada, origem, custo, privacidade e controle auditável.
- [ ] **ETP:** criar traço local reversível com undo/redo quando a capacidade exceder a tinta simples do MVP5.
- [ ] **EUP:** salvar nota com desenho, fallback textual e alternativa acessível.
- [ ] **ELP:** oferecer ferramenta integrada, exportável, rápida e explicável.
- [ ] Transformar desenho, imagem, áudio ou vídeo em conteúdo estruturado ou pesquisável.
- [ ] Edição avançada de tinta, mídia ou blocos em colaboração.
- [ ] Todo resultado deve passar por revisão humana antes de alterar dados canônicos.

### FUTURE-3 — integrações externas

- [ ] **ETP:** importar ou exportar evento local em formato controlado.
- [ ] **EUP:** oferecer agenda opcional, recorrência, exceções e notificações opt-in.
- [ ] **ELP:** integrar fontes externas com conflitos explicáveis, ajuste local, revogação e recuperação.
- [ ] Calendários, Moodle, instituições, player integrado e outras fontes externas permanecem fora dos MVPs.

### FUTURE-4 — plugins, adapters e bases externas

- [ ] **ETP:** validar manifesto, versão, checksum e capabilities sem executar código.
- [ ] **EUP:** ativar fonte permissionada, somente leitura, desativável e com fallback.
- [ ] **ELP:** oferecer ecossistema versionado, isolado, auditável e recuperável.
- [ ] Consumo de bases externas e federação de exercícios, mapas e acervos permanecem fora dos MVPs.

### FUTURE-5 — colaboração, grupos, chat e comunidade

- [ ] **ETP:** exportar pacote local de grupo com comparação e dados fictícios.
- [ ] **EUP:** importar, comparar e mesclar manualmente sem perder dados individuais.
- [ ] **ELP:** colaborar por bloco com autoria, permissões, histórico, apelação, moderação e recuperação.
- [ ] Convites, membros, papéis, grupos, turmas, subgrupos, divisão entre pessoas e cobertura.
- [ ] Chat, canais, threads multiusuário, descoberta pública, RSVP e presença.
- [ ] Perfis públicos, seguir, feed social, postagem em tópicos, recomendações comunitárias, ligas e quiz ao vivo.
- [ ] Publicação pública de cadernos, materiais, mapas, trilhas e exercícios.
- [ ] Moderação, denúncia, bloqueio, abuso, histórico, apelação e colaboração por bloco.

### FUTURE-6 — sincronização, identidade remota, federação e self-host

- [ ] **ETP:** provar troca entre duas cópias descartáveis sem dados reais.
- [ ] **EUP:** sincronizar estados local, pendente, sincronizado, conflito, rejeitado, obsoleto e tombstone.
- [ ] **ELP:** oferecer transporte, merge, histórico, recuperação, identidade e autorização.
- [ ] **ETP:** validar contrato de host sem dados pessoais.
- [ ] **EUP:** migrar entre hosts com exportação verificável e sem lock-in.
- [ ] **ELP:** oferecer federação, mirror, sucessão e operação auditável.
- [ ] Federação, self-host, mirror, migração entre hosts e sucessão permanecem fora dos MVPs locais.

### FUTURE-7 — vocabulário personalizado

- [ ] **ETP:** salvar preferência local de visão ou label sem alterar termos canônicos.
- [ ] **EUP:** ordenar blocos, lentes, escopo e modo de interação com restauração.
- [ ] **ELP:** oferecer labels por escola, trilha, grupo, tela e lente com herança, tradução, conflitos e compartilhamento.

### FUTURE-8 — presença, widgets e multiplayer

- [ ] **ETP:** gerar visão local read-only da próxima atividade ou revisão.
- [ ] **EUP:** oferecer widget ou feed pessoal opt-in com escopo e desligamento.
- [ ] **ELP:** integrar plataformas, presença, minijogos duo/trio/multiplayer e notificações com permissões mínimas, privacidade e fallback na PWA.
