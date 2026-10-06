import { Button as MuiButton } from "@mui/material";
import { UIQuestionStatement } from "./question-statement.component";
import { UISimulationAnswerChoiceIcon } from "./simulation-answer-choice-icon.component";
import type { UISimulationAnswerOptionProps } from "./simulation-answer-option-props.interface";

export function UISimulationAnswerOption(props: UISimulationAnswerOptionProps) {
  return (
    <MuiButton
      aria-pressed={props.selected}
      className="UISimulationAnswerOption-root"
      disabled={props.disabled}
      startIcon={<UISimulationAnswerChoiceIcon selected={props.selected} />}
      variant="outlined"
      onClick={() => { return props.onSelect(props.option.value || props.option.code || ""); }}
      sx={{ textTransform: "none" }}
    >
      {props.option.code}) <UIQuestionStatement>{props.option.text || ""}</UIQuestionStatement>
    </MuiButton>
  );
}
