import { computeSimulationQuestionScore } from "./compute-simulation-question-score.function";
import { createSimulationAttempt } from "./create-simulation-attempt.function";
import type { PrepareSimulationCompletionInput } from "./models/prepare-simulation-completion-input.interface";
import type { PreparedSimulationCompletion } from "./models/prepared-simulation-completion.interface";

export async function createSimulationCompletion(
  input: PrepareSimulationCompletionInput,
): Promise<PreparedSimulationCompletion> {
  const questionData = await Promise.all(input.questionKeys.map(async (questionKey) => {
    const data = await input.getQuestion.execute(questionKey);

    if (!data) {
      throw new Error("Uma questão do simulado está indisponível. Tente concluir novamente.");
    }

    return { questionKey, data };
  }));

  const results = questionData.map(({ questionKey, data }) => {
    return computeSimulationQuestionScore({ session: input.session, questionKey, data });
  });

  const attempts = questionData.flatMap(({ questionKey, data }, index) => {
    const result = results[index];

    if (!result || !result.answer.trim()) {
      return [];
    }

    return [createSimulationAttempt({
      session: input.session,
      questionKey,
      data,
      result,
      completedAt: input.completedAt,
    })];
  });

  return { attempts, results };
}
