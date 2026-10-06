import type { StudySession, UpdateSimulationSessionCommand } from "@guesant/saberes-application";
import type { MutableRefObject } from "react";

export interface SimulationSessionUpdater {
  pending: number;
  error: string | null;
  update(command: UpdateSimulationSessionCommand): Promise<void>;

  cacheSession(session: StudySession): void;

  setError(error: string | null): void;

  saveError: MutableRefObject<boolean>;

  queue: MutableRefObject<Promise<void>>;
}
