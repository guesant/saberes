import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { CatalogSavedFilterEditForm } from "./catalog-saved-filter-edit-form.component";
import type { CatalogSavedFilterEditDialogProps } from "./catalog-saved-filter-edit-dialog-props.interface";

export function CatalogSavedFilterEditDialog(props: CatalogSavedFilterEditDialogProps) {
  const [open, setOpen] = useState(false);

  const save = async (name: string): Promise<void> => {
    await props.onSave(props.filter, name);

    setOpen(false);
  };

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="text">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <CatalogSavedFilterEditForm initialName={props.filter.name} onSave={save} />
      </UIDialog>
    </>
  );
}
