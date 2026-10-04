import { LocalBackupError } from "./local-backup-error.component";
import { LocalBackupSuccess } from "./local-backup-success.component";
import { LocalBackupUndo } from "./local-backup-undo.component";
import type { LocalBackupPanelFeedbackProps } from "./local-backup-panel-feedback-props.interface";

export function LocalBackupPanelFeedback(props: LocalBackupPanelFeedbackProps) {
  return (
    <>
      {props.viewModel.state === "success" ? <LocalBackupSuccess /> : null}
      {props.viewModel.error ? <LocalBackupError error={props.viewModel.error} /> : null}
      {props.viewModel.canUndoImport ? (
        <LocalBackupUndo onUndo={props.viewModel.undoImport} />
      ) : null}
    </>
  );
}
