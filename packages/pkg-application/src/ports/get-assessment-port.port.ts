import type { AssessmentReadModel } from "../models/index";
import type { ContentKey } from "@guesant/saberes-domain";

export interface GetAssessmentPort {
  execute(key: ContentKey | string): Promise<AssessmentReadModel | null>;
}
