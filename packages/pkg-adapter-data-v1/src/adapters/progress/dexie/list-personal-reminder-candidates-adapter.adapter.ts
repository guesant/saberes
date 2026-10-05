import { listPersonalReminderCandidates } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListPersonalReminderCandidatesPort , ListPersonalReminderCandidatesQueryInput } from "@guesant/saberes-application";
import type { PersonalReminderCandidate } from "@guesant/saberes-domain";

export class ListPersonalReminderCandidatesAdapter implements ListPersonalReminderCandidatesPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(
    input: ListPersonalReminderCandidatesQueryInput,
  ): Promise<PersonalReminderCandidate[]> {
    const workspace = await this.store.getPersonalWorkspace();

    return listPersonalReminderCandidates({ now: input.now, workspace });
  }
}
