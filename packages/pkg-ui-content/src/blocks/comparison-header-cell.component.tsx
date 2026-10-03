import { HtmlTableHeaderCell } from "@guesant/saberes-ui";

type ComparisonHeaderCellProps = {
  value: string;
};

export function ComparisonHeaderCell(props: ComparisonHeaderCellProps) {
  return <HtmlTableHeaderCell>{props.value}</HtmlTableHeaderCell>;
}
