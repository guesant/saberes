import type { SettingRecord } from "../models/index";

export interface GetSettingPort {
  execute(key: string): Promise<SettingRecord | undefined>;
}
