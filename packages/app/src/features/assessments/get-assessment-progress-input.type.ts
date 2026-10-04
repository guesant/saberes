import type { Attempt } from "@guesant/saberes-application";

export type GetAssessmentProgressInput = {
  attempts: Attempt[];
  items: Array<Record<string, unknown>>;
};
