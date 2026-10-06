import { UIChoiceButton, UIContentGroup, UIInlineActions, UITextField } from "@guesant/saberes-ui";
import { PersonalLensDeleteButton } from "./personal-lens-delete-button.component";
import type { PersonalLens, PersonalLensView } from "@guesant/saberes-application";

export interface PersonalLensFormFieldsProps {
  initialLens?: PersonalLens;

  name: string;

  onDelete(): Promise<void>;

  onNameChange(name: string): void;

  onViewChange(view: PersonalLensView): void;

  view: PersonalLensView;
}

export function PersonalLensFormFields(props: PersonalLensFormFieldsProps) {
  return (
    <UIContentGroup variant="content">
      <UITextField
        label="Nome da lente"
        onChange={(event) => {
          props.onNameChange(event.target.value);
        }}
        value={props.name}
      />
      <UIInlineActions wrap>
        <UIChoiceButton
          type="button"
          onClick={() => {
            props.onViewChange("tree");
          }}
          variant={props.view === "tree" ? "contained" : "outlined"}
        >
          Árvore
        </UIChoiceButton>
        <UIChoiceButton
          type="button"
          onClick={() => {
            props.onViewChange("board");
          }}
          variant={props.view === "board" ? "contained" : "outlined"}
        >
          Board
        </UIChoiceButton>
      </UIInlineActions>
      {props.initialLens ? <PersonalLensDeleteButton onDelete={props.onDelete} /> : null}
    </UIContentGroup>
  );
}
