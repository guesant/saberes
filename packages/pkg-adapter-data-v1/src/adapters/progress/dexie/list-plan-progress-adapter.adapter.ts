import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListPlanProgressPort } from "@guesant/saberes-application";

export class ListPlanProgressAdapter implements ListPlanProgressPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListPlanProgressPort["execute"]> {
    return this.store.listPlanProgress();
  }
}
