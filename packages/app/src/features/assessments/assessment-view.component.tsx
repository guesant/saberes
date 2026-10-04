import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { AssessmentReadyView } from "./assessment-ready-view.component";
import { useAssessmentViewModel } from "./assessment.view-model";

export function AssessmentView() {
  const { t } = useTranslation();

  const routeParams = useParams<{ assessmentId: string }>();

  const viewModel = useAssessmentViewModel(routeParams.assessmentId);

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingAssessment")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  if (!viewModel.data) {
    return <ContentNotFoundState label={t("assessment.notFound")} />;
  }

  return (
    <AssessmentReadyView
      assessmentKey={`assessment:${routeParams.assessmentId || ""}`}
      data={viewModel.data}
      onReloadProgress={viewModel.reload}
      progress={viewModel.progress}
      progressError={viewModel.progressError}
    />
  );
}
