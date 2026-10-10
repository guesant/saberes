import { fetchOfficialStudyAssetResponse } from "./fetch-official-study-asset-response.function";
import { getOfficialStudyAssetFetchFailure } from "./get-official-study-asset-fetch-failure.function";
import { getOfficialStudyAssetUrl } from "./get-official-study-asset-url.function";
import { hasCachedOfficialStudyAsset } from "./has-cached-official-study-asset.function";
import type { DownloadOneOfficialStudyAssetInput } from "./download-one-official-study-asset-input.interface";
import type { OfflineStudyAssetDownloadResult } from "./offline-study-asset-download-result.type";

export async function downloadOneOfficialStudyAsset(
  input: DownloadOneOfficialStudyAssetInput,
): Promise<OfflineStudyAssetDownloadResult> {
  const url = getOfficialStudyAssetUrl(input.asset.appUrlSuffix);

  if (input.signal.aborted) {
    return "aborted";
  }

  return hasCachedOfficialStudyAsset(url, input.cache)
    .then((isCached) => {
      if (isCached) {
        return "cached";
      }

      return fetchOfficialStudyAssetResponse(url, input);
    })
    .catch((error: unknown) => {return getOfficialStudyAssetFetchFailure(error, input.signal);});
}
