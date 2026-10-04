import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createCancelLocalBackupAction } from "./create-cancel-local-backup-action.function";
import { createConfirmLocalBackupAction } from "./create-confirm-local-backup-action.function";
import { createExportLocalBackupAction } from "./create-export-local-backup-action.function";
import { createSelectLocalBackupAction } from "./create-select-local-backup-action.function";
import type { LocalBackupPending } from "./local-backup-pending.interface";
import type { LocalBackupState } from "./local-backup-state.type";
import type { LocalBackupViewModel } from "./local-backup-view-model.interface";
import type { ProgressImportStrategy } from "@guesant/saberes-application";

export function useLocalBackupViewModel(): LocalBackupViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const [state, setState] = useState<LocalBackupState>("idle");

  const [error, setError] = useState<Error | null>(null);

  const [pending, setPending] = useState<LocalBackupPending | null>(null);

  const handleError = (nextError: Error): void => {
    setError(nextError);

    setState("error");
  };

  const buildLocalBackupActionContext = (strategy: ProgressImportStrategy) => ({
    pending,
    queryClient,
    services,
    setError,
    setPending,
    setState,
    strategy,
  });

  const exportBackup = createExportLocalBackupAction(buildLocalBackupActionContext("replace"));

  const importBackup = createSelectLocalBackupAction(buildLocalBackupActionContext("replace"));

  const handleRestoreBackup = (strategy: ProgressImportStrategy): Promise<void> =>
    createConfirmLocalBackupAction(buildLocalBackupActionContext(strategy))();

  const cancelImport = createCancelLocalBackupAction(buildLocalBackupActionContext("replace"));

  return {
    cancelImport,
    error,
    exportBackup,
    handleError,
    importBackup,
    pending,
    handleRestoreBackup,
    state,
  };
}
