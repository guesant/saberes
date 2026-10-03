import type { ReviewTarget } from "../models/index.ts";
import type { PreviewReviewPort } from "../ports/index.ts";

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
