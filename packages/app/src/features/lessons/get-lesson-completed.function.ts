import type { StudyRecord } from "@guesant/saberes-application";

export type GetLessonCompletedInput = {
  records: StudyRecord[] | undefined;
  contentKey: string;
};

export function getLessonCompleted(input: GetLessonCompletedInput): boolean {
  return Boolean(
    input.records?.some(
      (record) => record.contentKey === input.contentKey && record.completed === true,
    ),
  );
}
