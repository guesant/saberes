import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { MyStudyProgressError } from "../my-study/my-study-progress-error.component";
import { useMyStudyViewModel } from "../my-study/my-study.view-model";
import { PerformanceReadyView } from "./performance-ready-view.component";

export function PerformanceView() {
  const { t } = useTranslation();

  const viewModel = useMyStudyViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingContent")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  return (
    <>
      {viewModel.progressError ? (
        <MyStudyProgressError
          error={viewModel.progressError}
          label={t("errors.progressLoad")}
          onRetry={viewModel.reload}
        />
      ) : null}
      <PerformanceReadyView data={viewModel.data} />
    </>
  );
}
