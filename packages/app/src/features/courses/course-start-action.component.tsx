import { UIButton, UICheckCircleIcon, UIPlayArrowIcon } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ActionFeedback } from "../../components/action-feedback.component";
import type { CourseStartActionProps } from "./course-start-action-props.interface";

export function CourseStartAction(props: CourseStartActionProps) {
  const { t } = useTranslation();

  let label = props.started ? t("course.continue") : t("course.start");

  if (props.startState === "saving") {
    label = t("common.saving");
  }

  return (
    <>
      <UIButton
        disabled={props.startState === "saving"}
        onClick={props.onStart}
        startIcon={props.started ? <UICheckCircleIcon /> : <UIPlayArrowIcon />}
        variant="contained"
      >
        {label}
      </UIButton>
      <ActionFeedback error={props.startError} state={props.startState} />
    </>
  );
}
