import type { ListStudyGoalsPort } from "../ports/index";
import type { StudyGoal } from "@guesant/saberes-domain";

export class ListStudyGoalsQueryHandler {
  public constructor(private readonly port: ListStudyGoalsPort) {}

  public execute(): Promise<StudyGoal[]> {
    return this.port.execute();
  }
}
