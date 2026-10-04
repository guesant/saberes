import type { LocalBackupActionContext } from "./local-backup-action-context.interface";

export function createConfirmLocalBackupAction(
  context: LocalBackupActionContext,
): () => Promise<void> {
  return async function confirmLocalBackup(): Promise<void> {
    if (!context.pending) {
      return;
    }

    context.setError(null);

    context.setState("busy");

    try {
      await context.services.progress.importProgress.execute({
        snapshot: context.pending.snapshot,
        strategy: context.strategy,
      });

      await context.queryClient.invalidateQueries({ queryKey: ["progress"] });

      context.setPending(null);

      context.setState("success");
    } catch {
      context.setError(new Error("Falha ao importar o progresso."));

      context.setState("error");
    }
  };
}
