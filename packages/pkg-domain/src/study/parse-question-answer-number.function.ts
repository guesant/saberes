export function parseQuestionAnswerNumber(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}
