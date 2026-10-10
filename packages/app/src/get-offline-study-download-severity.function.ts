import type { OfflineStudyDownloadState } from "./offline-study-download-state.interface";

export function getOfflineStudyDownloadSeverity(state: OfflineStudyDownloadState): "info" | "success" | "warning" {
  if (state.status === "complete") {
    return "success";
  }

  if (state.status === "error") {
    return "warning";
  }

  return "info";
}
