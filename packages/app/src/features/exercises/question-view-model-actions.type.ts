import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type {
  AttemptConfidence,
  DiagnosisCode,
  PriorKnowledgeStatus,
} from "@guesant/saberes-application";

export type QuestionViewModelActions = {
  saveDiagnosis(code: DiagnosisCode): Promise<void>;

  savePriorKnowledge(status: PriorKnowledgeStatus): Promise<void>;

  submit(
    answer: string,
    elapsedMs: number,
    confidence: AttemptConfidence,
  ): Promise<QuestionSubmissionResult>;
};
