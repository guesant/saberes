import type { AssessmentProgress } from "./assessment-progress.interface";
import type { AssessmentReadModel } from "@guesant/saberes-application";

export type AssessmentReadyViewProps = {
  assessmentKey: string;
  data: AssessmentReadModel;
  progress: AssessmentProgress | null;
  progressError: Error | null;
  onReloadProgress: () => Promise<void>;
};
