import type { ProgressDatabaseContract } from "../../../storage/progress-database.contract";
import type { UpdateSimulationSessionPort, UpdateSimulationSessionInput, StudySession } from "@guesant/saberes-application";

export class UpdateSimulationSessionAdapter implements UpdateSimulationSessionPort {
  public constructor(private readonly database: ProgressDatabaseContract) {}

  public execute(input: UpdateSimulationSessionInput): Promise<StudySession> {
    return this.database.updateSimulationSession(input);
  }
}
