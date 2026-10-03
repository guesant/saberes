import { progressDb } from "../storage/progress.database";

export async function addStudyPoints(amount: number, reason: string) {
  const current = await progressDb.getSetting("studyPoints");

  const points = Number(current?.value || 0) + Number(amount || 0);

  await progressDb.saveSetting("studyPoints", points);

  return { points, reason };
}
