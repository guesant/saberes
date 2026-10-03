import { DexieProgressStore } from "./dexie-progress.store";
import type { ListDiagnosesPort } from "@guesant/saberes-application";

export class ListDiagnosesAdapter implements ListDiagnosesPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListDiagnosesPort["execute"]> {
    return this.store.listDiagnoses();
  }
}
