import { getStudyPlanDailyMinutes } from "./get-study-plan-daily-minutes.function";
import { getStudyPlanOrderedStepIds } from "./get-study-plan-ordered-step-ids.function";
import { getStudyPlanSkippedStepIds } from "./get-study-plan-skipped-step-ids.function";
import { getStudyPlanStartDate } from "./get-study-plan-start-date.function";
import { getStudyPlanStatus } from "./get-study-plan-status.function";
import { getStudyPlanTargetDate } from "./get-study-plan-target-date.function";
import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { StudyRecord } from "@guesant/saberes-application";

export function createStudyPlanLocalState(record: StudyRecord | undefined): StudyPlanLocalState {
  const data: StudyRecord = record || {};

  return {
    status: getStudyPlanStatus(data.status),
    startDate: getStudyPlanStartDate(data.startDate),
    targetDate: getStudyPlanTargetDate(data.targetDate),
    dailyMinutes: getStudyPlanDailyMinutes(data.dailyMinutes),
    orderedStepIds: getStudyPlanOrderedStepIds(data.orderedStepIds),
    skippedStepIds: getStudyPlanSkippedStepIds(data.skippedStepIds),
  };
}
