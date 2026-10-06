import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getAssessmentQuestionKeys } from "./get-assessment-question-keys.function";
import { startAssessmentSession } from "./start-assessment-session.function";
import type { AssessmentSessionLauncherProps } from "./assessment-session-launcher-props.interface";
import type { AssessmentSessionLauncherViewModel } from "./assessment-session-launcher-view-model.interface";

export function useAssessmentSessionLauncher(
  props: AssessmentSessionLauncherProps,
): AssessmentSessionLauncherViewModel {
  const navigate = useNavigate();

  const services = useAppServices();

  const questionKeys = getAssessmentQuestionKeys(props.items);

  const [pending, setPending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const startSession = async (mode: "practice" | "simulation"): Promise<void> => {
    setPending(true);

    setError(null);

    try {
      await startAssessmentSession({ ...props, questionKeys, services, navigate, mode });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível iniciar a sessão.");
    } finally {
      setPending(false);
    }
  };

  return { questionKeys, pending, error, startSession };
}
