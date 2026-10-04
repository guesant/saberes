export function getStudyChecklistValues(input: string): string[] {
  return input
    .split("\n")
    .map((item) => {
      return item.trim();
    })
    .filter(Boolean);
}
