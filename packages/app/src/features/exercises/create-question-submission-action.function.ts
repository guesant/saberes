import { submitQuestionAnswer } from "./submit-question-answer.function";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type {
  ApplicationServices,
  AttemptConfidence,
  QuestionReadModel,
} from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

export type CreateQuestionSubmissionInput = {
  data: QuestionReadModel | null;
  queryClient: QueryClient;
  services: ApplicationServices;
  setAttemptId: Dispatch<SetStateAction<string | null>>;
};

export function createQuestionSubmissionAction(
  input: CreateQuestionSubmissionInput,
): (
  answer: string,
  elapsedMs: number,
  confidence: AttemptConfidence,
) => Promise<QuestionSubmissionResult> {
  const { data, services, setAttemptId } = input;

  return async (
    answer: string,
    elapsedMs: number,
    confidence: AttemptConfidence,
  ): Promise<QuestionSubmissionResult> => {
    if (!data) {
      return { attemptId: "", confidence, correct: null };
    }

    const result = await submitQuestionAnswer({ answer, confidence, data, elapsedMs, services });

    setAttemptId(result.attemptId);

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "attempts"] });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "topic-mastery"] });

    return result;
  };
}
