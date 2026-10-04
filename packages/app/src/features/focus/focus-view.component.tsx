import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { FocusReadyView } from "./focus-ready-view.component";
import { useFocusViewModel } from "./focus.view-model";

export function FocusView() {
  const { t } = useTranslation();

  const viewModel = useFocusViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("focus.loading")} />;
  }

  if (viewModel.state === "error") {
    return (
      <ContentErrorState
        error={viewModel.error}
        label={t("focus.loadError")}
        onRetry={viewModel.reload}
      />
    );
  }

  return <FocusReadyView viewModel={viewModel} />;
}
