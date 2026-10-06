import { useState } from "react";
import { QuestionConfidenceDialog } from "./question-confidence-dialog.component";
import { QuestionSubmitAction } from "./question-submit-action.component";
import type { QuestionResponseActionProps } from "./question-response-action-props.interface";

export function QuestionResponseAction(props: QuestionResponseActionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirmAnswer = async (): Promise<void> => {
    await props.onSubmit();

    setDialogOpen(false);
  };

  if (props.readOnly) {
    return null;
  }

  return (
    <>
      <QuestionSubmitAction answer={props.answer} onSubmit={() => { setDialogOpen(true); }} submitting={props.submitting} />
      <QuestionConfidenceDialog
        confidence={props.confidence}
        onChange={props.onConfidenceChange}
        onClose={() => { setDialogOpen(false); }}
        onConfirm={handleConfirmAnswer}
        open={dialogOpen}
        submitting={props.submitting}
      />
    </>
  );
}
