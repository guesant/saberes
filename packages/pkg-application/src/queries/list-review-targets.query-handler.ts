import type { ReviewTarget } from "../models/index.ts";
import type { ListReviewTargetsPort } from "../ports/index.ts";

export class ListReviewTargetsQueryHandler {
  public constructor(private readonly port: ListReviewTargetsPort) {}

  public execute(): Promise<ReviewTarget[]> {
    return this.port.execute();
  }
}
