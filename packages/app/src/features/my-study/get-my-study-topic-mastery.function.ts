import type { StudyRecord } from "@guesant/saberes-application";

export function getMyStudyTopicMastery(records: StudyRecord[] | undefined): StudyRecord[] {
  return records || [];
}
