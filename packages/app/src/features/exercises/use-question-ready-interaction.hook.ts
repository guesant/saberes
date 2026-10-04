import { useRef, useState } from "react";
import type { QuestionReadyInteraction } from "./question-ready-interaction.interface";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { AttemptConfidence } from "@guesant/saberes-application";

export interface UseQuestionReadyInteractionInput {
  onSubmit(
    answer: string,
    elapsedMs: number,
    confidence: AttemptConfidence,
  ): Promise<QuestionSubmissionResult>;
}

export function useQuestionReadyInteraction(
  input: UseQuestionReadyInteractionInput,
): QuestionReadyInteraction {
  const [answer, setAnswer] = useState<string | null>(null);

  const [confidence, setConfidence] = useState<AttemptConfidence | null>(null);

  const [result, setResult] = useState<QuestionSubmissionResult | null>(null);

  const startedAt = useRef(Date.now());

  const submit = async (): Promise<void> => {
    if (answer?.trim() && confidence) {
      setResult(await input.onSubmit(answer.trim(), Date.now() - startedAt.current, confidence));
    }
  };

  const clearQuestionReadyInteraction = (): void => {
    setAnswer(null);

    setConfidence(null);

    setResult(null);

    startedAt.current = Date.now();
  };

  return {
    answer,
    changeAnswer: setAnswer,
    changeConfidence: setConfidence,
    confidence,
    result,
    clear: clearQuestionReadyInteraction,
    submit,
  };
}
