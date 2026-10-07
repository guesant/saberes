import { UIDiscoveryGrid, UIDiscoveryLink } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function MyStudyDiscovery() {
  const { t } = useTranslation();

  return (
    <UIDiscoveryGrid label={t("discovery.chooseActivity")}>
      <UIDiscoveryLink title={t("common.study")} description={t("discovery.studyDescription")} href="/catalogo" iconName="materials" />
      <UIDiscoveryLink title={t("common.practice")} description={t("discovery.practiceDescription")} href="/catalogo?modo=praticar" iconName="question" />
      <UIDiscoveryLink title={t("discovery.assessments")} description={t("discovery.assessmentsDescription")} href="/provas" iconName="checklist" />
    </UIDiscoveryGrid>
  );
}
