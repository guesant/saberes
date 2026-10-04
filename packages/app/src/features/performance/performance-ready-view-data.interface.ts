import type { PerformanceAssessmentSummary } from "./performance-assessment-summary.interface";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";
import type { PerformanceFilteredData } from "./performance-filtered-data.interface";
import type { PerformanceSummary } from "./performance-summary.interface";
import type { PerformanceTopicStat } from "./performance-topic-stat.interface";
import type { CatalogCard } from "@guesant/saberes-application";

export interface PerformanceReadyViewData {
  course: CatalogCard | undefined;
  plan: CatalogCard | undefined;
  filteredData: PerformanceFilteredData;
  summary: PerformanceSummary;
  topicStats: PerformanceTopicStat[];
  assessmentSummary: PerformanceAssessmentSummary;
  diagnosisStats: PerformanceDiagnosisStat[];
  hasErrors: boolean;
}
