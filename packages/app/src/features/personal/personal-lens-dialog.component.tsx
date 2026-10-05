import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { PersonalLensFormFields } from "./personal-lens-form-fields.component";
import { usePersonalLensDialogState } from "./use-personal-lens-dialog-state.hook";
import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { PersonalLens } from "@guesant/saberes-application";

export interface PersonalLensDialogProps {
  initialLens?: PersonalLens;

  onDelete?(id: string): Promise<void>;

  onSave(input: SavePersonalLensInput): Promise<void>;

  title: string;

  triggerLabel: string;
}

export function PersonalLensDialog(props: PersonalLensDialogProps) {
  const state = usePersonalLensDialogState({
    initialLens: props.initialLens,
    onDelete: props.onDelete,
    onSave: props.onSave,
  });

  return (
    <>
      <UIButton onClick={state.openDialog} variant={props.initialLens ? "text" : "outlined"}>
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={state.close} open={state.open} title={props.title}>
        <PersonalLensFormFields
          initialLens={props.initialLens}
          name={state.name}
          onDelete={state.deleteLens}
          onNameChange={state.onNameChange}
          onSave={state.save}
          onViewChange={state.onViewChange}
          view={state.view}
        />
      </UIDialog>
    </>
  );
}
