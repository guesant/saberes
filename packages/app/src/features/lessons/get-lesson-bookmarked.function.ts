import type { StudyRecord } from "@guesant/saberes-application";

export type GetLessonBookmarkedInput = {
  records: StudyRecord[] | undefined;
  contentKey: string;
};

export function getLessonBookmarked(input: GetLessonBookmarkedInput): boolean {
  return Boolean(input.records?.some((record) => record.contentKey === input.contentKey));
}
