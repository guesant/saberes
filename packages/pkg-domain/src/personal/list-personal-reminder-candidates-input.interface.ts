import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ListPersonalReminderCandidatesInput {
  now: string;
  workspace: PersonalWorkspace;
}
