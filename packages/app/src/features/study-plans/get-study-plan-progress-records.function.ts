import type { StudyRecord } from "@guesant/saberes-application";

export function getStudyPlanProgressRecords(progress: StudyRecord[] | undefined): StudyRecord[] {
  return progress ?? [];
}
