export function getAssessmentQuestionKeys(items: Array<Record<string, unknown>>): string[] {
  return items
    .map((item) => {
      return String(item.question_occurrence_id || item.question_id || "");
    })
    .filter(Boolean)
    .map((questionId) => {
      return `question:${questionId}`;
    });
}
