import type { AssessmentQuestionKeyItem } from "./assessment-question-key-item.type";

export function getAssessmentQuestionKeys(items: AssessmentQuestionKeyItem[]): string[] {
  const keys = items.map((item) => {
    if (item.questionKey) {
      return item.questionKey;
    }

    if (item.question_slug) {
      return `exercise:${item.question_slug}`;
    }

    if (item.question_occurrence_id) {
      return `question:${item.question_occurrence_id}`;
    }

    return "";
  })
    .filter(Boolean);

  return [...new Set(keys)];
}
