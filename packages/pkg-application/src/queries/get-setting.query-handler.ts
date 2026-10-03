import type { GetSettingPort } from "../ports/index";

export class GetSettingQueryHandler {
  public constructor(private readonly port: GetSettingPort) {}

  public execute(key: string): Promise<{ value?: unknown } | undefined> {
    return this.port.execute(key);
  }
}
