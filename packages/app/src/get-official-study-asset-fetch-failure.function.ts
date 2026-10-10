import type { OfflineStudyAssetDownloadResult } from "./offline-study-asset-download-result.type";

export function getOfficialStudyAssetFetchFailure(
  error: unknown,
  signal: AbortSignal,
): OfflineStudyAssetDownloadResult {
  if (signal.aborted) {
    return "aborted";
  }

  if (error instanceof DOMException && error.name === "QuotaExceededError") {
    return "quota";
  }

  return "failed";
}
