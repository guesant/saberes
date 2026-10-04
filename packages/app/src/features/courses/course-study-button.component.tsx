import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type CourseStudyButtonProps = {
  lessonId: unknown;
};

export function CourseStudyButton(props: CourseStudyButtonProps) {
  const { t } = useTranslation();

  return (
    <UIButton component={Link} to={`/licoes/${String(props.lessonId)}`}>
      {t("common.study")}
    </UIButton>
  );
}
