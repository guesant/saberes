import type { SaveStudyGoalPort } from "../ports/index";
import type { StudyGoal } from "@guesant/saberes-domain";

export class SaveStudyGoalCommandHandler {
  public constructor(private readonly port: SaveStudyGoalPort) {}

  public execute(goal: StudyGoal): Promise<StudyGoal> {
    return this.port.execute(goal);
  }
}
