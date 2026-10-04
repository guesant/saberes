import type { SaveAcademicDisciplinePort } from "../ports/index";
import type { AcademicDiscipline } from "@guesant/saberes-domain";

export class SaveAcademicDisciplineCommandHandler {
  public constructor(private readonly port: SaveAcademicDisciplinePort) {}

  public execute(discipline: AcademicDiscipline): Promise<AcademicDiscipline> {
    return this.port.execute(discipline);
  }
}
