export function getCourseRoadmapStepDuration(item: Record<string, unknown>): string {
  const duration = Number(item.duration_minutes);

  if (duration > 0) {
    return ` · ${duration} min`;
  }

  return "";
}
