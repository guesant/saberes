import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SavePersonalWorkspacePort } from "@guesant/saberes-application";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class SavePersonalWorkspaceAdapter implements SavePersonalWorkspacePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(workspace: PersonalWorkspace): Promise<PersonalWorkspace> {
    return this.store.savePersonalWorkspace(workspace);
  }
}
