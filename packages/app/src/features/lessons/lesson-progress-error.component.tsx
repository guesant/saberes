import { UIAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type LessonProgressErrorProps = {
  error: Error;
};

export function LessonProgressError(props: LessonProgressErrorProps) {
  const { t } = useTranslation();

  return (
    <UIAlert severity="warning">
      {t("lesson.progressError", { message: props.error.message })}
    </UIAlert>
  );
}
