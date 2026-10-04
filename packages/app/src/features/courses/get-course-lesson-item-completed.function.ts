import type { StudyRecord } from "@guesant/saberes-application";

export interface GetCourseLessonItemCompletedInput {
  item: Record<string, unknown>;
  lessonProgress: StudyRecord[] | undefined;
}

export function getCourseLessonItemCompleted(input: GetCourseLessonItemCompletedInput): boolean {
  const lessonKey = `lesson:${String(input.item.lesson_slug || input.item.lesson_id)}`;

  return Boolean(
    input.lessonProgress?.some((progress) => {
      return progress.contentKey === lessonKey && progress.completed === true;
    }),
  );
}
