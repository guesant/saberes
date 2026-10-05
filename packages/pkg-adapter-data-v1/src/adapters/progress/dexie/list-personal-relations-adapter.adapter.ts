import { listPersonalRelations } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListPersonalRelationsPort , ListPersonalRelationsQueryInput } from "@guesant/saberes-application";
import type { PersonalRelation } from "@guesant/saberes-domain";

export class ListPersonalRelationsAdapter implements ListPersonalRelationsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: ListPersonalRelationsQueryInput): Promise<PersonalRelation[]> {
    const workspace = await this.store.getPersonalWorkspace();

    return listPersonalRelations({ ...input, workspace });
  }
}
