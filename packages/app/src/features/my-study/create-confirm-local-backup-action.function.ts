import type { LocalBackupActionContext } from "./local-backup-action-context.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createConfirmLocalBackupAction(
  context: LocalBackupActionContext,
): AsyncAction<[], void> {
  return async function confirmLocalBackup(): Promise<void> {
    if (!context.pending) {
      return;
    }

    context.setError(null);

    context.setState("busy");

    try {
      const undoSnapshot =
        context.strategy === "replace"
          ? await context.services.progress.exportProgress.execute()
          : null;

      await context.services.progress.importProgress.execute({
        snapshot: context.pending.snapshot,
        strategy: context.strategy,
      });

      context.setUndoSnapshot(undoSnapshot);

      await context.queryClient.invalidateQueries({ queryKey: ["progress"] });

      context.setPending(null);

      context.setState("success");
    } catch {
      context.setError(new Error("Falha ao importar o progresso."));

      context.setState("error");
    }
  };
}
