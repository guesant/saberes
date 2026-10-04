export function getCourseTrackableItems(
  items: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return items.filter((item) =>
    Boolean(item.lesson_id || item.question_occurrence_id || item.assessment_set_id),
  );
}
