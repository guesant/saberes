export type QuestionAnswerInputProps = {
  questionType: string;
  options: Array<Record<string, unknown>>;
  value: string;
  onChange(value: string): void;
};
