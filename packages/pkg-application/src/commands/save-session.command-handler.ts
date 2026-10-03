import type { SaveSessionPort } from "../application.ports.ts";
import type { StudySession } from "../models/progress.models.ts";

export class SaveSessionCommandHandler {
  public constructor(private readonly port: SaveSessionPort) {}

  public execute(session: StudySession): Promise<void> {
    return this.port.execute(session);
  }
}
