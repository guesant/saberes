import type { PriorKnowledgeStatus } from "@guesant/saberes-application";

export interface QuestionContextDisclosureProps {
  bookmarkError: Error | null;

  bookmarked: boolean;

  onBookmark(): Promise<void>;

  onPriorKnowledge(status: PriorKnowledgeStatus): Promise<void>;

  onRetryBookmark(): Promise<void>;
}
