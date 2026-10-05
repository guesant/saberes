export function getPersonalProgressQueryPending(
  attemptsPending: boolean,
  sessionsPending: boolean,
  goalsPending: boolean,
): boolean {
  return attemptsPending || sessionsPending || goalsPending;
}
