import type { ReviewTarget } from "../models/index";
import type { ListReviewTargetsPort } from "../ports/index";

export class ListReviewTargetsQueryHandler {
  public constructor(private readonly port: ListReviewTargetsPort) {}

  public execute(): Promise<ReviewTarget[]> {
    return this.port.execute();
  }
}
