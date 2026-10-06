import { UIContentGroup, UIHtmlStrongText, UISelectableSurface } from "@guesant/saberes-ui";
import { UIQuestionRichText } from "@guesant/saberes-ui-content";
import type { QuestionOptionReadModel } from "@guesant/saberes-application";

export type QuestionOptionProps = {
  option: QuestionOptionReadModel;
  selected: boolean;
  onSelect(value: string): void;
};

export function QuestionOption(props: QuestionOptionProps) {
  const { option, selected, onSelect } = props;

  return (
    <UISelectableSurface
      interactive
      aria-pressed={selected}
      selected={selected}
      variant="outlined"
      onClick={() => {
        return onSelect(option.canonicalCode);
      }}
    >
      <UIContentGroup variant="tight">
        <UIHtmlStrongText>{option.code})</UIHtmlStrongText>
        <UIQuestionRichText text={option.text} />
      </UIContentGroup>
    </UISelectableSurface>
  );
}
