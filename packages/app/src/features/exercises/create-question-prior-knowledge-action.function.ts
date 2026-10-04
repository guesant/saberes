import { saveQuestionPriorKnowledge } from "./save-question-prior-knowledge.function";
import type {
  ApplicationServices,
  PriorKnowledgeStatus,
  QuestionReadModel,
} from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateQuestionPriorKnowledgeActionInput = {
  data: QuestionReadModel | null;
  queryClient: QueryClient;
  services: ApplicationServices;
};

export function createQuestionPriorKnowledgeAction(
  input: CreateQuestionPriorKnowledgeActionInput,
): (status: PriorKnowledgeStatus) => Promise<void> {
  return async (status: PriorKnowledgeStatus): Promise<void> => {
    if (!input.data) {
      return;
    }

    await saveQuestionPriorKnowledge({ data: input.data, services: input.services, status });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "topic-mastery"] });
  };
}
