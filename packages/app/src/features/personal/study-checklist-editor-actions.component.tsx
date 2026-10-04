import { UIButton } from "@guesant/saberes-ui";
import type { StudyChecklistEditorActionsProps } from "./study-checklist-editor-actions-props.interface";

export function StudyChecklistEditorActions(props: StudyChecklistEditorActionsProps) {
  return (
    <>
      <props.form.Subscribe
        selector={(state) => {
          return [state.canSubmit, state.isSubmitting];
        }}
      >
        {([canSubmit, isSubmitting]) => {
          return (
            <UIButton disabled={!canSubmit || isSubmitting} type="submit" variant="contained">
              {isSubmitting ? "..." : props.createLabel}
            </UIButton>
          );
        }}
      </props.form.Subscribe>
      <UIButton onClick={props.onCancel} type="button" variant="text">
        Cancelar
      </UIButton>
    </>
  );
}
