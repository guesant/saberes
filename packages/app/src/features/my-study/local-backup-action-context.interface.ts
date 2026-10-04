import type { LocalBackupPending } from "./local-backup-pending.interface";
import type { LocalBackupState } from "./local-backup-state.type";
import type { ApplicationServices, ProgressImportStrategy } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export interface LocalBackupActionContext {
  pending: LocalBackupPending | null;
  queryClient: QueryClient;
  services: ApplicationServices;
  setError: (error: Error | null) => void;
  setPending: (pending: LocalBackupPending | null) => void;
  setState: (state: LocalBackupState) => void;
  strategy: ProgressImportStrategy;
}
