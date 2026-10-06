export function getCourseItemHref(item: Record<string, unknown>): string | null {
  if (item.item_type === "review") {
    return "/revisoes";
  }

  if (item.lesson_id) {
    const lessonId = item.lesson_slug || item.lesson_id;

    return `/licoes/${encodeURIComponent(String(lessonId))}`;
  }

  if (item.assessment_set_id) {
    return `/avaliacoes/${encodeURIComponent(String(item.assessment_set_id))}`;
  }

  if (item.question_occurrence_id) {
    return `/questoes/${encodeURIComponent(String(item.question_occurrence_id))}`;
  }

  if (item.question_id) {
    return `/questoes/${encodeURIComponent(String(item.question_id))}`;
  }

  if (item.item_type === "practice") {
    return "/catalogo?modo=praticar";
  }

  return null;
}
