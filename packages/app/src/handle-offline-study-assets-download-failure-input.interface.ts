import type { OfflineStudyDownloadState } from "./offline-study-download-state.interface";
import type { Dispatch, SetStateAction } from "react";

export interface HandleOfflineStudyAssetsDownloadFailureInput {
  error: unknown;
  setState: Dispatch<SetStateAction<OfflineStudyDownloadState>>;
  signal: AbortSignal;
}
