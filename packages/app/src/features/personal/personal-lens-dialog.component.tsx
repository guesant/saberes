import { UIButton, UIForm, UIDialog } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalLensFormFields } from "./personal-lens-form-fields.component";
import { usePersonalLensDialogState } from "./use-personal-lens-dialog-state.hook";
import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { PersonalLens } from "@guesant/saberes-application";
import type { FormEvent } from "react";

export interface PersonalLensDialogProps {
  initialLens?: PersonalLens;

  onDelete?(id: string): Promise<void>;

  onSave(input: SavePersonalLensInput): Promise<void>;

  title: string;

  triggerLabel: string;
}

export function PersonalLensDialog(props: PersonalLensDialogProps) {
  const { t } = useTranslation();

  const state = usePersonalLensDialogState({
    initialLens: props.initialLens,
    onDelete: props.onDelete,
    onSave: props.onSave,
  });

  const formId = `personal-lens-form-${props.initialLens?.id ?? "new"}`;

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await state.save();
  };

  return (
    <>
      <UIButton onClick={state.openDialog} variant={props.initialLens ? "text" : "outlined"}>
        {props.triggerLabel}
      </UIButton>
      <UIDialog
        confirmForm={formId}
        confirmLabel={t("common.save")}
        onClose={state.close}
        open={state.open}
        title={props.title}
      >
        <UIForm id={formId} onSubmit={submit}>
          <PersonalLensFormFields
            initialLens={props.initialLens}
            name={state.name}
            onDelete={state.deleteLens}
            onNameChange={state.onNameChange}
            onViewChange={state.onViewChange}
            view={state.view}
          />
        </UIForm>
      </UIDialog>
    </>
  );
}
