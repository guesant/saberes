import type { Attempt } from "./attempt.type";
import type { StudySession } from "./study-session.interface";

export interface CompleteSimulationSessionInput {
  session: StudySession;
  attempts: Attempt[];
  expectedRevision: number;
}
