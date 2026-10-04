import {
  UIContentTable,
  UIHtmlTableBody,
  UIHtmlTableHead,
  UIHtmlTableRow,
} from "@guesant/saberes-ui";
import { UIComparisonHeaderCell } from "./comparison-header-cell.component";
import { UIComparisonRow } from "./comparison-row.component";
import type { ComparisonTableBlock } from "@guesant/saberes-application";

type UIComparisonTableBlockViewProps = {
  block: ComparisonTableBlock;
};

export function UIComparisonTableBlockView(props: UIComparisonTableBlockViewProps) {
  const { block } = props;

  return (
    <UIContentTable>
      <UIHtmlTableHead>
        <UIHtmlTableRow>
          {block.headers.map((header) => {
            return <UIComparisonHeaderCell key={header} value={header} />;
          })}
        </UIHtmlTableRow>
      </UIHtmlTableHead>

      <UIHtmlTableBody>
        {block.rows.map((row) => {
          return <UIComparisonRow key={row.join("\u0000")} row={row} rowKey={row.join("\u0000")} />;
        })}
      </UIHtmlTableBody>
    </UIContentTable>
  );
}
