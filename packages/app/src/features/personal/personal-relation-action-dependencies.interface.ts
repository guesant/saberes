import type { ApplicationServices } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export interface PersonalRelationActionDependencies {
  queryClient: QueryClient;
  services: ApplicationServices;
}
