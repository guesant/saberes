import { HtmlTableRow } from "@guesant/saberes-ui";
import { ComparisonDataCell } from "./comparison-data-cell.component";

type ComparisonRowProps = {
  row: string[];
  rowKey: string;
};

export function ComparisonRow(props: ComparisonRowProps) {
  const { row, rowKey } = props;

  return (
    <HtmlTableRow>
      {row.map((cell) => (
        <ComparisonDataCell key={`${rowKey}-${cell}`} value={cell} />
      ))}
    </HtmlTableRow>
  );
}
