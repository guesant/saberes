import type { ListReviewItemsPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class ListReviewItemsQueryHandler {
  public constructor(private readonly port: ListReviewItemsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
