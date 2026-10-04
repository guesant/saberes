import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface LocalBackupUndoProps {
  onUndo(): Promise<void>;
}

export function LocalBackupUndo(props: LocalBackupUndoProps) {
  const { t } = useTranslation();

  return (
    <UIButton onClick={props.onUndo} variant="outlined">
      {t("backup.undo")}
    </UIButton>
  );
}
