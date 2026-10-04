import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveAcademicDisciplinePort } from "@guesant/saberes-application";
import type { AcademicDiscipline } from "@guesant/saberes-domain";

export class SaveAcademicDisciplineAdapter implements SaveAcademicDisciplinePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(discipline: AcademicDiscipline): Promise<AcademicDiscipline> {
    return this.store.saveAcademicDiscipline(discipline);
  }
}
