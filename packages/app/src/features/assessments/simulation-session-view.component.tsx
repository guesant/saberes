import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { SimulationSessionModeView } from "./simulation-session-mode-view.component";
import { useSimulationSessionViewModel } from "./use-simulation-session-view-model.hook";
import type { SimulationSessionViewProps } from "./simulation-session-view-props.interface";

export function SimulationSessionView(props: SimulationSessionViewProps) {
  const { t } = useTranslation();

  const viewModel = useSimulationSessionViewModel(props.sessionId);

  if (viewModel.loading) {
    return <ContentLoadingState label={t("simulator.loadingSession")} />;
  }

  if (viewModel.contentError) {
    return <ContentErrorState error={viewModel.contentError} onRetry={viewModel.reload} />;
  }

  if (!viewModel.session) {
    return <ContentNotFoundState label={t("simulator.notFound")} />;
  }

  return <SimulationSessionModeView viewModel={viewModel} />;
}
