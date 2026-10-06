export function formatSimulationTime(seconds: number | null): string {
  if (seconds === null) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);

  const remainder = String(seconds % 60)
    .padStart(2, "0");

  return `${minutes}:${remainder}`;
}
