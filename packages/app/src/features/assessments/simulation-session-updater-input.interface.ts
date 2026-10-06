import type { ApplicationServices } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export interface SimulationSessionUpdaterInput {
  sessionId: string;
  services: ApplicationServices;
  client: QueryClient;
}
