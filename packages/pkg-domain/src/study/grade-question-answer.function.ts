import { normalizeQuestionAnswerBoolean } from "./normalize-question-answer-boolean.function";
import { normalizeQuestionAnswerText } from "./normalize-question-answer-text.function";
import { parseQuestionAnswerNumber } from "./parse-question-answer-number.function";
import { splitQuestionAnswerChoices } from "./split-question-answer-choices.function";
import type { GradeQuestionAnswerInput } from "./grade-question-answer-input.type";

export function gradeQuestionAnswer(input: GradeQuestionAnswerInput): boolean | null {
  if (!input.automaticallyGradable) {
    return null;
  }

  if (input.questionType === "multiple_choice") {
    return (
      JSON.stringify(splitQuestionAnswerChoices(input.answer)) ===
      JSON.stringify(splitQuestionAnswerChoices(input.expectedAnswer))
    );
  }

  if (input.questionType === "numeric") {
    const answer = parseQuestionAnswerNumber(input.answer);

    const expected = parseQuestionAnswerNumber(input.expectedAnswer);

    return answer !== null && expected !== null && answer === expected;
  }

  if (input.questionType === "true_false") {
    return (
      normalizeQuestionAnswerBoolean(input.answer) ===
      normalizeQuestionAnswerBoolean(input.expectedAnswer)
    );
  }

  return (
    normalizeQuestionAnswerText(input.answer) === normalizeQuestionAnswerText(input.expectedAnswer)
  );
}
