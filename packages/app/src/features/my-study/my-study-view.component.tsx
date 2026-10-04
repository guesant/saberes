import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { MyStudyReadyView } from "./my-study-ready-view.component";
import { useMyStudyViewModel } from "./my-study.view-model";

export function MyStudyView() {
  const { t } = useTranslation();

  const viewModel = useMyStudyViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingContent")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  return <MyStudyReadyView viewModel={viewModel} />;
}
