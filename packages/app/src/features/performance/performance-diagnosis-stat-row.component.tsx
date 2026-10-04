import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getPerformanceActionPath } from "./get-performance-action-path.function";
import type { PerformanceDiagnosisStatRowProps } from "./performance-diagnosis-stat-row-props.type";

export function PerformanceDiagnosisStatRow(props: PerformanceDiagnosisStatRowProps) {
  const { t } = useTranslation();

  const actionLabel = t(`performance.actions.${props.stat.action}`);

  return (
    <UIContentGroup variant="tight">
      <UITypography color="text.secondary">
        {t("performance.diagnosisRow", {
          action: actionLabel,
          attempts: props.stat.attempts,
          diagnosis: t(`exercise.diagnosis.${props.stat.code}`),
        })}
      </UITypography>
      <UITypography color="text.secondary" variant="body2">
        {t(`performance.actionDescriptions.${props.stat.action}`)}
      </UITypography>
      <UIInlineActions>
        <UIButton component={Link} size="small" to={getPerformanceActionPath(props.stat.action)}>
          {t("performance.openAction")}
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}
