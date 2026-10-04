import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CourseAssessmentButtonProps } from "./course-assessment-button-props.type";

export function CourseAssessmentButton(props: CourseAssessmentButtonProps) {
  const { t } = useTranslation();

  return (
    <UIButton component={Link} size="small" to={`/avaliacoes/${props.assessmentId}`}>
      {t("assessment.practice")}
    </UIButton>
  );
}
