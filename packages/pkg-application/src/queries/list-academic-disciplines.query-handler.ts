import type { ListAcademicDisciplinesPort } from "../ports/index";
import type { AcademicDiscipline } from "@guesant/saberes-domain";

export class ListAcademicDisciplinesQueryHandler {
  public constructor(private readonly port: ListAcademicDisciplinesPort) {}

  public execute(): Promise<AcademicDiscipline[]> {
    return this.port.execute();
  }
}
