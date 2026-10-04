import { createQuestionDiagnosisAction } from "./create-question-diagnosis-action.function";
import { createQuestionPriorKnowledgeAction } from "./create-question-prior-knowledge-action.function";
import { createQuestionSubmissionAction } from "./create-question-submission-action.function";
import type { QuestionViewModelActions } from "./question-view-model-actions.type";
import type { ApplicationServices, QuestionReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

export type CreateQuestionViewModelActionsInput = {
  attemptId: string | null;
  data: QuestionReadModel | null;
  queryClient: QueryClient;
  services: ApplicationServices;
  setAttemptId: Dispatch<SetStateAction<string | null>>;
  sessionId?: string;
};

export function createQuestionViewModelActions(
  input: CreateQuestionViewModelActionsInput,
): QuestionViewModelActions {
  return {
    saveDiagnosis: createQuestionDiagnosisAction({
      attemptId: input.attemptId,
      services: input.services,
    }),
    savePriorKnowledge: createQuestionPriorKnowledgeAction({
      data: input.data,
      queryClient: input.queryClient,
      services: input.services,
    }),
    submit: createQuestionSubmissionAction({
      data: input.data,
      queryClient: input.queryClient,
      services: input.services,
      setAttemptId: input.setAttemptId,
      sessionId: input.sessionId,
    }),
  };
}
