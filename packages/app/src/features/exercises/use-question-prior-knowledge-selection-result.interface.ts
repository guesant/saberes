import type { PriorKnowledgeStatus } from "@guesant/saberes-application";

export interface UseQuestionPriorKnowledgeSelectionResult {
  error: Error | null;
  retry(): Promise<void>;

  saving: boolean;
  selectStatus(status: PriorKnowledgeStatus): Promise<void>;
  selected: PriorKnowledgeStatus | null;
}
