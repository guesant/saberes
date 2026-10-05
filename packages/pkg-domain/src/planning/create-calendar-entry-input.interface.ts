import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface CreateCalendarEntryInput {
  workspace: PersonalWorkspace;
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  sourceCaptureId?: string;
  now: string;
}
