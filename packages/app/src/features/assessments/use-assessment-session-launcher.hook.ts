import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getAssessmentPracticeQuestionKeys } from "./get-assessment-practice-question-keys.function";
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
      let sessionQuestionKeys = questionKeys;

      if (mode === "practice") {
        sessionQuestionKeys = getAssessmentPracticeQuestionKeys(props.assessment, questionKeys);
      }

      await startAssessmentSession({ ...props, questionKeys: sessionQuestionKeys, services, navigate, mode });
    } catch (cause) {
      let message = "Não foi possível iniciar a sessão.";

      if (cause instanceof Error) {
        message = cause.message;
      }

      setError(message);
    } finally {
      setPending(false);
    }
  };

  return { questionKeys, pending, error, startSession };
}
