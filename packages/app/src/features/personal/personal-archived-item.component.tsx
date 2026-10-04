import { UIButton, UIContentGroup, UITypography } from "@guesant/saberes-ui";

export interface PersonalArchivedItemProps {
  title: string;
  onRestore(): Promise<void>;
}

export function PersonalArchivedItem(props: PersonalArchivedItemProps) {
  return (
    <UIContentGroup variant="tight">
      <UITypography color="text.secondary">{props.title}</UITypography>
      <UIButton onClick={props.onRestore} variant="text">
        Restaurar
      </UIButton>
    </UIContentGroup>
  );
}
