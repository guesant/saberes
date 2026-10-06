import type { StudySession, UpdateSimulationSessionCommand } from "@guesant/saberes-application";

export interface SimulationSessionAnswerInput {
  session: StudySession | null;
  sessionId: string;
  questionKey: string;
  remainingSeconds: number | null;
  finishing: boolean;
  update(command: UpdateSimulationSessionCommand): Promise<void>;
}
