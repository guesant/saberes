import { UIButton, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function AssessmentDiscoveryEmpty() {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography color="text.secondary">{t("discovery.assessmentsEmpty")}</UITypography>
      <UIButton component={Link} to="/catalogo" variant="outlined">{t("discovery.browseCatalog")}</UIButton>
    </UIContentGroup>
  );
}
