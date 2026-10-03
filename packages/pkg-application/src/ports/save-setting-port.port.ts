export interface SaveSettingPort {
  execute(input: { key: string; value: unknown }): Promise<void>;
}
