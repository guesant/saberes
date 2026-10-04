import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { AcademicReadyView } from "./academic-ready-view.component";
import { useAcademicViewModel } from "./academic.view-model";

export function AcademicView() {
  const { t } = useTranslation();

  const viewModel = useAcademicViewModel();

  if (viewModel.state === "loading") {
    return <ContentLoadingState label={t("academic.loading")} />;
  }

  if (viewModel.state === "error") {
    return (
      <ContentErrorState
        error={viewModel.error}
        label={t("academic.loadError")}
        onRetry={viewModel.reload}
      />
    );
  }

  return <AcademicReadyView viewModel={viewModel} />;
}
