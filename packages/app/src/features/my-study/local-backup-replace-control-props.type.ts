import type { ProgressImportStrategy } from "@guesant/saberes-application";

export type LocalBackupReplaceControlProps = {
  onImport: (strategy: ProgressImportStrategy) => Promise<void>;
};
