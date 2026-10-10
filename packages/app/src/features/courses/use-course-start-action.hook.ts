import { useState } from "react";
import type { CourseStartActionState } from "./course-start-action-state.interface";
import type { UseCourseStartActionInput } from "./use-course-start-action-input.interface";
import type { ActionState } from "../../types/action-state.type";

export function useCourseStartAction(input: UseCourseStartActionInput): CourseStartActionState {
  const [state, setState] = useState<ActionState>("idle");

  const [error, setError] = useState<Error | null>(null);

  const start = async (): Promise<void> => {
    setState("saving");

    setError(null);

    try {
      await input.action();

      setState("saved");
    } catch {
      const nextError = new Error("Não foi possível iniciar o curso localmente.");

      setError(nextError);

      setState("error");

      throw nextError;
    }
  };

  return { error, start, state };
}
