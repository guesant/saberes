import { UIButton } from "@guesant/saberes-ui";

export interface PersonalLensDeleteButtonProps {
  onDelete(): Promise<void>;
}

export function PersonalLensDeleteButton(props: PersonalLensDeleteButtonProps) {
  return (
    <UIButton onClick={props.onDelete} variant="text">
      Excluir lente
    </UIButton>
  );
}
