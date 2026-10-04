import { UITypography } from "@guesant/saberes-ui";

type UIFormulaCaptionProps = {
  caption?: string;
};

export function UIFormulaCaption(props: UIFormulaCaptionProps) {
  return <UITypography variant="caption">{props.caption}</UITypography>;
}
