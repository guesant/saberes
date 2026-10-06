import type { SimulationSessionUpdater } from "./simulation-session-updater.interface";
import type { ApplicationServices } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export interface CompleteSimulationSessionInput {
  sessionId: string;
  remainingSeconds: number | null;
  updater: SimulationSessionUpdater;
  services: ApplicationServices;
  client: QueryClient;
}
