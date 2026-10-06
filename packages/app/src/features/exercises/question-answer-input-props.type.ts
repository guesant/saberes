import type { QuestionOptionReadModel } from "@guesant/saberes-application";

export type QuestionAnswerInputProps = {
  questionType: string;
  options: QuestionOptionReadModel[];
  value: string;
  disabled?: boolean;
  onChange(value: string): void;
};
