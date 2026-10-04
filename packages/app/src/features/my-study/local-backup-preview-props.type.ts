import type { LocalBackupPending } from "./local-backup-pending.interface";
import type { ProgressImportStrategy } from "@guesant/saberes-application";

export type LocalBackupPreviewProps = {
  pending: LocalBackupPending;
  onCancel: () => void;
  onImport: (strategy: ProgressImportStrategy) => Promise<void>;
};
