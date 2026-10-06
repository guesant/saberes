import { UIContentGroup } from "@guesant/saberes-ui";
import { QuestionOption } from "./question-option.component";
import type { QuestionChoiceAnswerInputProps } from "./question-choice-answer-input-props.type";

export function QuestionChoiceAnswerInput(props: QuestionChoiceAnswerInputProps) {
  const selectedValues = props.value.split(",")
    .filter(Boolean);

  const handleSelect = (value: string) => {
    if (props.questionType !== "multiple_choice") {
      props.onChange(value);

      return;
    }

    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => {
        return selectedValue !== value;
      })
      : [...selectedValues, value];

    props.onChange(nextValues.join(","));
  };

  return (
    <UIContentGroup variant="content">
      {props.options.map((option) => {
        return (
          <QuestionOption
            key={String(option.id)}
            option={option}
            selected={selectedValues.includes(option.canonicalCode)}
            disabled={props.disabled}
            onSelect={handleSelect}
          />
        );
      })}
    </UIContentGroup>
  );
}
