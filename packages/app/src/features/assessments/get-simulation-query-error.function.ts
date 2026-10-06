export function getSimulationQueryError(sessionError: Error | null, questionError: Error | null): Error | null {
  return sessionError ?? questionError;
}
