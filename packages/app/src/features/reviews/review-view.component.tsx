import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ReviewReadyView } from "./review-ready-view.component";
import { useReviewViewModel } from "./review.view-model";

export function ReviewView() {
  const { t } = useTranslation();

  const viewModel = useReviewViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingContent")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  return <ReviewReadyView viewModel={viewModel} />;
}
