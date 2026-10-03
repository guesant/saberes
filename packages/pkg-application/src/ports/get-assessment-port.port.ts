import type { AssessmentReadModel, ContentKey } from "../models/content.models.ts";

export interface GetAssessmentPort {
  execute(key: ContentKey | string): Promise<AssessmentReadModel | null>;
}
