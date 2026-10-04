import {
  UIBox,
  UIHtmlTableBody,
  UIHtmlTableHead,
  UIHtmlTableRow,
  UITable,
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
    <UIBox sx={{ overflowX: "auto", my: 3 }}>
      <UITable sx={{ width: "100%", borderCollapse: "collapse" }}>
        <UIHtmlTableHead>
          <UIHtmlTableRow>
            {block.headers.map((header) => (
              <UIComparisonHeaderCell key={header} value={header} />
            ))}
          </UIHtmlTableRow>
        </UIHtmlTableHead>

        <UIHtmlTableBody>
          {block.rows.map((row) => (
            <UIComparisonRow key={row.join("\u0000")} row={row} rowKey={row.join("\u0000")} />
          ))}
        </UIHtmlTableBody>
      </UITable>
    </UIBox>
  );
}
