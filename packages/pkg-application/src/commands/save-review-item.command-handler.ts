import type { StudyRecord } from "../models/index.ts";
import type { SaveReviewItemPort } from "../ports/index.ts";

export class SaveReviewItemCommandHandler {
  public constructor(private readonly port: SaveReviewItemPort) {}

  public execute(input: Parameters<SaveReviewItemPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
