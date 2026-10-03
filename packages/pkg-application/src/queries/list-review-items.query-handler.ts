import type { StudyRecord } from "../models/index";
import type { ListReviewItemsPort } from "../ports/index";

export class ListReviewItemsQueryHandler {
  public constructor(private readonly port: ListReviewItemsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
