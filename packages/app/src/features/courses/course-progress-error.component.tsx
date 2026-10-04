import { UIAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type CourseProgressErrorProps = {
  error: Error;
};

export function CourseProgressError(props: CourseProgressErrorProps) {
  const { t } = useTranslation();

  return (
    <UIAlert severity="warning">
      {t("course.progressError", { message: props.error.message })}
    </UIAlert>
  );
}
