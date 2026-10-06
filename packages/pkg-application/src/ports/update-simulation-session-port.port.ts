import type { StudySession } from "../models/study-session.interface";
import type { UpdateSimulationSessionInput } from "../models/update-simulation-session-input.interface";

export interface UpdateSimulationSessionPort {
  execute(input: UpdateSimulationSessionInput): Promise<StudySession>;
}
