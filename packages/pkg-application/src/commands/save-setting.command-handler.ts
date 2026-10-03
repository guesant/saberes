import type { SaveSettingPort } from "../application.ports.ts";

export class SaveSettingCommandHandler {
  public constructor(private readonly port: SaveSettingPort) {}

  public execute(input: Parameters<SaveSettingPort["execute"]>[0]): Promise<void> {
    return this.port.execute(input);
  }
}
