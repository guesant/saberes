import type { StudyPlanReadModel } from "@guesant/saberes-application";

export function getStudyPlanDescription(data: StudyPlanReadModel) {
  return String(data.plan?.objective || data.plan?.description || "");
}
