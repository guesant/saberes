import { UIContentAlert } from "@guesant/saberes-ui";
import type { AssessmentSessionLauncherFeedbackProps } from "./assessment-session-launcher-feedback-props.interface";

export function AssessmentSessionLauncherFeedback(props: AssessmentSessionLauncherFeedbackProps) {
  if (!props.error) {
    return null;
  }

  return <UIContentAlert severity="error">{props.error}</UIContentAlert>;
}
