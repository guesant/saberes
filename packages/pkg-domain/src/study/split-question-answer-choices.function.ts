import { normalizeQuestionAnswerText } from "./normalize-question-answer-text.function";

export function splitQuestionAnswerChoices(value: string): string[] {
  return value
    .split(/[;,\s]+/)
    .map((item) => normalizeQuestionAnswerText(item))
    .filter(Boolean)
    .sort();
}
