import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { DeleteAcademicDisciplinePort } from "@guesant/saberes-application";

export class DeleteAcademicDisciplineAdapter implements DeleteAcademicDisciplinePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(id: string): Promise<void> {
    return this.store.deleteAcademicDiscipline(id);
  }
}
