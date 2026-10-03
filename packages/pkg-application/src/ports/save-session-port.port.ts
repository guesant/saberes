import type { StudySession } from "../models/progress.models.ts";

export interface SaveSessionPort {
  execute(session: StudySession): Promise<void>;
}
