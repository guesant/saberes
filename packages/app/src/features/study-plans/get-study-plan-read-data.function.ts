import type { StudyPlanReadModel } from "@guesant/saberes-application";

export function getStudyPlanReadData(
  data: StudyPlanReadModel | undefined,
): StudyPlanReadModel | null {
  return data ?? null;
}
