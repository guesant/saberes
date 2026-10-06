import type { Attempt } from "./models/attempt.type";
import type { CreateSimulationAttemptInput } from "./models/create-simulation-attempt-input.interface";

export function createSimulationAttempt(input: CreateSimulationAttemptInput): Attempt {
  const draft = input.session.simulationAnswers?.find((answer) => {
    return answer.questionKey === input.questionKey;
  });

  return {
    id: `${input.session.id}:simulation:${input.questionKey}`,
    sessionId: input.session.id,
    contentKey: String(input.data.question.occurrence_key || input.data.question.canonical_key || input.questionKey),
    questionId: String(input.data.question.occurrence_id || input.data.question.question_id || input.questionKey),
    topicIds: input.data.topics.map((topic) => { return String(topic.topic_id); }),
    answer: input.result.answer,
    isCorrect: input.result.isCorrect,
    answeredAt: draft?.answeredAt || input.completedAt,
    source: "simulation",
  };
}
