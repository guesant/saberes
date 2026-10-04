import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import type { LocalBackupState } from "./local-backup-state.type";
import type { LocalBackupViewModel } from "./local-backup-view-model.interface";

export function useLocalBackupViewModel(): LocalBackupViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const [state, setState] = useState<LocalBackupState>("idle");

  const [error, setError] = useState<Error | null>(null);

  const handleError = (nextError: Error): void => {
    setError(nextError);

    setState("error");
  };

  const exportBackup = async (): Promise<string> => {
    setError(null);

    setState("busy");

    try {
      const content = await services.progress.exportProgress.execute();

      setState("success");

      return content;
    } catch {
      const normalizedError = new Error("Falha ao exportar o progresso.");

      handleError(normalizedError);

      throw normalizedError;
    }
  };

  const importBackup = async (file: File): Promise<void> => {
    setError(null);

    setState("busy");

    try {
      await services.progress.importProgress.execute(await file.text());

      await queryClient.invalidateQueries({ queryKey: ["progress"] });

      setState("success");
    } catch {
      handleError(new Error("Falha ao importar o progresso."));
    }
  };

  return { exportBackup, handleError, importBackup, state, error };
}
