import type { LocalBackupActionContextInput } from "./local-backup-action-context-input.type";
import type { LocalBackupActionContext } from "./local-backup-action-context.interface";
import type { ProgressImportStrategy } from "@guesant/saberes-application";

export function createLocalBackupActionContext(
  input: LocalBackupActionContextInput,
  strategy: ProgressImportStrategy,
): LocalBackupActionContext {
  return { ...input, strategy };
}
