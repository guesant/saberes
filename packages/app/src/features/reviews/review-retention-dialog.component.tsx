import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { ReviewRetentionControl } from "./review-retention-control.component";
import type { ReviewRetentionControlProps } from "./review-retention-control-props.type";

export interface ReviewRetentionDialogProps extends ReviewRetentionControlProps {
  title: string;
  triggerLabel: string;
}

export function ReviewRetentionDialog(props: ReviewRetentionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UIButton
        iconOnly={false}
        onClick={() => {
          return setOpen(true);
        }}
        variant="outlined"
      >
        {props.triggerLabel}
      </UIButton>
      <UIDialog
        onClose={() => {
          return setOpen(false);
        }}
        open={open}
        title={props.title}
      >
        <ReviewRetentionControl onChange={props.onChange} retention={props.retention} />
      </UIDialog>
    </>
  );
}
