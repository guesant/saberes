import type { ListFocusSessionsPort } from "../ports/index";
import type { FocusSession } from "@guesant/saberes-domain";

export class ListFocusSessionsQueryHandler {
  public constructor(private readonly port: ListFocusSessionsPort) {}

  public execute(): Promise<FocusSession[]> {
    return this.port.execute();
  }
}
