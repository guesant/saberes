import type { CompleteSimulationSessionInput } from "../models/complete-simulation-session-input.interface";
import type { StudySession } from "../models/study-session.interface";

export interface CompleteSimulationSessionPort {
  execute(input: CompleteSimulationSessionInput): Promise<StudySession>;
}
