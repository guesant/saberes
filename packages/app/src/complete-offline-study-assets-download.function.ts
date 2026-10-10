import { getOfflineStudyDownloadErrorMessage } from "./get-offline-study-download-error-message.function";
import type { CompleteOfflineStudyAssetsDownloadInput } from "./complete-offline-study-assets-download-input.interface";
import type { OfflineStudyDownloadStatus } from "./offline-study-download-status.type";

export function completeOfflineStudyAssetsDownload(input: CompleteOfflineStudyAssetsDownloadInput): void {
  if (input.signal.aborted) {
    return;
  }

  let status: OfflineStudyDownloadStatus = "complete";

  if (input.progress.failedAssets > 0) {
    status = "error";
  }

  input.setState({
    ...input.progress,
    error: getOfflineStudyDownloadErrorMessage(input.progress),
    status,
  });
}
