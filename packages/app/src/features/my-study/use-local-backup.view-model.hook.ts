import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createLocalBackupActions } from "./create-local-backup-actions.function";
import type { LocalBackupPending } from "./local-backup-pending.interface";
import type { LocalBackupState } from "./local-backup-state.type";
import type { LocalBackupViewModel } from "./local-backup-view-model.interface";

export function useLocalBackupViewModel(): LocalBackupViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const [state, setState] = useState<LocalBackupState>("idle");

  const [error, setError] = useState<Error | null>(null);

  const [pending, setPending] = useState<LocalBackupPending | null>(null);

  const [undoSnapshot, setUndoSnapshot] = useState<string | null>(null);

  const handleError = (nextError: Error): void => {
    setError(nextError);

    setState("error");
  };

  const actions = createLocalBackupActions({
    pending,
    queryClient,
    services,
    setError,
    setPending,
    setUndoSnapshot,
    setState,
    undoSnapshot,
  });

  return {
    ...actions,
    error,
    handleError,
    pending,
    canUndoImport: undoSnapshot !== null,
    state,
  };
}
