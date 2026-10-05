# MVP5 — Moto

## M5-DOM-001 — decisões locais que exigem cálculo

O Moto começa pelas decisões que já possuem fatos no dispositivo e que podem ser explicadas sem rede, automação externa ou inferência opaca. O cálculo não substitui o registro original: ele produz uma projeção identificada pela fonte, pela regra e pelo momento em que foi calculada.

| Decisão local                       | Fatos de entrada                                                                  | Saída observável                                                        | Fonte proprietária                                          |
| ----------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| saber a situação de uma disciplina  | aulas previstas, aulas frequentadas, notas, máximos, pesos e limite de frequência | frequência, média atual, risco de frequência e nota necessária          | `AcademicDiscipline` e `AcademicMetrics`                    |
| decidir o próximo passo de um plano | etapas existentes, ordem atual, etapa concluída e movimento solicitado            | nova ordem explícita, sem apagar a ordem anterior durante a confirmação | `StudyPlan` e estado local do plano                         |
| decidir o que revisar               | `ReviewTarget`, vencimento, estado de memória, retenção escolhida e data local    | fila, carga estimada e prévias do scheduler                             | `ReviewTarget` e scheduler FSRS                             |
| entender a evidência de desempenho  | tentativas, acertos, dificuldade, diagnóstico e recência                          | resumo, faixa de confiança, tópicos com evidência e ação pedagógica     | `StudyRecord`, `AttemptDiagnosis` e projeções de desempenho |

### Invariantes

1. Toda saída calculada identifica ou permite recuperar os fatos que a produziram.
2. Nota, frequência, progresso, domínio e revisão continuam conceitos distintos.
3. Uma hipótese editada não altera a entidade acadêmica, o plano, a tentativa ou o agendamento original.
4. Arredondamento, limites e pesos são parte da regra visível; não existem ajustes silenciosos.
5. Uma entrada ausente produz estado incompleto ou indisponível, nunca um número inventado.
6. O cálculo permanece local e determinístico para a mesma entrada, regra e data de referência.
7. Reordenar um plano é uma intenção reversível; a Pessoa pode cancelar antes de salvar.
8. A recomendação de revisão é uma sugestão explicável e não uma obrigação.

### Limites deste corte

Este slice apenas consolida as decisões e fontes que já existem para orientar os próximos casos de uso. Ainda não cria simuladores de cenário, regras compostas novas, projeção de conclusão, lentes configuráveis ou visualizações adicionais. Essas capacidades serão fatiadas depois em incrementos próprios do Moto; sincronização, IA, OCR, integrações, plugins e outras capacidades `FUTURE` permanecem fora do MVP5.

## Evidência

- `packages/pkg-domain/src/study/calculate-academic-metrics.function.ts`
- `packages/app/src/features/academic/academic-discipline-calculation-details.component.tsx`
- `packages/app/src/features/study-plans/calculate-moved-study-plan-step-order.function.ts`
- `packages/app/src/features/reviews/get-review-retention-impact.function.ts`
- `packages/app/src/features/performance/get-performance-summary.function.ts`
- `packages/app/src/features/performance/get-performance-confidence-band.function.ts`
