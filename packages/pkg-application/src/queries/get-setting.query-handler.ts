import type { GetSettingPort } from "../application.ports.ts";

export class GetSettingQueryHandler {
  public constructor(private readonly port: GetSettingPort) {}

  public execute(key: string): Promise<{ value?: unknown } | undefined> {
    return this.port.execute(key);
  }
}
