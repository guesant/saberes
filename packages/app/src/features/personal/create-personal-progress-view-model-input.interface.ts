import type { PersonalProgressQueries } from "./personal-progress-queries.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface CreatePersonalProgressViewModelInput {
  workspace: PersonalWorkspace;
  queries: PersonalProgressQueries;
}
