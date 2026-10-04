import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveFocusSessionPort } from "@guesant/saberes-application";
import type { FocusSession } from "@guesant/saberes-domain";

export class SaveFocusSessionAdapter implements SaveFocusSessionPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(session: FocusSession): Promise<FocusSession> {
    return this.store.saveFocusSession(session);
  }
}
