import type { QuestionReadModel } from "../models/index";
import type { ContentKey } from "@guesant/saberes-domain";

export interface GetQuestionPort {
  execute(key: ContentKey | string): Promise<QuestionReadModel | null>;
}
