import type { SaveReviewTargetPort } from "../application.ports.ts";
import type { ReviewTarget } from "../models/progress.models.ts";

export class SaveReviewTargetCommandHandler {
  public constructor(private readonly port: SaveReviewTargetPort) {}

  public execute(input: Parameters<SaveReviewTargetPort["execute"]>[0]): Promise<ReviewTarget> {
    return this.port.execute(input);
  }
}
