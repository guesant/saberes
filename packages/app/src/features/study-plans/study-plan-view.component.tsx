import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { StudyPlanReadyView } from "./study-plan-ready-view.component";
import { useStudyPlanViewModel } from "./study-plan.view-model";

export function StudyPlanView() {
  const { t } = useTranslation();

  const { slug } = useParams();

  const viewModel = useStudyPlanViewModel(slug);

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("common.loadingPlan")} />;
  }

  if (viewModel.state === "error") {
    return <ContentErrorState error={viewModel.error} onRetry={viewModel.reload} />;
  }

  if (!viewModel.data?.plan) {
    return <ContentNotFoundState label={t("plan.notFound")} />;
  }

  return (
    <StudyPlanReadyView
      data={viewModel.data}
      steps={viewModel.steps}
      progress={viewModel.progress}
      onToggle={viewModel.toggleStep}
      localState={viewModel.localState}
      nextStep={viewModel.nextStep}
      onTogglePause={viewModel.togglePause}
      onStartDateChange={viewModel.updateStartDate}
      onTargetDateChange={viewModel.updateTargetDate}
      onDailyMinutesChange={viewModel.updateDailyMinutes}
      skippedStepIds={new Set(viewModel.localState.skippedStepIds)}
      onSkip={viewModel.skipStep}
      onMove={viewModel.moveStep}
    />
  );
}
