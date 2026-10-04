import type { PerformanceScope } from "./performance-scope.type";

export function getPerformanceScopeLabel(
  scope: PerformanceScope,
  courseLabel: string | undefined,
  planLabel: string | undefined,
): string {
  if (scope === "course") {
    return courseLabel ?? "Curso";
  }

  if (scope === "plan") {
    return planLabel ?? "Plano";
  }

  return "Todos";
}
