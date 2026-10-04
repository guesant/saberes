import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createQuestionViewModelActions } from "./create-question-view-model-actions.function";
import { createQuestionViewModelResult } from "./create-question-view-model-result.function";
import { useQuestionContentQuery } from "./use-question-content-query.hook";
import { useQuestionViewModelBookmark } from "./use-question-view-model-bookmark.hook";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type {
  AttemptConfidence,
  DiagnosisCode,
  PriorKnowledgeStatus,
  QuestionReadModel,
} from "@guesant/saberes-application";

export type QuestionViewModelState = "loading" | "error" | "ready";

export interface QuestionViewModel {
  state: QuestionViewModelState;
  data: QuestionReadModel | null;
  bookmarked: boolean;
  bookmarkError: Error | null;
  error: Error | null;
  reload(): Promise<void>;

  saveBookmark(): Promise<void>;

  submit(
    answer: string,
    elapsedMs: number,
    confidence: AttemptConfidence,
  ): Promise<QuestionSubmissionResult>;

  saveDiagnosis(code: DiagnosisCode): Promise<void>;

  savePriorKnowledge(status: PriorKnowledgeStatus): Promise<void>;
}

export function useQuestionViewModel(
  key: string | undefined,
  sessionId?: string,
): QuestionViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const [attemptId, setAttemptId] = useState<string | null>(null);

  const query = useQuestionContentQuery({ key, services });

  const data = query.data ?? null;

  const bookmark = useQuestionViewModelBookmark({
    data,
    key,
    queryClient,
    services,
  });

  const actions = createQuestionViewModelActions({
    attemptId,
    data,
    queryClient,
    services,
    setAttemptId,
    sessionId,
  });

  return createQuestionViewModelResult({ actions, bookmark, data, query });
}
