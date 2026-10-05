import type { CreateCalendarEntryCommandInput } from "../models/create-calendar-entry-command-input.interface";
import type { CreateCalendarEntryPort } from "../ports/create-calendar-entry-port.port";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class CreateCalendarEntryCommandHandler {
  public constructor(private readonly port: CreateCalendarEntryPort) {}

  public execute(input: CreateCalendarEntryCommandInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
