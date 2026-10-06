import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalBacklinksSection } from "./personal-backlinks-section.component";
import type { PersonalBacklinksSectionProps } from "./personal-backlinks-section-props.interface";

export interface PersonalBacklinksDialogProps extends PersonalBacklinksSectionProps {
  title: string;
  triggerLabel: string;
}

export function PersonalBacklinksDialog(props: PersonalBacklinksDialogProps) {
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
        <PersonalBacklinksSection
          onArchive={props.onArchive}
          onRestore={props.onRestore}
          relations={props.relations}
          selection={props.selection}
          workspace={props.workspace}
        />
      </UIDialog>
    </>
  );
}
