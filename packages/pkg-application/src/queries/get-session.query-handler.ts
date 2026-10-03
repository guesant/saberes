import type { StudySession } from "../models/index";
import type { GetSessionPort } from "../ports/index";

export class GetSessionQueryHandler {
  public constructor(private readonly port: GetSessionPort) {}

  public execute(id: string): Promise<StudySession | undefined> {
    return this.port.execute(id);
  }
}
