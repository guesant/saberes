import { DexieProgressStore } from "./dexie-progress.store";
import type { SavePlanProgressPort } from "@guesant/saberes-application";

export class SavePlanProgressAdapter implements SavePlanProgressPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<SavePlanProgressPort["execute"]>[0],
  ): ReturnType<SavePlanProgressPort["execute"]> {
    return this.store.savePlanProgress(input.contentKey, input.data);
  }
}
