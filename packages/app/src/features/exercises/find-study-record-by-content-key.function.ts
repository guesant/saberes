import type { StudyRecord } from "@guesant/saberes-application";

export function findStudyRecordByContentKey(
  records: StudyRecord[],
  contentKey: string,
): StudyRecord | undefined {
  return records.find((record) => {
    return record.contentKey === contentKey;
  });
}
