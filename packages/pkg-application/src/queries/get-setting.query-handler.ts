import type { SettingRecord } from "../models/index";
import type { GetSettingPort } from "../ports/index";

export class GetSettingQueryHandler {
  public constructor(private readonly port: GetSettingPort) {}

  public execute(key: string): Promise<SettingRecord | undefined> {
    return this.port.execute(key);
  }
}
