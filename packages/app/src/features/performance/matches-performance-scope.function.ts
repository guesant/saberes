export function matchesPerformanceScope(
  contentKey: string | undefined,
  scopeKey: string | undefined,
): boolean {
  if (!scopeKey) {
    return true;
  }

  return contentKey === scopeKey || contentKey?.startsWith(`${scopeKey}:`) === true;
}
