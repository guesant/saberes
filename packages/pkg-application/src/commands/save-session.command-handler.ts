import type { StudySession } from "../models/index";
import type { SaveSessionPort } from "../ports/index";

export class SaveSessionCommandHandler {
  public constructor(private readonly port: SaveSessionPort) {}

  public execute(session: StudySession): Promise<void> {
    return this.port.execute(session);
  }
}
