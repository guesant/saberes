import type { OfflineStudyDownloadState } from "./offline-study-download-state.interface";

export function getOfflineStudyDownloadAutoHideDuration(
  state: OfflineStudyDownloadState,
): number | null {
  if (state.status === "error") {
    return null;
  }

  return 8000;
}
