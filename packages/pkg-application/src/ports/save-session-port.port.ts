import type { StudySession } from "../models/index.ts";

export interface SaveSessionPort {
  execute(session: StudySession): Promise<void>;
}
