import { formatOfflineStudyDownloadSize } from "./format-offline-study-download-size.function";
import type { OfflineStudyDownloadState } from "./offline-study-download-state.interface";
import type { OfflineStudyDownloadStatus } from "./offline-study-download-status.type";

const statusMessages: Record<Exclude<OfflineStudyDownloadStatus, "downloading" | "error">, string> = {
  complete: "Os PDFs oficiais estão prontos para consulta offline neste dispositivo.",
  offline: "Sem conexão. Os arquivos já baixados continuam disponíveis; o restante será retomado quando a conexão voltar.",
  preparing: "Preparando os PDFs oficiais para estudo offline em segundo plano…",
};

export function getOfflineStudyDownloadMessage(state: OfflineStudyDownloadState): string {
  if (state.status === "downloading") {
    return `Baixando PDFs oficiais em segundo plano: ${state.completedAssets}/${state.totalAssets} arquivos · ${formatOfflineStudyDownloadSize(state.completedBytes)} de ${formatOfflineStudyDownloadSize(state.totalBytes)}.`;
  }

  if (state.status === "error") {
    return state.error ?? "Não foi possível baixar todos os PDFs.";
  }

  return statusMessages[state.status];
}
