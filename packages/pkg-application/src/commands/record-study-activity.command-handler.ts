import type { RecordStudyActivityPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

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
