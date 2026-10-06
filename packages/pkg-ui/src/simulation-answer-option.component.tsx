import { Button as MuiButton } from "@mui/material";
import { UIQuestionStatement } from "./question-statement.component";
import type { UISimulationAnswerOptionProps } from "./simulation-answer-option-props.interface";

export function UISimulationAnswerOption(props: UISimulationAnswerOptionProps) {
  return (
    <MuiButton
      aria-pressed={props.selected}
      data-ui-gap="none"
      data-ui-layout="row"
      disabled={props.disabled}
      variant={props.selected ? "contained" : "outlined"}
      onClick={() => { return props.onSelect(props.option.value || props.option.code || ""); }}
      sx={{ justifyContent: "flex-start", textAlign: "left", textTransform: "none" }}
    >
      {props.option.code}) <UIQuestionStatement>{props.option.text || ""}</UIQuestionStatement>
    </MuiButton>
  );
}
