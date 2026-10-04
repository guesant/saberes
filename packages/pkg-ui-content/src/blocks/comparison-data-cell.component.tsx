import { UIHtmlTableCell } from "@guesant/saberes-ui";

type UIComparisonDataCellProps = {
  value: string;
};

export function UIComparisonDataCell(props: UIComparisonDataCellProps) {
  return <UIHtmlTableCell>{props.value}</UIHtmlTableCell>;
}
