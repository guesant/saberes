import type { StudyRecord } from "../models/index.ts";
import type { ListReviewItemsPort } from "../ports/index.ts";

export class ListReviewItemsQueryHandler {
  public constructor(private readonly port: ListReviewItemsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
