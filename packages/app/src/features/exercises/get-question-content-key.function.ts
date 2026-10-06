import type { QuestionReadModel } from "@guesant/saberes-application";

export function getQuestionContentKey(
  data: QuestionReadModel | null,
  fallback: string | undefined,
): string {
  const selectedKey = [data?.question.occurrence_id, data?.question.canonical_key, fallback]
    .find((key) => {
      return key !== undefined && key !== null && key !== "";
    });

  if (typeof selectedKey === "number") {
    return `question:${String(selectedKey)}`;
  }

  return String(selectedKey || "");
}
