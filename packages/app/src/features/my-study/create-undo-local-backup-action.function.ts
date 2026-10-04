import type { LocalBackupActionContext } from "./local-backup-action-context.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createUndoLocalBackupAction(
  context: LocalBackupActionContext,
  undoSnapshot: string | null,
): AsyncAction<[], void> {
  return async function undoLocalBackup(): Promise<void> {
    if (!undoSnapshot) {
      return;
    }

    context.setError(null);

    context.setState("busy");

    try {
      await context.services.progress.importProgress.execute({
        snapshot: undoSnapshot,
        strategy: "replace",
      });

      context.setUndoSnapshot(null);

      await context.queryClient.invalidateQueries({ queryKey: ["progress"] });

      context.setState("success");
    } catch {
      context.setError(new Error("Falha ao desfazer a restauração do progresso."));

      context.setState("error");
    }
  };
}
