import type { StudySession } from "../models/index";

export interface GetSessionPort {
  execute(id: string): Promise<StudySession | undefined>;
}
