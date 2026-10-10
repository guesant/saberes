import type { Attempt } from "./models/attempt.type";
import type { CreateSimulationAttemptInput } from "./models/create-simulation-attempt-input.interface";

export function createSimulationAttempt(input: CreateSimulationAttemptInput): Attempt {
  const draft = input.session.simulationAnswers?.find((answer) => {
    return answer.questionKey === input.questionKey;
  });

  const context = input.session.questionContexts?.[input.questionKey];

  const answerKeyVersion = context?.answerKeyVersion ?? input.data.question.answer_key_version;

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
    ...context,
    canonicalQuestionId: context?.canonicalQuestionId ?? input.data.question.question_id,
    targetEditionKey: context?.targetEditionKey ?? input.session.targetEditionKey ?? input.data.question.target_edition_slug,
    targetStageKey: context?.targetStageKey ?? input.session.targetStageKey ?? input.data.question.target_stage_slug,
    sourceEditionKey: context?.sourceEditionKey ?? input.data.question.source_edition_slug,
    sourceStageKey: context?.sourceStageKey ?? input.data.question.source_stage_slug,
    questionContentVersion: context?.questionContentVersion ?? input.data.question.editorial_version,
    answerKeyVersion: answerKeyVersion === null || answerKeyVersion === undefined ? undefined : String(answerKeyVersion),
    blueprintId: context?.blueprintId ?? input.session.blueprintId,
    blueprintVersion: context?.blueprintVersion ?? input.session.blueprintVersion,
    subjectIds: input.data.subjectIds || [],
    skillIds: input.data.skills?.map((skill) => {return skill.id;}) || [],
    hintIdsUsed: draft?.hintIdsUsed || [],
    studyMode: "simulation",
    assisted: Boolean(draft?.hintIdsUsed?.length),
  };
}
