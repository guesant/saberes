import type { PriorKnowledgeStatus } from "@guesant/saberes-application";

export type UseQuestionPriorKnowledgeSelectionInput = {
  errorMessage: string;
  onSelect: (status: PriorKnowledgeStatus) => Promise<void>;
};
