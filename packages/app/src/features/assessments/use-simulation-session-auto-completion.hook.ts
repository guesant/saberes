import { useEffect, useRef } from "react";
import type { SimulationSessionAutoCompletionInput } from "./simulation-session-auto-completion-input.interface";

export function useSimulationSessionAutoCompletion(input: SimulationSessionAutoCompletionInput): void {
  const automaticCompletion = useRef(false);

  useEffect(() => {
    const sessionIsActive = input.session?.status === "active";

    if (input.remainingSeconds === 0 && sessionIsActive && !automaticCompletion.current) {
      automaticCompletion.current = true;

      input.completeSession();
    }
  }, [input.completeSession, input.remainingSeconds, input.session?.status]);
}
