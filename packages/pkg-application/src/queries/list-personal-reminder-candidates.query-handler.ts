import type { ListPersonalReminderCandidatesQueryInput } from "../models/list-personal-reminder-candidates-query-input.interface";
import type { ListPersonalReminderCandidatesPort } from "../ports/list-personal-reminder-candidates-port.port";
import type { PersonalReminderCandidate } from "@guesant/saberes-domain";

export class ListPersonalReminderCandidatesQueryHandler {
  public constructor(private readonly port: ListPersonalReminderCandidatesPort) {}

  public execute(
    input: ListPersonalReminderCandidatesQueryInput,
  ): Promise<PersonalReminderCandidate[]> {
    return this.port.execute(input);
  }
}
