import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AcademicDisciplineEditDialog } from "./academic-discipline-edit-dialog.component";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";
import type { AcademicDiscipline } from "@guesant/saberes-application";

export interface AcademicDisciplineItemActionsProps {
  discipline: AcademicDiscipline;

  onRemove(id: string): Promise<void>;

  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
}

export function AcademicDisciplineItemActions(props: AcademicDisciplineItemActionsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      <AcademicDisciplineEditDialog
        discipline={props.discipline}
        onSave={props.onSave}
        title={t("academic.edit")}
        triggerLabel={t("academic.edit")}
      />
      <UIButton onClick={() => { return props.onRemove(props.discipline.id); }} variant="text">
        {t("academic.remove")}
      </UIButton>
    </UIInlineActions>
  );
}
