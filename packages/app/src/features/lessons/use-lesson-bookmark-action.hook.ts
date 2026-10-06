import { useState } from "react";
import type { LessonBookmarkActionState } from "./lesson-bookmark-action-state.interface";
import type { UseLessonBookmarkActionInput } from "./use-lesson-bookmark-action-input.interface";
import type { ActionState } from "../../types/action-state.type";

export function useLessonBookmarkAction(
  input: UseLessonBookmarkActionInput,
): LessonBookmarkActionState {
  const [state, setState] = useState<ActionState>("idle");

  const [error, setError] = useState<Error | null>(null);

  const save = async (): Promise<void> => {
    setState("saving");

    setError(null);

    try {
      await input.action();

      setState(input.isRemoval ? "removed" : "saved");
    } catch {
      const nextError = new Error("Não foi possível salvar o marcador da lição.");

      setError(nextError);

      setState("error");

      throw nextError;
    }
  };

  return { error, save, state };
}
