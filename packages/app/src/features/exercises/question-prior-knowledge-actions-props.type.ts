import type { PriorKnowledgeStatus } from "@guesant/saberes-application";

export type QuestionPriorKnowledgeActionsProps = {
  disabled: boolean;
  onSelect: (status: PriorKnowledgeStatus) => Promise<void>;
  selected: PriorKnowledgeStatus | null;
};
