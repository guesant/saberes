export function getPersonalProgressViewState(
  isPending: boolean,
  error: Error | null,
): "loading" | "error" | "ready" {
  if (isPending) {
    return "loading";
  }

  if (error) {
    return "error";
  }

  return "ready";
}
