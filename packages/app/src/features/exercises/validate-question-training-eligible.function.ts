import type { QuestionReadModel } from "@guesant/saberes-application";

export function validateQuestionTrainingEligible(data: QuestionReadModel): void {
  if (data.question.training_eligible === false) {
    throw new Error("Questão disponível somente para consulta: ocorrência ainda em revisão, fora dos treinos e métricas.");
  }
}
