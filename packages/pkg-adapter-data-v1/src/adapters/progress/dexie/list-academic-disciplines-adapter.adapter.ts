import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListAcademicDisciplinesPort } from "@guesant/saberes-application";
import type { AcademicDiscipline } from "@guesant/saberes-domain";

export class ListAcademicDisciplinesAdapter implements ListAcademicDisciplinesPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): Promise<AcademicDiscipline[]> {
    return this.store.listAcademicDisciplines();
  }
}
