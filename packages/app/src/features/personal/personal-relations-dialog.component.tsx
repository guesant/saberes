import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalRelationsSection } from "./personal-relations-section.component";
import type { PersonalRelationsSectionProps } from "./personal-relations-section-props.interface";

export interface PersonalRelationsDialogProps extends PersonalRelationsSectionProps {
  title: string;
  triggerLabel: string;
}

export function PersonalRelationsDialog(props: PersonalRelationsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="outlined">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <PersonalRelationsSection
          onArchive={props.onArchive}
          onCreate={props.onCreate}
          onRestore={props.onRestore}
          relations={props.relations}
          selection={props.selection}
          workspace={props.workspace}
        />
      </UIDialog>
    </>
  );
}
