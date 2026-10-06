import type { ApplicationServices } from "@guesant/saberes-application";

export interface SyncQuestionSubmissionInput {
  services: ApplicationServices;
  contentKey: string;
  correct: boolean | null;
}
