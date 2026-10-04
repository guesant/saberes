export function getLocalQueryRetryDelay(attempt: number): number {
  return Math.min(250 * 2 ** attempt, 1000);
}
