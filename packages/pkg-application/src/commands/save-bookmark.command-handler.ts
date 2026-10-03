import type { StudyRecord } from "../models/index.ts";
import type { SaveBookmarkPort } from "../ports/index.ts";

export class SaveBookmarkCommandHandler {
  public constructor(private readonly port: SaveBookmarkPort) {}

  public execute(input: Parameters<SaveBookmarkPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
