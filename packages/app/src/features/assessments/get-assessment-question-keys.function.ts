export function getAssessmentQuestionKeys(items: Array<Record<string, unknown>>): string[] {
  return items
    .map((item) => String(item.question_occurrence_id || item.question_id || ""))
    .filter(Boolean)
    .map((questionId) => `question:${questionId}`);
}
