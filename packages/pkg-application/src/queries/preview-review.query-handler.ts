import type { PreviewReviewEntry, ReviewTarget } from "../models/index";
import type { PreviewReviewPort } from "../ports/index";

export interface ReviewPreviewInput {
  target: ReviewTarget;
  now?: Date;
  requestRetention?: number;
}

export class PreviewReviewQueryHandler {
  public constructor(private readonly port: PreviewReviewPort) {}

  public execute(input: ReviewPreviewInput): Record<string, PreviewReviewEntry> {
    return this.port.execute(input);
  }
}
