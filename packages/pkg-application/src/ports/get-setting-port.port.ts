export interface GetSettingPort {
  execute(key: string): Promise<{ value?: unknown } | undefined>;
}
