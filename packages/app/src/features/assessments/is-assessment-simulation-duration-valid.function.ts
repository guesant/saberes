export function isAssessmentSimulationDurationValid(questionCount: number, durationMs: number): boolean {
  return questionCount > 0 && Number.isFinite(durationMs) && durationMs > 0;
}
