import type { SaveFocusSessionPort } from "../ports/index";
import type { FocusSession } from "@guesant/saberes-domain";

export class SaveFocusSessionCommandHandler {
  public constructor(private readonly port: SaveFocusSessionPort) {}

  public execute(session: FocusSession): Promise<FocusSession> {
    return this.port.execute(session);
  }
}
