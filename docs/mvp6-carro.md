# MVP6 — Carro

Este documento registra as decisões do MVP6 local-only. O Carro amplia a
portabilidade, recuperação, acessibilidade e volume dos contextos já existentes;
não introduz rede, conta, colaboração, IA, OCR, plugin ou conteúdo editorial.

## M6-LANG-001 — linguagem canônica

Os nomes existentes no domínio prevalecem. Termos do wireframe que não possuem
entidade equivalente não viram entidades concorrentes.

| Termo canônico       | Uso no Carro                                                                                     | Termo evitado                      |
| -------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `PersonalWorkspace`  | agregado local que reúne notas, capturas, checklists, atividades, referências, lentes e relações | `Notebook` como agregado paralelo  |
| `PersonalNote`       | registro de conhecimento privado                                                                 | `Document` concorrente             |
| `PersonalReference`  | fonte ou material referenciado localmente                                                        | `Resource` sem ownership           |
| `StudyCapture`       | entrada ainda não classificada                                                                   | `InboxItem` como entidade paralela |
| `AcademicDiscipline` | regra acadêmica interpretada pela Pessoa                                                         | fonte institucional                |
| `StudyGoal`          | meta local mensurável                                                                            | `Objective` concorrente            |
| `StudySession`       | período de estudo persistido                                                                     | `FocusBlock` para o mesmo conceito |
| `ReviewTarget`       | item agendado para revisão                                                                       | fila opaca                         |
| `Projection`         | resultado calculado a partir de fatos ou hipóteses                                               | fato persistido                    |
| `BackupPackage`      | representação exportada e verificável do estado local                                            | sincronização                      |

Estados de recuperação são distintos: `available`, `archived`, `missing`,
`invalid` e `partially-restored`. `stale` e `invalidated` descrevem projeções,
não entidades de origem. `merge` preserva o estado existente; `replace` troca o
escopo explicitamente confirmado.

## M6-CTX-001 — ownership e dependências

| Contexto                    | Fonte de verdade local                                           | Projeções permitidas                     |
| --------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| Estudo e Aprendizagem       | curso, lição, questão, tentativa, sessão, revisão e domínio      | Home, plano, desempenho e visualizações  |
| Organização Pessoal         | `PersonalWorkspace`, atividade, calendário, captura, meta e foco | Home, busca, lembretes e relações        |
| Situação Acadêmica          | disciplina, notas, frequência, créditos e regras pessoais        | desempenho, plano e projeções acadêmicas |
| Conhecimento Pessoal        | nota, referência, checklist, relação, lente e mapa               | busca, Home, progresso e visualizações   |
| Preferências e Continuidade | configurações, backup, migração e eventos de backup              | apresentação e controle de capacidade    |

Regras de fronteira:

1. Uma projeção pode ler referências estáveis de outro contexto, mas não grava
   diretamente na fonte de verdade dele.
2. `settings` é armazenamento local de continuidade; no backup ele preserva
   preferências, workspace pessoal e índice, sem transformar esses dados em
   conteúdo editorial.
3. Uma referência ausente, arquivada ou parcialmente restaurada permanece
   identificável e é exibida como estado de recuperação, nunca apagada em
   silêncio.
4. A composição restaura os adapters; domínio e aplicação permanecem
   independentes de IndexedDB, SQL e componentes visuais.

## M6-DOM-001 — ciclo local de múltiplos contextos

O ciclo demonstrável é:

1. Registrar uma inscrição de estudo.
2. Registrar uma disciplina e seus fatos acadêmicos.
3. Criar uma nota e uma referência no `PersonalWorkspace`.
4. Salvar uma preferência local.
5. Exportar o snapshot com `schemaVersion`, `contentVersion`, origem e checksum.
6. Alterar os dados locais.
7. Restaurar por `replace` após validação.
8. Verificar estudo, situação acadêmica, workspace, índice e preferência.

O teste usa dados sintéticos, não depende de rede e não toca no SQLite
editorial. O termo “caderno” fica como composição visual futura do workspace;
não é introduzido como entidade nova enquanto o domínio canônico usa notas e
referências.

### Evidência

- `packages/pkg-adapter-data-v1/src/storage/progress.test.ts`
- `packages/pkg-adapter-data-v1/src/storage/progress.database.ts`

## Limites ainda não concluídos

O Carro ainda precisa de restauração parcial por entidade e de uma matriz E2E
completa de impressão/exportação. A política local de retenção já está
modelada e aplicável ao histórico de auditoria; a operação de manutenção pela
interface permanece pendente no backlog. Esses pontos não são mascarados como
capacidades já entregues.

## M6-UC-003 — reconstrução de índices e read models

O índice de busca pessoal é uma projeção local derivada de `PersonalWorkspace`.
Ele não é tratado como fonte de verdade: `ProgressDatabase` pode reconstruí-lo
explicitamente e executa essa reconstrução ao concluir uma importação válida,
inclusive quando o snapshot não contém o índice ou contém uma versão antiga.

O caminho de reconstrução é determinístico e cobre notas, checklists, capturas,
atividades e referências. A restauração continua transacional para os stores;
depois do commit, a projeção é reconstituída a partir do workspace restaurado.

### Evidência

- `packages/pkg-adapter-data-v1/src/storage/progress.database.ts`
- `packages/pkg-adapter-data-v1/src/storage/personal-search-index.test.ts`

## M6-MODEL-001 — versionamento, auditoria, tombstones e retenção

O banco de progresso evolui por migração Dexie versionada: a versão 8 adiciona
o store `tombstones` sem apagar stores existentes. Tombstones identificam o
registro local, o tipo, o motivo, o instante e a versão do schema; por isso um
registro removido pode continuar sendo reconhecido durante exportação,
restauração e diagnóstico.

Exportações e importações já produzem `ProgressBackupEvent` com operação,
resultado, escopo, estratégia, checksum, versões e data. A política local
`BackupRetentionPolicy` limita quantidade e idade dos eventos de auditoria sem
alterar fatos de estudo ou o conteúdo editorial. Relações apontando para
registros ausentes continuam resolvíveis pelos estados existentes
(`missing`, `invalid`, `archived` e `imported`).

### Evidência

- `packages/pkg-adapter-data-v1/src/storage/progress.database.ts`
- `packages/pkg-adapter-data-v1/src/storage/progress-migration.test.ts`
- `packages/pkg-adapter-data-v1/src/storage/progress-recovery-model.test.ts`
- `packages/pkg-domain/src/models/local-record-tombstone.interface.ts`
- `packages/pkg-domain/src/models/backup-retention-policy.interface.ts`
