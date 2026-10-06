import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { CatalogFilterControls } from "./catalog-filter-controls.component";
import type { CatalogFilterControlsProps } from "./catalog-filter-controls-props.type";

export interface CatalogFilterDialogProps extends CatalogFilterControlsProps {
  title: string;
  triggerLabel: string;
}

export function CatalogFilterDialog(props: CatalogFilterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UIButton
        aria-label={props.triggerLabel}
        iconOnly
        iconShape="square"
        onClick={() => { return setOpen(true); }}
        variant="outlined"
      >
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <CatalogFilterControls viewModel={props.viewModel} />
      </UIDialog>
    </>
  );
}
