export function getCourseQuestionPathname(item: Record<string, unknown>): string | null {
  if (item.question_occurrence_id) {
    return `/questoes/${encodeURIComponent(String(item.question_occurrence_id))}`;
  }

  if (item.question_slug) {
    return `/exercicios/${encodeURIComponent(String(item.question_slug))}`;
  }

  return null;
}
