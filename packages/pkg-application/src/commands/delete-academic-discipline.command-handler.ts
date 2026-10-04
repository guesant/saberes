import type { DeleteAcademicDisciplinePort } from "../ports/delete-academic-discipline-port.port";

export class DeleteAcademicDisciplineCommandHandler {
  public constructor(private readonly port: DeleteAcademicDisciplinePort) {}

  public execute(id: string): Promise<void> {
    return this.port.execute(id);
  }
}
