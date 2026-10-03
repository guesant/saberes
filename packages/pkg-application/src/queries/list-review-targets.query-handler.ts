import type { ListReviewTargetsPort } from "../application.ports.ts";
import type { ReviewTarget } from "../models/progress.models.ts";

export class ListReviewTargetsQueryHandler {
  public constructor(private readonly port: ListReviewTargetsPort) {}

  public execute(): Promise<ReviewTarget[]> {
    return this.port.execute();
  }
}
