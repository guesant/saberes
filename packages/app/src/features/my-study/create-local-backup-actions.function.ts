import { createCancelLocalBackupAction } from "./create-cancel-local-backup-action.function";
import { createConfirmLocalBackupAction } from "./create-confirm-local-backup-action.function";
import { createExportLocalBackupAction } from "./create-export-local-backup-action.function";
import { createLocalBackupActionContext } from "./create-local-backup-action-context.function";
import { createSelectLocalBackupAction } from "./create-select-local-backup-action.function";
import { createUndoLocalBackupAction } from "./create-undo-local-backup-action.function";
import type { LocalBackupActionsInput } from "./local-backup-actions-input.interface";
import type { LocalBackupViewModel } from "./local-backup-view-model.interface";

export function createLocalBackupActions(
  input: LocalBackupActionsInput,
): Pick<
  LocalBackupViewModel,
  "cancelImport" | "exportBackup" | "importBackup" | "handleRestoreBackup" | "undoImport"
> {
  const buildContext = (strategy: "merge" | "replace") =>
    createLocalBackupActionContext(input, strategy);

  return {
    cancelImport: createCancelLocalBackupAction(buildContext("replace")),
    exportBackup: createExportLocalBackupAction(buildContext("replace")),
    handleRestoreBackup: (strategy) => createConfirmLocalBackupAction(buildContext(strategy))(),
    importBackup: createSelectLocalBackupAction(buildContext("replace")),
    undoImport: createUndoLocalBackupAction(buildContext("replace"), input.undoSnapshot),
  };
}
