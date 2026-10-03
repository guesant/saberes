import type { ReviewTarget } from "../models/index";
import type { SaveReviewTargetPort } from "../ports/index";

export class SaveReviewTargetCommandHandler {
  public constructor(private readonly port: SaveReviewTargetPort) {}

  public execute(input: Parameters<SaveReviewTargetPort["execute"]>[0]): Promise<ReviewTarget> {
    return this.port.execute(input);
  }
}
