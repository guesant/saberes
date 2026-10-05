import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { CatalogSavedFiltersContent } from "./catalog-saved-filters-content.component";
import type { CatalogSavedFiltersProps } from "./catalog-saved-filters-props.type";

export interface CatalogSavedFiltersDialogProps extends CatalogSavedFiltersProps {
  title: string;
  triggerLabel: string;
}

export function CatalogSavedFiltersDialog(props: CatalogSavedFiltersDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="outlined">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <CatalogSavedFiltersContent
          error={props.error}
          filters={props.filters}
          onDelete={props.onDelete}
          onRetry={props.onRetry}
          onSave={props.onSave}
          onSelect={props.onSelect}
          onUpdate={props.onUpdate}
          saveError={props.saveError}
          saving={props.saving}
          state={props.state}
        />
      </UIDialog>
    </>
  );
}
