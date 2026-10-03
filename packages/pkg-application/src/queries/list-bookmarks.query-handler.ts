import type { ListBookmarksPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class ListBookmarksQueryHandler {
  public constructor(private readonly port: ListBookmarksPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
