import type { AssessmentReadModel, ContentKey } from "../models/index.ts";

export interface GetAssessmentPort {
  execute(key: ContentKey | string): Promise<AssessmentReadModel | null>;
}
