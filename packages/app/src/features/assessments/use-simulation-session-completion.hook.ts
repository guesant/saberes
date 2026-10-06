import { useRef, useState } from "react";
import { completeSimulationSession } from "./complete-simulation-session.function";
import { useSimulationSessionAutoCompletion } from "./use-simulation-session-auto-completion.hook";
import { useSimulationSessionFinishConfirmation } from "./use-simulation-session-finish-confirmation.hook";
import type { SimulationSessionCompletionInput } from "./simulation-session-completion-input.interface";
import type { SimulationSessionCompletionViewModel } from "./simulation-session-completion-view-model.interface";

export function useSimulationSessionCompletion(
  input: SimulationSessionCompletionInput,
): SimulationSessionCompletionViewModel {
  const [finishing, setFinishing] = useState(false);

  const confirmation = useSimulationSessionFinishConfirmation();

  const finishingRef = useRef(false);

  const completeSession = async (): Promise<void> => {
    if (finishingRef.current) {
      return;
    }

    finishingRef.current = true;

    setFinishing(true);

    try {
      await completeSimulationSession(input);

      confirmation.cancelFinish();
    } catch (cause) {
      input.updater.setError(cause instanceof Error ? cause.message : "Não foi possível concluir. Tente novamente.");
    } finally {
      finishingRef.current = false;

      setFinishing(false);
    }
  };

  useSimulationSessionAutoCompletion({
    session: input.session,
    remainingSeconds: input.remainingSeconds,
    completeSession,
  });

  return {
    finishing,
    confirmed: confirmation.confirmed,
    finish: completeSession,
    requestFinish: confirmation.requestFinish,
    cancelFinish: confirmation.cancelFinish,
  };
}
