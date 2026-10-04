import { getStudyPlanDailyMinutes } from "./get-study-plan-daily-minutes.function";
import { getStudyPlanOrderedStepIds } from "./get-study-plan-ordered-step-ids.function";
import { getStudyPlanStateContentKey } from "./get-study-plan-state-content-key.function";
import { getStudyPlanStatus } from "./get-study-plan-status.function";
import { getStudyPlanTargetDate } from "./get-study-plan-target-date.function";
import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { StudyRecord } from "@guesant/saberes-application";

export function getStudyPlanLocalState(
  progress: StudyRecord[],
  slug: string | undefined,
): StudyPlanLocalState {
  const contentKey = getStudyPlanStateContentKey(slug);

  const record = progress.find((item) => item.contentKey === contentKey);

  return {
    status: getStudyPlanStatus(record?.status),
    targetDate: getStudyPlanTargetDate(record?.targetDate),
    dailyMinutes: getStudyPlanDailyMinutes(record?.dailyMinutes),
    orderedStepIds: getStudyPlanOrderedStepIds(record?.orderedStepIds),
  };
}
