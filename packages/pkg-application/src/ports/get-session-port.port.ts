import type { StudySession } from "../models/progress.models.ts";

export interface GetSessionPort {
  execute(id: string): Promise<StudySession | undefined>;
}
