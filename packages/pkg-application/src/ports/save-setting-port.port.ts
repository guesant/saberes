import type { SaveSettingInput } from "../models/index";

export interface SaveSettingPort {
  execute(input: SaveSettingInput): Promise<void>;
}
