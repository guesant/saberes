import { useTranslation } from "react-i18next";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { SimulationSessionActiveView } from "./simulation-session-active-view.component";
import { SimulationSessionCompletedView } from "./simulation-session-completed-view.component";
import type { SimulationSessionModeViewProps } from "./simulation-session-mode-view-props.interface";

export function SimulationSessionModeView(props: SimulationSessionModeViewProps) {
  const { t } = useTranslation();

  const {session} = props.viewModel;

  if (session?.status === "completed") {
    return <SimulationSessionCompletedView results={session.simulationResults} />;
  }

  if (!props.viewModel.question) {
    return <ContentNotFoundState label={t("exercise.notFound")} />;
  }

  return <SimulationSessionActiveView question={props.viewModel.question} viewModel={props.viewModel} />;
}
