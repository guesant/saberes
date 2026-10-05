export function getPersonalProgressQueryError(
  attemptsError: Error | null,
  sessionsError: Error | null,
  goalsError: Error | null,
): Error | null {
  return attemptsError ?? sessionsError ?? goalsError;
}
