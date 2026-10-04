import { UIHtmlTableHeaderCell } from "@guesant/saberes-ui";

type UIComparisonHeaderCellProps = {
  value: string;
};

export function UIComparisonHeaderCell(props: UIComparisonHeaderCellProps) {
  return <UIHtmlTableHeaderCell>{props.value}</UIHtmlTableHeaderCell>;
}
