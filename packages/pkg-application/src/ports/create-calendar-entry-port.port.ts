import type { CreateCalendarEntryCommandInput } from "../models/create-calendar-entry-command-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export interface CreateCalendarEntryPort {
  execute(input: CreateCalendarEntryCommandInput): Promise<PersonalWorkspace>;
}
