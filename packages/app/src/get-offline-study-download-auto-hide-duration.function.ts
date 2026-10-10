import type { OfflineStudyDownloadState } from "./offline-study-download-state.interface";

export function getOfflineStudyDownloadAutoHideDuration(state: OfflineStudyDownloadState): number | null {
  if (state.status === "complete") {
    return 8000;
  }

  return null;
}
