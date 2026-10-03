import type { StudyRecord } from "../models/index";
import type { RecordStudyActivityPort } from "../ports/index";

export interface StudyActivityInput {
  at?: Date | string;
  type?: string;
}

export class RecordStudyActivityCommandHandler {
  public constructor(private readonly port: RecordStudyActivityPort) {}

  public execute(activity?: StudyActivityInput): Promise<StudyRecord> {
    return this.port.execute(activity);
  }
}
