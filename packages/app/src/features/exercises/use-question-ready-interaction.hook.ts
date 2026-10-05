import { useRef, useState } from "react";
import { useQuestionSubmission } from "./use-question-submission.hook";
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

  const startedAt = useRef(Date.now());

  const submission = useQuestionSubmission({
    answer,
    confidence,
    onSubmit: input.onSubmit,
    startedAt,
  });

  const clearQuestionReadyInteraction = (): void => {
    setAnswer(null);

    setConfidence(null);

    submission.clearQuestionSubmission();

    startedAt.current = Date.now();
  };

  return {
    answer,
    changeAnswer: setAnswer,
    changeConfidence: setConfidence,
    confidence,
    result: submission.result,
    submissionError: submission.error,
    submissionState: submission.state,
    clear: clearQuestionReadyInteraction,
    submit: submission.submit,
  };
}
