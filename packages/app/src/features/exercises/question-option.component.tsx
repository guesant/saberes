import { UIChoiceOptionContent, UIHtmlStrongText, UISelectableSurface } from "@guesant/saberes-ui";
import { UIQuestionRichText } from "@guesant/saberes-ui-content";
import type { QuestionOptionReadModel } from "@guesant/saberes-application";

export type QuestionOptionProps = {
  option: QuestionOptionReadModel;
  selected: boolean;
  disabled?: boolean;
  onSelect(value: string): void;
};

export function QuestionOption(props: QuestionOptionProps) {
  const { option, selected, onSelect } = props;

  return (
    <UISelectableSurface
      interactive
      disabled={props.disabled}
      aria-pressed={selected}
      selected={selected}
      onClick={() => {
        return onSelect(option.canonicalCode);
      }}
    >
      <UIChoiceOptionContent marker={<UIHtmlStrongText>{option.code})</UIHtmlStrongText>}>
        <UIQuestionRichText text={option.text} />
      </UIChoiceOptionContent>
    </UISelectableSurface>
  );
}
