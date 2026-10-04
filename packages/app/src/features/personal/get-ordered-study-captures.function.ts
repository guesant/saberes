import type { StudyCapture } from "@guesant/saberes-application";

const priorityOrder: Record<StudyCapture["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function getOrderedStudyCaptures(captures: StudyCapture[]): StudyCapture[] {
  return [...captures].sort((left, right) => {
    const leftKey = [
      Number(left.completed),
      left.dueDate ?? "9999-12-31",
      priorityOrder[left.priority],
      left.updatedAt,
    ].join("|");

    const rightKey = [
      Number(right.completed),
      right.dueDate ?? "9999-12-31",
      priorityOrder[right.priority],
      right.updatedAt,
    ].join("|");

    return leftKey.localeCompare(rightKey);
  });
}
