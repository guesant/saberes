import type { StudySession } from "../models/index.ts";
import type { GetSessionPort } from "../ports/index.ts";

export class GetSessionQueryHandler {
  public constructor(private readonly port: GetSessionPort) {}

  public execute(id: string): Promise<StudySession | undefined> {
    return this.port.execute(id);
  }
}
