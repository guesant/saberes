export function isAnySimulationQueryLoading(sessionLoading: boolean, questionLoading: boolean): boolean {
  return sessionLoading || questionLoading;
}
