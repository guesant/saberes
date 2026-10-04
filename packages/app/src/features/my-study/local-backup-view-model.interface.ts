import type { LocalBackupState } from "./local-backup-state.type";

export interface LocalBackupViewModel {
  exportBackup: () => Promise<string>;
  handleError: (error: Error) => void;
  importBackup: (file: File) => Promise<void>;
  state: LocalBackupState;
  error: Error | null;
}
