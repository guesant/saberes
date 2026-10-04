import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListFocusSessionsPort } from "@guesant/saberes-application";
import type { FocusSession } from "@guesant/saberes-domain";

export class ListFocusSessionsAdapter implements ListFocusSessionsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): Promise<FocusSession[]> {
    return this.store.listFocusSessions();
  }
}
