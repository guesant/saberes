export interface ReloadTopicMapDataInput {
  reloadMap: () => Promise<unknown>;
  reloadMastery: () => Promise<unknown>;
}

export async function reloadTopicMapData(input: ReloadTopicMapDataInput): Promise<void> {
  await Promise.all([input.reloadMap(), input.reloadMastery()]);
}
