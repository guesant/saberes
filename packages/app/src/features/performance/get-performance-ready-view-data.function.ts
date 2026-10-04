import { getPerformanceAssessmentSummary } from "./get-performance-assessment-summary.function";
import { getPerformanceDiagnosisStats } from "./get-performance-diagnosis-stats.function";
import { getPerformanceFilteredData } from "./get-performance-filtered-data.function";
import { getPerformanceReadyViewFilter } from "./get-performance-ready-view-filter.function";
import { getPerformanceSummary } from "./get-performance-summary.function";
import { getPerformanceTopicStats } from "./get-performance-topic-stats.function";
import type { PerformanceReadyViewDataInput } from "./performance-ready-view-data-input.interface";
import type { PerformanceReadyViewData } from "./performance-ready-view-data.interface";

export function getPerformanceReadyViewData(
  input: PerformanceReadyViewDataInput,
): PerformanceReadyViewData {
  const course = input.data.catalog.courses[0];

  const plan = input.data.catalog.plans[0];

  const filter = getPerformanceReadyViewFilter({ course, filter: input.filter, plan });

  const filteredData = getPerformanceFilteredData({
    attempts: input.data.attempts,
    filter,
    now: input.now,
    sessions: input.data.sessions,
  });

  return {
    assessmentSummary: getPerformanceAssessmentSummary(filteredData),
    course,
    diagnosisStats: getPerformanceDiagnosisStats({
      actionForDiagnosis: input.actionForDiagnosis,
      attempts: filteredData.attempts,
      now: input.now,
    }),
    filteredData,
    hasErrors: filteredData.attempts.some((attempt) => attempt.isCorrect === false),
    plan,
    summary: getPerformanceSummary({
      attempts: filteredData.attempts,
      filter,
      now: input.now,
      sessions: filteredData.sessions,
      topicMastery: input.data.topicMastery,
    }),
    topicStats: getPerformanceTopicStats(filteredData.attempts),
  };
}
