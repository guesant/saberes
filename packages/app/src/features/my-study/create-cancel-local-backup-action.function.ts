import type { LocalBackupActionContext } from "./local-backup-action-context.interface";

export function createCancelLocalBackupAction(context: LocalBackupActionContext): () => void {
  return function cancelLocalBackup(): void {
    context.setPending(null);

    context.setError(null);

    context.setState("idle");
  };
}
