export async function hasCachedOfficialStudyAsset(url: string, cache: Cache): Promise<boolean> {
  return Boolean(await cache.match(url));
}
