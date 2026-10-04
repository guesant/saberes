import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { GetPersonalWorkspacePort } from "@guesant/saberes-application";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class GetPersonalWorkspaceAdapter implements GetPersonalWorkspacePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): Promise<PersonalWorkspace> {
    return this.store.getPersonalWorkspace();
  }
}
