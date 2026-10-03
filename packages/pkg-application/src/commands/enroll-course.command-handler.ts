import type { StudyRecord } from "../models/index.ts";
import type { EnrollCoursePort } from "../ports/index.ts";

export class EnrollCourseCommandHandler {
  public constructor(private readonly port: EnrollCoursePort) {}

  public execute(input: Parameters<EnrollCoursePort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
