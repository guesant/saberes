import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { PreferencesReadyView } from "./preferences-ready-view.component";
import { usePreferencesViewModel } from "./preferences.view-model";

export function PreferencesView() {
  const { t } = useTranslation();

  const viewModel = usePreferencesViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("preferences.loading")} />;
  }

  if (viewModel.state === "error") {
    return (
      <ContentErrorState
        error={viewModel.error}
        label={t("preferences.loadError")}
        onRetry={viewModel.reload}
      />
    );
  }

  return <PreferencesReadyView viewModel={viewModel} />;
}
