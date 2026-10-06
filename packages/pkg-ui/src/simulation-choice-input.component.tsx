import { UIContentGroup } from "./content-group.component";
import { UISimulationAnswerOption } from "./simulation-answer-option.component";
import type { UISimulationChoiceInputProps } from "./simulation-choice-input-props.interface";

export function UISimulationChoiceInput(props: UISimulationChoiceInputProps) {
  const selected = props.value.split(",")
    .filter(Boolean);

  const select = (value: string) => {
    if (props.questionType !== "multiple_choice") {
      props.onChange(value);

      return;
    }

    const next = selected.includes(value)
      ? selected.filter((item) => { return item !== value; })
      : [...selected, value];

    props.onChange(next.join(","));
  };

  return (
    <UIContentGroup>
      {props.options.map((option) => {
        return <UISimulationAnswerOption key={option.id || option.code} option={option} selected={selected.includes(option.value || option.code || "")} disabled={props.disabled} onSelect={select} />;
      })}
    </UIContentGroup>
  );
}
