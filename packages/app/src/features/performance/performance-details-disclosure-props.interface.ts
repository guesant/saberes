import type { PerformanceActionDecision } from "./performance-action-decision.interface";
import type { PerformanceFilter } from "./performance-filter.interface";
import type { PerformanceReadyViewData } from "./performance-ready-view-data.interface";

export interface PerformanceDetailsDisclosureProps {
  filter: PerformanceFilter;
  viewData: PerformanceReadyViewData;
  onChangePeriod(period: PerformanceFilter["period"]): void;

  onChangeScope(scope: PerformanceFilter["scope"]): void;

  onDecision(decision: PerformanceActionDecision): Promise<void>;
}
