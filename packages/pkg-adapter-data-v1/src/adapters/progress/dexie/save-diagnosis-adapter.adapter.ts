import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveDiagnosisPort } from "@guesant/saberes-application";

export class SaveDiagnosisAdapter implements SaveDiagnosisPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: Parameters<SaveDiagnosisPort["execute"]>[0]): Promise<void> {
    await this.store.saveDiagnosis(input);
  }
}
