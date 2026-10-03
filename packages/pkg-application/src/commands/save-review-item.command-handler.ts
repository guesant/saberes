import type { SaveReviewItemPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class SaveReviewItemCommandHandler {
  public constructor(private readonly port: SaveReviewItemPort) {}

  public execute(input: Parameters<SaveReviewItemPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
