import { restorePersonalRelation } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { RestorePersonalRelationCommandInput , RestorePersonalRelationPort } from "@guesant/saberes-application";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class RestorePersonalRelationAdapter implements RestorePersonalRelationPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: RestorePersonalRelationCommandInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const restoredWorkspace = restorePersonalRelation({ ...input, workspace });

    return this.store.savePersonalWorkspace(restoredWorkspace);
  }
}
