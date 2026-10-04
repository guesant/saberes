import type { LocalBackupActionContextInput } from "./local-backup-action-context-input.type";

export interface LocalBackupActionsInput extends LocalBackupActionContextInput {
  undoSnapshot: string | null;
}
