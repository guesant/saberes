import type { GetSessionPort } from "../application.ports.ts";
import type { StudySession } from "../models/progress.models.ts";

export class GetSessionQueryHandler {
  public constructor(private readonly port: GetSessionPort) {}

  public execute(id: string): Promise<StudySession | undefined> {
    return this.port.execute(id);
  }
}
