import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type {
  AttemptConfidence,
  DiagnosisCode,
  QuestionReadModel,
} from "@guesant/saberes-application";

export type QuestionReadyContentProps = {
  answer: string | null;
  bookmarkError: Error | null;
  bookmarked: boolean;
  confidence: AttemptConfidence | null;
  data: QuestionReadModel;
  onAnswerChange: (answer: string | null) => void;
  onConfidenceChange: (confidence: AttemptConfidence) => void;
  onDiagnose: (code: DiagnosisCode) => Promise<void>;
  onPriorKnowledge: (
    status: import("@guesant/saberes-application").PriorKnowledgeStatus,
  ) => Promise<void>;
  onBookmark: () => Promise<void>;
  onRetryBookmark: () => Promise<void>;
  onRetry: () => void;
  onContinue?: (result: QuestionSubmissionResult) => Promise<void>;
  onSubmit: () => Promise<void>;
  result: QuestionSubmissionResult | null;
};
