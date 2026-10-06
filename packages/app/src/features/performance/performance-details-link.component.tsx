import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function PerformanceDetailsLink() {
  const { t } = useTranslation();

  return (
    <UIButton component={Link} to="/desempenho/detalhes" variant="outlined">
      {t("performance.moreDetails")}
    </UIButton>
  );
}
