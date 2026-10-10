import type { QuestionReadModel } from "../models/index";
import type { ContentKey } from "@guesant/saberes-domain";
import type { TrainingScope } from "@guesant/saberes-domain";

export interface GetQuestionPort {
  execute(key: ContentKey | string, scope?: TrainingScope): Promise<QuestionReadModel | null>;
}
