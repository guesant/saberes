import type { StudySession } from "../models/index.ts";

export interface GetSessionPort {
  execute(id: string): Promise<StudySession | undefined>;
}
