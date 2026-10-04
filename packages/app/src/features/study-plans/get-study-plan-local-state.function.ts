import { createStudyPlanLocalState } from "./create-study-plan-local-state.function";
import { findStudyPlanStateRecord } from "./find-study-plan-state-record.function";
import { getStudyPlanStateContentKey } from "./get-study-plan-state-content-key.function";
import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { StudyRecord } from "@guesant/saberes-application";

export function getStudyPlanLocalState(
  progress: StudyRecord[],
  slug: string | undefined,
): StudyPlanLocalState {
  const contentKey = getStudyPlanStateContentKey(slug);

  const record = findStudyPlanStateRecord(progress, contentKey);

  return createStudyPlanLocalState(record);
}
