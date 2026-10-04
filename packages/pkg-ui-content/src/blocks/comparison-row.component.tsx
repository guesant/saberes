import { UIHtmlTableRow } from "@guesant/saberes-ui";
import { UIComparisonDataCell } from "./comparison-data-cell.component";

type UIComparisonRowProps = {
  row: string[];
  rowKey: string;
};

export function UIComparisonRow(props: UIComparisonRowProps) {
  const { row, rowKey } = props;

  return (
    <UIHtmlTableRow>
      {row.map((cell) => {
        return <UIComparisonDataCell key={`${rowKey}-${cell}`} value={cell} />;
      })}
    </UIHtmlTableRow>
  );
}
