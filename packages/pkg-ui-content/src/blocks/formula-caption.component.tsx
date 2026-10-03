import { Typography } from "@guesant/saberes-ui";

type FormulaCaptionProps = {
  caption?: string;
};

export function FormulaCaption(props: FormulaCaptionProps) {
  return <Typography variant="caption">{props.caption}</Typography>;
}
