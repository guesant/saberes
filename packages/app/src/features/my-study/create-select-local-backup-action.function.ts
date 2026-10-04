import type { LocalBackupActionContext } from "./local-backup-action-context.interface";

export function createSelectLocalBackupAction(
  context: LocalBackupActionContext,
): (file: File) => Promise<void> {
  return async function selectLocalBackup(file: File): Promise<void> {
    context.setError(null);

    try {
      context.setPending({ fileName: file.name, fileSize: file.size, snapshot: await file.text() });

      context.setState("preview");
    } catch {
      context.setError(new Error("Falha ao importar o progresso."));

      context.setState("error");
    }
  };
}
