import type { LocalBackupPending } from "./local-backup-pending.interface";
import type { LocalBackupState } from "./local-backup-state.type";
import type { ProgressImportStrategy } from "@guesant/saberes-application";

export interface LocalBackupViewModel {
  cancelImport(): void;

  exportBackup(): Promise<string>;

  handleError(error: Error): void;

  importBackup(file: File): Promise<void>;

  pending: LocalBackupPending | null;

  handleRestoreBackup(strategy: ProgressImportStrategy): Promise<void>;

  undoImport(): Promise<void>;

  canUndoImport: boolean;
  state: LocalBackupState;
  error: Error | null;
}
