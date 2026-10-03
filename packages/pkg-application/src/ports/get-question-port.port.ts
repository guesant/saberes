import type { ContentKey, QuestionReadModel } from "../models/content.models.ts";

export interface GetQuestionPort {
  execute(key: ContentKey | string): Promise<QuestionReadModel | null>;
}
