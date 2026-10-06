import type { SimulationSessionUpdater } from "./simulation-session-updater.interface";
import type { ApplicationServices, StudySession } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export interface SimulationSessionCompletionInput {
  sessionId: string;
  session: StudySession | null;
  remainingSeconds: number | null;
  updater: SimulationSessionUpdater;
  services: ApplicationServices;
  client: QueryClient;
}
