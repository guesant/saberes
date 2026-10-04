import type { ProgressStorageContract } from "../storage/progress-storage.contract";

export async function addStudyPoints(
  storage: ProgressStorageContract,
  amount: number,
  reason: string,
) {
  const current = await storage.getSetting("studyPoints");

  const points = Number(current?.value || 0) + Number(amount || 0);

  await storage.saveSetting("studyPoints", points);

  return { points, reason };
}
