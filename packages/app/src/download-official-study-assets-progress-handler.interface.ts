import type { OfflineStudyDownloadProgress } from "./offline-study-download-progress.interface";

export interface DownloadOfficialStudyAssetsProgressHandler {
  (progress: OfflineStudyDownloadProgress): void;
}
