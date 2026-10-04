import type { StudyPlanReadModel } from "@guesant/saberes-application";

export function getStudyPlanContentSteps(
  data: StudyPlanReadModel | undefined,
): Array<Record<string, unknown>> {
  return data?.steps ?? [];
}
