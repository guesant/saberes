export interface OfflineStudyDownloadProgress {
  completedAssets: number;
  completedBytes: number;
  failedAssets: number;
  quotaExceeded: boolean;
  totalAssets: number;
  totalBytes: number;
}
