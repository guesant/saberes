import type { ContentKey, QuestionReadModel } from "../models/index.ts";

export interface GetQuestionPort {
  execute(key: ContentKey | string): Promise<QuestionReadModel | null>;
}
