import type { OfflineStudyDownloadProgress } from "./offline-study-download-progress.interface";
import type { OfflineStudyDownloadStatus } from "./offline-study-download-status.type";

export interface OfflineStudyDownloadState extends OfflineStudyDownloadProgress {
  error: string | null;
  status: OfflineStudyDownloadStatus;
}
