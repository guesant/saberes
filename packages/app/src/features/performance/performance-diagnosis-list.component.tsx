import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PerformanceDiagnosisContent } from "./performance-diagnosis-content.component";
import type { PerformanceActionDecision } from "./performance-action-decision.interface";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";

export type PerformanceDiagnosisListProps = {
  onDecision(decision: PerformanceActionDecision): Promise<void>;
  stats: PerformanceDiagnosisStat[];
};

export function PerformanceDiagnosisList(props: PerformanceDiagnosisListProps) {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("performance.byDiagnosis")}</UITypography>
          <PerformanceDiagnosisContent onDecision={props.onDecision} stats={props.stats} />
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
