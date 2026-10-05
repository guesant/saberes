import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { StudyCaptureActionButton } from "./study-capture-action-button.component";
import type { StudyCaptureActionsProps } from "./study-capture-actions-props.interface";

export function StudyCaptureActions(props: StudyCaptureActionsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      {props.contentPath ? (
        <StudyCaptureActionButton
          href={props.contentPath}
          label={t("personal.capture.openContent")}
          variant="contained"
        />
      ) : null}
      {props.reviewPath ? (
        <StudyCaptureActionButton
          href={props.reviewPath}
          label={t("personal.capture.openReviews")}
          variant="outlined"
        />
      ) : null}
      <UIButton onClick={props.onUpdateCompletion} variant="text">
        {t("personal.capture.updateCompletion")}
      </UIButton>
      <UIButton onClick={props.onArchive} variant="text">
        {t("personal.capture.archive")}
      </UIButton>
      <UIButton onClick={props.onEdit} variant="text">
        {t("personal.capture.edit")}
      </UIButton>
      <UIButton onClick={props.onDelete} variant="text">
        {t("personal.capture.delete")}
      </UIButton>
    </UIInlineActions>
  );
}
