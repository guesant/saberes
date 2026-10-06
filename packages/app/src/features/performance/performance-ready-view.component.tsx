import { UIContentGroup } from "@guesant/saberes-ui";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getPerformanceReadyViewData } from "./get-performance-ready-view-data.function";
import { PerformanceDetailsLink } from "./performance-details-link.component";
import { PerformanceDetailsPage } from "./performance-details-page.component";
import { PerformanceNextAction } from "./performance-next-action.component";
import { PerformanceReadyViewHeader } from "./performance-ready-view-header.component";
import { PerformanceSummaryGrid } from "./performance-summary-grid.component";
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
  const location = useLocation();

  const [filter, setFilter] = useState<PerformanceFilter>({ period: "all", scope: "all" });

  const viewData = getPerformanceReadyViewData({
    actionForDiagnosis: props.actionForDiagnosis,
    data: props.data,
    filter,
    now: new Date(),
  });

  if (location.pathname.endsWith("/detalhes")) {
    return (
      <PerformanceDetailsPage
        filter={filter}
        viewData={viewData}
        onChangePeriod={(period) => { return setFilter((current) => { return { ...current, period }; }); }}
        onChangeScope={(scope) => { return setFilter((current) => { return { ...current, scope }; }); }}
        onDecision={props.saveActionDecision}
      />
    );
  }

  return (
    <UIContentGroup variant="section">
      <PerformanceReadyViewHeader />
      <PerformanceSummaryGrid summary={viewData.summary} />
      <PerformanceNextAction
        hasAttempts={viewData.filteredData.attempts.length > 0}
        hasErrors={viewData.hasErrors}
      />
      <PerformanceDetailsLink />
    </UIContentGroup>
  );
}
