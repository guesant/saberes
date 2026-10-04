import type { LocalBackupActionContext } from "./local-backup-action-context.interface";

export type LocalBackupActionContextInput = Omit<LocalBackupActionContext, "strategy">;
