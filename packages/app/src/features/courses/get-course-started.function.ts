import type { StudyRecord } from "@guesant/saberes-application";

export type GetCourseStartedInput = {
  records: StudyRecord[] | undefined;
  slug: string | undefined;
};

export function getCourseStarted(input: GetCourseStartedInput): boolean {
  const contentKey = `course:${String(input.slug)}`;

  return Boolean(input.records?.some((record) => record.contentKey === contentKey));
}
