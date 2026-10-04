import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { GoalsReadyView } from "./goals-ready-view.component";
import { useStudyGoalsViewModel } from "./study-goals.view-model";

export function GoalsView() {
  const { t } = useTranslation();

  const viewModel = useStudyGoalsViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("goals.loading")} />;
  }

  if (viewModel.state === "error") {
    return (
      <ContentErrorState
        error={viewModel.error}
        label={t("goals.loadError")}
        onRetry={viewModel.reload}
      />
    );
  }

  return <GoalsReadyView viewModel={viewModel} />;
}
