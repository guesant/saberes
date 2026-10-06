import type { AttemptConfidence } from "@guesant/saberes-application";

export interface QuestionConfidenceDialogProps {
  confidence: AttemptConfidence | null;
  open: boolean;
  submitting: boolean;
  onChange(confidence: AttemptConfidence): void;

  onClose(): void;

  onConfirm(): Promise<void>;
}
