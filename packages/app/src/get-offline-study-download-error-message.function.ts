import type { OfflineStudyDownloadProgress } from "./offline-study-download-progress.interface";

export function getOfflineStudyDownloadErrorMessage(progress: OfflineStudyDownloadProgress): string | null {
  if (progress.failedAssets === 0) {
    return null;
  }

  if (progress.quotaExceeded) {
    return "O armazenamento do navegador pode estar cheio. Libere espaço e tente novamente.";
  }

  return "Parte dos arquivos não foi baixada. Verifique a conexão e tente novamente.";
}
