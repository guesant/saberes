import { useState } from "react";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { QuestionSubmissionState } from "./question-submission-state.interface";
import type { UseQuestionSubmissionInput } from "./use-question-submission-input.interface";
import type { ActionState } from "../../types/action-state.type";

export function useQuestionSubmission(
  input: UseQuestionSubmissionInput,
): QuestionSubmissionState {
  const [state, setState] = useState<ActionState>("idle");

  const [error, setError] = useState<Error | null>(null);

  const [result, setResult] = useState<QuestionSubmissionResult | null>(null);

  const submit = async (): Promise<void> => {
    if (!input.answer?.trim() || !input.confidence) {
      return;
    }

    setState("saving");

    setError(null);

    try {
      setResult(
        await input.onSubmit(
          input.answer.trim(),
          Date.now() - input.startedAt.current,
          input.confidence,
        ),
      );

      setState("saved");
    } catch {
      setError(new Error("Não foi possível registrar a resposta localmente."));

      setState("error");
    }
  };

  const clearQuestionSubmission = (): void => {
    setError(null);

    setResult(null);

    setState("idle");
  };

  return { clearQuestionSubmission, error, result, state, submit };
}
