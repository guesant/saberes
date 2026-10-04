import type { StudySession } from "../models/index";
import type { ListStudySessionsPort } from "../ports/index";

export class ListStudySessionsQueryHandler {
  public constructor(private readonly port: ListStudySessionsPort) {}

  public execute(): Promise<StudySession[]> {
    return this.port.execute();
  }
}
