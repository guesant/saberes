import type { ApplicationServices } from "@guesant/saberes-application";

export interface StartAssessmentStudySessionInput {
  assessmentKey: string;
  navigate(path: string): void;
  questionKeys: string[];
  services: ApplicationServices;
}
