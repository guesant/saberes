import type { ReviewTarget, SaveStudyRecordInput } from "../models/index";

export interface SaveReviewTargetPort {
  execute(input: SaveStudyRecordInput<Partial<ReviewTarget>>): Promise<ReviewTarget>;
}
