import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { useCatalogViewModel } from "../catalog/catalog.view-model";
import { AssessmentDiscoveryReadyView } from "./assessment-discovery-ready-view.component";

export function AssessmentDiscoveryView() {
  const { t } = useTranslation();

  const viewModel = useCatalogViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingCatalog")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} label={t("errors.catalogLoad")} onRetry={viewModel.reload} />;
  }

  return <AssessmentDiscoveryReadyView viewModel={viewModel} />;
}
