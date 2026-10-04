import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListStudySessionsPort } from "@guesant/saberes-application";

export class ListStudySessionsAdapter implements ListStudySessionsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListStudySessionsPort["execute"]> {
    return this.store.listSessions();
  }
}
