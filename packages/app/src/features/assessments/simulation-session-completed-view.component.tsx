import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { SimulationResultItem } from "./simulation-result-item.component";
import type { SimulationSessionCompletedViewProps } from "./simulation-session-completed-view-props.interface";

export function SimulationSessionCompletedView(props: SimulationSessionCompletedViewProps) {
  const { t } = useTranslation();

  const results = props.results || [];

  const earned = results.reduce((total, result) => { return total + (result.earnedPoints ?? 0); }, 0);

  const maximum = results.reduce((total, result) => { return total + result.maxPoints; }, 0);

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="content">
        <UITypography variant="overline">{t("simulator.eyebrow")}</UITypography>
        <UITypography variant="h1">{t("simulator.completed")}</UITypography>
        <UITypography>{t("simulator.score", { earned, maximum })}</UITypography>
      </UIContentGroup>
      <UIList disablePadding>
        {results.map((result, index) => {
          return <SimulationResultItem key={result.questionKey} result={result} ordinal={index + 1} total={results.length} />;
        })}
      </UIList>
    </UIContentGroup>
  );
}
