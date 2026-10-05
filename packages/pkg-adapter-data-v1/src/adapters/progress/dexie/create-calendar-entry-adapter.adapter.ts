import { createCalendarEntry } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { CreateCalendarEntryPort , CreateCalendarEntryCommandInput } from "@guesant/saberes-application";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class CreateCalendarEntryAdapter implements CreateCalendarEntryPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: CreateCalendarEntryCommandInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const createdWorkspace = createCalendarEntry({ ...input, workspace });

    return this.store.savePersonalWorkspace(createdWorkspace);
  }
}
