import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { PersonalWorkspaceReadyView } from "./personal-workspace-ready-view.component";
import { usePersonalWorkspaceViewModel } from "./personal-workspace.view-model";

export function PersonalWorkspaceView() {
  const { t } = useTranslation();

  const viewModel = usePersonalWorkspaceViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("personal.loading")} />;
  }

  if (viewModel.state === "error") {
    return (
      <ContentErrorState
        error={viewModel.error}
        label={t("personal.loadError")}
        onRetry={viewModel.reload}
      />
    );
  }

  return <PersonalWorkspaceReadyView viewModel={viewModel} />;
}
