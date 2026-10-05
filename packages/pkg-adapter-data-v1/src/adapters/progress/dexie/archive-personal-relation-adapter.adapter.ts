import { archivePersonalRelation } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ArchivePersonalRelationCommandInput , ArchivePersonalRelationPort } from "@guesant/saberes-application";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class ArchivePersonalRelationAdapter implements ArchivePersonalRelationPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: ArchivePersonalRelationCommandInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const archivedWorkspace = archivePersonalRelation({ ...input, workspace });

    return this.store.savePersonalWorkspace(archivedWorkspace);
  }
}
