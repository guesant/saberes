import type { PriorKnowledgeStatus, StudyRecord } from "@guesant/saberes-application";

export type CreateQuestionPriorKnowledgeRecordInput = {
  existing: StudyRecord | undefined;
  status: PriorKnowledgeStatus;
  timestamp: string;
};

export function createQuestionPriorKnowledgeRecord(
  input: CreateQuestionPriorKnowledgeRecordInput,
): StudyRecord {
  return {
    ...input.existing,
    priorKnowledge: input.status,
    priorKnowledgeAt: input.timestamp,
  };
}
