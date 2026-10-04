import type { StudyRecord } from "@guesant/saberes-application";

export function findStudyPlanStateRecord(
  progress: StudyRecord[],
  contentKey: string,
): StudyRecord | undefined {
  return progress.find((item) => item.contentKey === contentKey);
}
