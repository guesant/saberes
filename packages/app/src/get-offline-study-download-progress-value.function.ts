import type { OfflineStudyDownloadState } from "./offline-study-download-state.interface";

export function getOfflineStudyDownloadProgressValue(state: OfflineStudyDownloadState): number | null {
  if (state.status !== "downloading" || state.totalAssets === 0) {
    return null;
  }

  return state.completedAssets / state.totalAssets * 100;
}
