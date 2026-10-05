import { createPersonalRelation } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { CreatePersonalRelationPort , CreatePersonalRelationCommandInput } from "@guesant/saberes-application";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class CreatePersonalRelationAdapter implements CreatePersonalRelationPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: CreatePersonalRelationCommandInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const createdWorkspace = createPersonalRelation({ ...input, workspace });

    return this.store.savePersonalWorkspace(createdWorkspace);
  }
}
