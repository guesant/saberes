export function getReviewRetention(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0.9;
  }

  return Math.min(0.99, Math.max(0.8, value));
}
