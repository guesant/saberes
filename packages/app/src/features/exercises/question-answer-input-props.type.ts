import type { QuestionOptionReadModel } from "@guesant/saberes-application";

export type QuestionAnswerInputProps = {
  questionType: string;
  options: QuestionOptionReadModel[];
  value: string;
  onChange(value: string): void;
};
