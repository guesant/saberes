import { HtmlTableCell } from "@guesant/saberes-ui";

type ComparisonDataCellProps = {
  value: string;
};

export function ComparisonDataCell(props: ComparisonDataCellProps) {
  return <HtmlTableCell>{props.value}</HtmlTableCell>;
}
