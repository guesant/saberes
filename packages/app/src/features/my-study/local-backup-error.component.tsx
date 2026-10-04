import { UIAlert } from "@guesant/saberes-ui";
import type { LocalBackupErrorProps } from "./local-backup-error-props.type";

export function LocalBackupError(props: LocalBackupErrorProps) {
  return <UIAlert severity="error">{props.error.message}</UIAlert>;
}
