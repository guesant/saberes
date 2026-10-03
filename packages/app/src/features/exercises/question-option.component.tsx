import { HtmlStrongText, Paper, Typography } from "@guesant/saberes-ui";

export type QuestionOptionProps = {
  option: Record<string, unknown>;
  selected: boolean;
  onSelect: (value: string) => void;
};

export function QuestionOption(props: QuestionOptionProps) {
  const { option, selected, onSelect } = props;

  return (
    <Paper
      variant="outlined"
      onClick={() => onSelect(String(option.code))}
      sx={{ borderColor: selected ? "primary.main" : undefined }}
    >
      <Typography>
        <HtmlStrongText>{String(option.code)})</HtmlStrongText> {String(option.text)}
      </Typography>
    </Paper>
  );
}
