import { gradeQuestionAnswer } from "@guesant/saberes-domain";
import type { ScoreSimulationQuestionInput } from "./models/score-simulation-question-input.interface";
import type { SimulationQuestionResult } from "./models/simulation-question-result.interface";

export function computeSimulationQuestionScore(input: ScoreSimulationQuestionInput): SimulationQuestionResult {
  const answer = input.session.simulationAnswers?.find((draft) => {
    return draft.questionKey === input.questionKey;
  })?.value || "";

  const expectedAnswer = String(input.data.question.correct_answer || "");

  const automaticallyGradable = Boolean(input.data.question.is_automatically_gradable) && Boolean(expectedAnswer);

  const isCorrect = gradeQuestionAnswer({
    answer,
    automaticallyGradable,
    expectedAnswer,
    questionType: String(input.data.question.type || "short_text"),
  });

  const maxPoints = input.session.questionWeights?.find((weight) => {
    return weight.questionKey === input.questionKey;
  })?.maxPoints ?? 1;

  return {
    questionKey: input.questionKey,
    answer,
    expectedAnswer,
    isCorrect,
    maxPoints,
    earnedPoints: isCorrect === null ? null : Number(isCorrect) * maxPoints,
  };
}
