import type { StudyRecord } from "../models/index";
import type { ListBookmarksPort } from "../ports/index";

export class ListBookmarksQueryHandler {
  public constructor(private readonly port: ListBookmarksPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
