import { getAssessmentQuestionAttempts } from "./get-assessment-question-attempts.function";
import type { AssessmentProgress } from "./assessment-progress.interface";
import type { GetAssessmentProgressInput } from "./get-assessment-progress-input.type";
import type { Attempt } from "@guesant/saberes-application";

export function getAssessmentProgress(input: GetAssessmentProgressInput): AssessmentProgress {
  const questionIds = new Set(
    input.items
      .map((item) => { return item.question_occurrence_id; })
      .filter((questionId) => { return questionId !== undefined && questionId !== null; })
      .map((questionId) => { return String(questionId); }),
  );

  const attempts = getAssessmentQuestionAttempts(input.attempts, questionIds);

  const latestAttempts = new Map<string, Attempt>();

  attempts.forEach((attempt) => {
    latestAttempts.set(String(attempt.questionId), attempt);
  });

  const answeredIds = new Set(latestAttempts.keys());

  const correctIds = new Set(
    Array.from(latestAttempts.values())
      .filter((attempt) => { return attempt.isCorrect === true; })
      .map((attempt) => { return String(attempt.questionId); }),
  );

  const totalItems = questionIds.size;

  return {
    answeredItems: answeredIds.size,
    correctItems: correctIds.size,
    percentage: totalItems ? Math.round((answeredIds.size / totalItems) * 100) : 0,
    totalItems,
  };
}
