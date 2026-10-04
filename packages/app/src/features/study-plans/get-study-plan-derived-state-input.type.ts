import type { StudyRecord } from "@guesant/saberes-application";

export type GetStudyPlanDerivedStateInput = {
  steps: Array<Record<string, unknown>>;
  progress: StudyRecord[];
  slug: string | undefined;
};
