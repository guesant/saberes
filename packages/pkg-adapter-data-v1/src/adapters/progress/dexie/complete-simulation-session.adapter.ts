import type { ProgressDatabaseContract } from "../../../storage/progress-database.contract";
import type { CompleteSimulationSessionPort, CompleteSimulationSessionInput, StudySession } from "@guesant/saberes-application";

export class CompleteSimulationSessionAdapter implements CompleteSimulationSessionPort {
  public constructor(private readonly database: ProgressDatabaseContract) {}

  public execute(input: CompleteSimulationSessionInput): Promise<StudySession> {
    return this.database.completeSimulationSession(input);
  }
}
