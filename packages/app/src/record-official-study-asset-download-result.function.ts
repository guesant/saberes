import type { DownloadOfficialStudyAssetsSequentiallyInput } from "./download-official-study-assets-sequentially-input.interface";
import type { OfflineStudyAssetDownloadResult } from "./offline-study-asset-download-result.type";

export function recordOfficialStudyAssetDownloadResult(
  result: OfflineStudyAssetDownloadResult,
  input: DownloadOfficialStudyAssetsSequentiallyInput,
): void {
  const asset = input.assets[input.startIndex];

  if (result === "cached" || result === "downloaded") {
    if (asset) {
      input.progress.completedAssets += 1;
      input.progress.completedBytes += asset.bytes;
    }
  }

  if (result === "failed" || result === "quota") {
    input.progress.failedAssets += 1;
    input.progress.quotaExceeded = input.progress.quotaExceeded || result === "quota";
  }

  input.onProgress({ ...input.progress });
}
