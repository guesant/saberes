import { DexieProgressStore } from "./dexie-progress.store";
import type { SaveDiagnosisPort } from "@guesant/saberes-application";

export class SaveDiagnosisAdapter implements SaveDiagnosisPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public async execute(input: Parameters<SaveDiagnosisPort["execute"]>[0]): Promise<void> {
    await this.store.saveDiagnosis(input);
  }
}
