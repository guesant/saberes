import { normalizeQuestionAnswerText } from "./normalize-question-answer-text.function";

export function normalizeQuestionAnswerBoolean(value: string): string {
  const normalized = normalizeQuestionAnswerText(value);

  if (["true", "verdadeiro", "v", "sim", "yes", "1"].includes(normalized)) {
    return "true";
  }

  if (["false", "falso", "f", "não", "nao", "no", "0"].includes(normalized)) {
    return "false";
  }

  return normalized;
}
