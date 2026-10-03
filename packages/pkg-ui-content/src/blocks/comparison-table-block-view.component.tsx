import { Box, HtmlTableBody, HtmlTableHead, HtmlTableRow, Table } from "@guesant/saberes-ui";
import { ComparisonHeaderCell } from "./comparison-header-cell.component";
import { ComparisonRow } from "./comparison-row.component";
import type { EditorialBlock } from "@guesant/saberes-domain";

type ComparisonTableBlockViewProps = {
  block: Extract<EditorialBlock, { type: "comparison_table" }>;
};

export function ComparisonTableBlockView(props: ComparisonTableBlockViewProps) {
  const { block } = props;

  return (
    <Box sx={{ overflowX: "auto", my: 3 }}>
      <Table sx={{ width: "100%", borderCollapse: "collapse" }}>
        <HtmlTableHead>
          <HtmlTableRow>
            {block.headers.map((header) => (
              <ComparisonHeaderCell key={header} value={header} />
            ))}
          </HtmlTableRow>
        </HtmlTableHead>

        <HtmlTableBody>
          {block.rows.map((row) => (
            <ComparisonRow key={row.join("\u0000")} row={row} rowKey={row.join("\u0000")} />
          ))}
        </HtmlTableBody>
      </Table>
    </Box>
  );
}
