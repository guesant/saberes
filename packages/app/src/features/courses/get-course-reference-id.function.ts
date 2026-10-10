export function getCourseReferenceId(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}
