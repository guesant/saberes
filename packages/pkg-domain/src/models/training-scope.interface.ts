import type { Difficulty } from "./domain.enums";

export interface TrainingScope {
  targetEditionSlug: string;
  targetStageSlug: string;
  sourceEditionSlug?: string;
  sourceStageSlug?: string;
  subjectSlug?: string;
  skillSlug?: string;
  difficulty?: Difficulty;
}
