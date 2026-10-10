import type { DownloadOneOfficialStudyAssetInput } from "./download-one-official-study-asset-input.interface";
import type { OfflineStudyAssetDownloadResult } from "./offline-study-asset-download-result.type";

export async function fetchOfficialStudyAssetResponse(
  url: string,
  input: DownloadOneOfficialStudyAssetInput,
): Promise<OfflineStudyAssetDownloadResult> {
  const response = await fetch(url, { signal: input.signal });

  if (!response.ok || response.status !== 200) {
    return "failed";
  }

  await input.cache.put(url, response);

  return "downloaded";
}
