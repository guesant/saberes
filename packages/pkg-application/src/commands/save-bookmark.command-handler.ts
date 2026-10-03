import type { SaveBookmarkPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class SaveBookmarkCommandHandler {
  public constructor(private readonly port: SaveBookmarkPort) {}

  public execute(input: Parameters<SaveBookmarkPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
