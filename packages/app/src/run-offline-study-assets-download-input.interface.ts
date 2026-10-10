import type { Dispatch, SetStateAction } from "react";
import type { OfflineStudyDownloadState } from "./offline-study-download-state.interface";

export interface RunOfflineStudyAssetsDownloadInput {
  controller: AbortController;
  setState: Dispatch<SetStateAction<OfflineStudyDownloadState>>;
}
