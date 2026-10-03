import type { StudyRecord } from "../models/index.ts";
import type { ListBookmarksPort } from "../ports/index.ts";

export class ListBookmarksQueryHandler {
  public constructor(private readonly port: ListBookmarksPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
