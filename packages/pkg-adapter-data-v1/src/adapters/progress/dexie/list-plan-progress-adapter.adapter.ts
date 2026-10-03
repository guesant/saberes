import { DexieProgressStore } from "./dexie-progress.store";
import type { ListPlanProgressPort } from "@guesant/saberes-application";

export class ListPlanProgressAdapter implements ListPlanProgressPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListPlanProgressPort["execute"]> {
    return this.store.listPlanProgress();
  }
}
