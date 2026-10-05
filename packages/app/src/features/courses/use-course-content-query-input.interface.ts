import type { ApplicationServices } from "@guesant/saberes-application";

export interface UseCourseContentQueryInput {
  services: ApplicationServices;
  slug: string | undefined;
}
