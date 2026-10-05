import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface UpdateCalendarEntryInput {
  workspace: PersonalWorkspace;
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  now: string;
}
