import type { EnrollCoursePort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class EnrollCourseCommandHandler {
  public constructor(private readonly port: EnrollCoursePort) {}

  public execute(input: Parameters<EnrollCoursePort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
