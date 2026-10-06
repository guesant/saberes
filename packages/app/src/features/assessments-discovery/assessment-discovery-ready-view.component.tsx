import { UIContentGroup, UIFocusedContent, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CatalogActions } from "../catalog/catalog-actions.component";
import { AssessmentDiscoveryResults } from "./assessment-discovery-results.component";
import { getCatalogAssessments } from "./get-catalog-assessments.function";
import type { CatalogViewModel } from "../catalog/catalog-view-model.type";

export interface AssessmentDiscoveryReadyViewProps {
  viewModel: CatalogViewModel;
}

export function AssessmentDiscoveryReadyView(props: AssessmentDiscoveryReadyViewProps) {
  const { t } = useTranslation();

  const assessments = getCatalogAssessments(props.viewModel.data?.content || []);

  return (
    <UIFocusedContent><UIContentGroup variant="section">
      <UITypography variant="h3">{t("discovery.assessments")}</UITypography>
      <UITypography color="text.secondary">{t("discovery.assessmentsDescription")}</UITypography>
      <CatalogActions viewModel={props.viewModel} />
      <AssessmentDiscoveryResults items={assessments} />
    </UIContentGroup></UIFocusedContent>
  );
}
