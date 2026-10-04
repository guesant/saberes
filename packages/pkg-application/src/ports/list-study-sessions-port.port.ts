import type { StudySession } from "../models/index";

export interface ListStudySessionsPort {
  execute(): Promise<StudySession[]>;
}
