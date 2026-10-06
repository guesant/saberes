import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function PerformanceBackToSummaryAction() {
  const { t } = useTranslation();

  return (
    <UIButton component={Link} to="/desempenho" variant="text">
      {t("performance.backToSummary")}
    </UIButton>
  );
}
