import { UITypography } from "@guesant/saberes-ui";
import type { ReactNode } from "react";

export type QuestionStimulusTitleProps = {
  title: string;
};

export function QuestionStimulusTitle(props: QuestionStimulusTitleProps): ReactNode {
  if (!props.title) {
    return null;
  }

  return <UITypography variant="h6">{props.title}</UITypography>;
}
