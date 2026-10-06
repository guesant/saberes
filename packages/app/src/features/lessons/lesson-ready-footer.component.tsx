import { UIContentGroup, UIFormAction, UIDivider } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { LessonReadyFooterProps } from "./lesson-ready-footer-props.interface";

export function LessonReadyFooter(props: LessonReadyFooterProps) {
  const { t } = useTranslation();

  if (!props.practiceHref) {
    return null;
  }

  return (
    <UIContentGroup variant="section">
      <UIDivider />
      <UIFormAction href={props.practiceHref} variant="contained">{t("lesson.practice")}</UIFormAction>
    </UIContentGroup>
  );
}
