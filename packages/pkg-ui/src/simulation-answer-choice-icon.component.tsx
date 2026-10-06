import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import type { ReactElement } from "react";

export interface UISimulationAnswerChoiceIconProps {
  selected: boolean;
}

export function UISimulationAnswerChoiceIcon(props: UISimulationAnswerChoiceIconProps): ReactElement {
  if (props.selected) {
    return <CheckCircleOutline fontSize="small" />;
  }

  return <RadioButtonUnchecked fontSize="small" />;
}
