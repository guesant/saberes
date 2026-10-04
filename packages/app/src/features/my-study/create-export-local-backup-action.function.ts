import type { LocalBackupActionContext } from "./local-backup-action-context.interface";

export function createExportLocalBackupAction(
  context: LocalBackupActionContext,
): () => Promise<string> {
  return async function exportLocalBackup(): Promise<string> {
    context.setError(null);

    context.setState("busy");

    try {
      const content = await context.services.progress.exportProgress.execute();

      context.setState("success");

      return content;
    } catch {
      const error = new Error("Falha ao exportar o progresso.");

      context.setError(error);

      context.setState("error");

      throw error;
    }
  };
}
