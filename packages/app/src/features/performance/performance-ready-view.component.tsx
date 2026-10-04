import { UIContentGroup } from "@guesant/saberes-ui";
import { useState } from "react";
import { getPerformanceReadyViewData } from "./get-performance-ready-view-data.function";
import { PerformanceAssessmentSummary } from "./performance-assessment-summary.component";
import { PerformanceDiagnosisList } from "./performance-diagnosis-list.component";
import { PerformanceFilters } from "./performance-filters.component";
import { PerformanceNextAction } from "./performance-next-action.component";
import { PerformanceReadyViewHeader } from "./performance-ready-view-header.component";
import { PerformanceSummaryGrid } from "./performance-summary-grid.component";
import { PerformanceTopicList } from "./performance-topic-list.component";
import type { PerformanceActionDecision } from "./performance-action-decision.interface";
import type { PerformanceFilter } from "./performance-filter.interface";
import type { MyStudyReadModel } from "../my-study/my-study-read-model.interface";
import type { DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";

export type PerformanceReadyViewProps = {
  actionForDiagnosis(code: DiagnosisCode): PedagogicalAction;

  data: MyStudyReadModel;
  saveActionDecision(decision: PerformanceActionDecision): Promise<void>;
};

export function PerformanceReadyView(props: PerformanceReadyViewProps) {
  const [filter, setFilter] = useState<PerformanceFilter>({ period: "all", scope: "all" });

  const viewData = getPerformanceReadyViewData({
    actionForDiagnosis: props.actionForDiagnosis,
    data: props.data,
    filter,
    now: new Date(),
  });

  return (
    <UIContentGroup variant="section">
      <PerformanceReadyViewHeader />
      <PerformanceFilters
        courseLabel={viewData.course?.title}
        filter={filter}
        onChangePeriod={(period) => { return setFilter((current) => { return { ...current, period }; }); }}
        onChangeScope={(scope) => { return setFilter((current) => { return { ...current, scope }; }); }}
        planLabel={viewData.plan?.title}
      />
      <PerformanceSummaryGrid summary={viewData.summary} />
      <PerformanceAssessmentSummary summary={viewData.assessmentSummary} />
      <PerformanceTopicList stats={viewData.topicStats} />
      <PerformanceDiagnosisList
        onDecision={props.saveActionDecision}
        stats={viewData.diagnosisStats}
      />
      <PerformanceNextAction
        hasAttempts={viewData.filteredData.attempts.length > 0}
        hasErrors={viewData.hasErrors}
      />
    </UIContentGroup>
  );
}
