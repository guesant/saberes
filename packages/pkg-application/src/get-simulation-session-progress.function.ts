import type { SimulationSessionProgress } from "./models/simulation-session-progress.interface";
import type { StudySession } from "./models/study-session.interface";

export function getSimulationSessionProgress(session: StudySession | null): SimulationSessionProgress {
  return {
    current: (session?.currentIndex ?? 0) + 1,
    total: session?.questionKeys?.length ?? 0,
  };
}
