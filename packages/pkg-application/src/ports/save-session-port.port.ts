import type { StudySession } from "../models/index";

export interface SaveSessionPort {
  execute(session: StudySession): Promise<void>;
}
