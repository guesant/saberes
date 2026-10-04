export function getStudyChecklistTargetIndex(
  currentIndex: number,
  direction: "down" | "up",
): number {
  return direction === "up" ? currentIndex - 1 : currentIndex + 1;
}
