import type { ListPersonalReminderCandidatesQueryInput } from "../models/list-personal-reminder-candidates-query-input.interface";
import type { PersonalReminderCandidate } from "@guesant/saberes-domain";

export interface ListPersonalReminderCandidatesPort {
  execute(input: ListPersonalReminderCandidatesQueryInput): Promise<PersonalReminderCandidate[]>;
}
