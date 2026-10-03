import type { ReviewTarget } from "../models/index";
import type { PreviewReviewPort } from "../ports/index";

export interface ReviewPreviewInput {
  target: ReviewTarget;
  now?: Date;
}

export class PreviewReviewQueryHandler {
  public constructor(private readonly port: PreviewReviewPort) {}

  public execute(input: ReviewPreviewInput): Record<string, { dueAt: string; interval: number }> {
    return this.port.execute(input);
  }
}
