export function getCourseTrackableItems(
  items: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return items.filter((item) => {
    return Boolean(
      item.lesson_id || item.question_occurrence_id || item.question_id || item.assessment_set_id,
    );
  });
}
