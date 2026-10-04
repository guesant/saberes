export function calculateMovedStudyPlanStepOrder(
  order: string[],
  stepId: string,
  direction: -1 | 1,
): string[] {
  const currentIndex = order.indexOf(stepId);

  const targetIndex = currentIndex + direction;

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= order.length) {
    return order;
  }

  const nextOrder = [...order];

  const targetId = nextOrder[targetIndex];

  nextOrder[targetIndex] = stepId;

  nextOrder[currentIndex] = targetId;

  return nextOrder;
}
