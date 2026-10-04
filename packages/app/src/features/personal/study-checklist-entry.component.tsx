import { UIButton } from "@guesant/saberes-ui";

export interface StudyChecklistEntryProps {
  canMoveDown: boolean;

  canMoveUp: boolean;

  label: string;

  onMoveDown(): Promise<void>;

  onMoveUp(): Promise<void>;

  onUpdate(): Promise<void>;
}

export function StudyChecklistEntry(props: StudyChecklistEntryProps) {
  return (
    <>
      <UIButton onClick={props.onUpdate} variant="text">
        {props.label}
      </UIButton>
      <UIButton disabled={!props.canMoveUp} onClick={props.onMoveUp} variant="text">
        Subir
      </UIButton>
      <UIButton disabled={!props.canMoveDown} onClick={props.onMoveDown} variant="text">
        Descer
      </UIButton>
    </>
  );
}
