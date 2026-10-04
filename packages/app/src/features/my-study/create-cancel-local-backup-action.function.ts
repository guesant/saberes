import type { LocalBackupActionContext } from "./local-backup-action-context.interface";
import type { SyncAction } from "../../types/sync-action.type";

export function createCancelLocalBackupAction(context: LocalBackupActionContext): SyncAction {
  return function cancelLocalBackup(): void {
    context.setPending(null);

    context.setError(null);

    context.setState("idle");
  };
}
