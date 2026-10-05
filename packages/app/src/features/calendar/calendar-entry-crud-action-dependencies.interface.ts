import type { ApplicationServices } from "@guesant/saberes-application";

export interface CalendarEntryCrudActionDependencies {
  refetch(): Promise<unknown>;

  services: ApplicationServices;
}
