import { useState } from "react";
import type { LessonProgressActionState } from "./lesson-progress-action-state.interface";
import type { UseLessonProgressActionInput } from "./use-lesson-progress-action-input.interface";
import type { ActionState } from "../../types/action-state.type";

export function useLessonProgressAction(
  input: UseLessonProgressActionInput,
): LessonProgressActionState {
  const [state, setState] = useState<ActionState>("idle");

  const [error, setError] = useState<Error | null>(null);

  const save = async (completed: boolean): Promise<void> => {
    setState("saving");

    setError(null);

    try {
      await input.action(completed);

      setState("saved");
    } catch {
      const nextError = new Error("Não foi possível salvar o progresso da lição.");

      setError(nextError);

      setState("error");

      throw nextError;
    }
  };

  return { error, save, state };
}
