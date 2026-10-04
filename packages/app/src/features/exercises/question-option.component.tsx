import { UIHtmlStrongText, UISelectableSurface, UITypography } from "@guesant/saberes-ui";

export type QuestionOptionProps = {
  option: Record<string, unknown>;
  selected: boolean;
  onSelect: (value: string) => void;
};

export function QuestionOption(props: QuestionOptionProps) {
  const { option, selected, onSelect } = props;

  return (
    <UISelectableSurface
      selected={selected}
      variant="outlined"
      onClick={() => onSelect(String(option.code))}
    >
      <UITypography>
        <UIHtmlStrongText>{String(option.code)})</UIHtmlStrongText> {String(option.text)}
      </UITypography>
    </UISelectableSurface>
  );
}
