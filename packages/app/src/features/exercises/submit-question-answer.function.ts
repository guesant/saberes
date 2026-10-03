import type { ApplicationServices, QuestionReadModel } from "@guesant/saberes-application";

export type SubmitQuestionAnswerInput = {
  services: ApplicationServices;
  data: QuestionReadModel;
  answer: string;
};

export async function submitQuestionAnswer(
  input: SubmitQuestionAnswerInput,
): Promise<boolean | null> {
  const { data, answer, services } = input;

  const { question } = data;

  const expected = String(question.correct_answer || "").toUpperCase();

  const isGradable = Boolean(question.is_automatically_gradable);

  let correct: boolean | null = null;

  if (isGradable) {
    correct = answer.toUpperCase() === expected;
  }

  await services.exercises.recordAttempt.execute({
    contentKey: String(question.occurrence_key || `question:${question.occurrence_id}`),
    questionId: String(question.occurrence_id),
    answer,
    isCorrect: correct,
    topicIds: data.topics.map((topic) => String(topic.topic_id)),
  });

  return correct;
}
