import type { AttemptConfidence } from "@guesant/saberes-application";

export type QuestionConfidenceInputProps = {
  onChange: (confidence: AttemptConfidence) => void;
  value: AttemptConfidence | null;
};
