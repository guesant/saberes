import type { OfflineStudyDownloadProgress } from "./offline-study-download-progress.interface";
import type { OfflineStudyDownloadState } from "./offline-study-download-state.interface";
import type { Dispatch, SetStateAction } from "react";

export interface CompleteOfflineStudyAssetsDownloadInput {
  progress: OfflineStudyDownloadProgress;
  setState: Dispatch<SetStateAction<OfflineStudyDownloadState>>;
  signal: AbortSignal;
}
