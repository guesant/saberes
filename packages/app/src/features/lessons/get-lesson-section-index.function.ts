import type { StudyRecord } from "@guesant/saberes-application";

export type GetLessonSectionIndexInput = {
  records: StudyRecord[] | undefined;
  contentKey: string;
};

export function getLessonSectionIndex(input: GetLessonSectionIndexInput): number | undefined {
  const record = input.records?.find((item) => item.contentKey === input.contentKey);

  const sectionIndex = Number(record?.sectionIndex);

  if (!Number.isInteger(sectionIndex) || sectionIndex < 0) {
    return undefined;
  }

  return sectionIndex;
}
