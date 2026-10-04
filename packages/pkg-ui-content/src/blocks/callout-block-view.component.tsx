import { UIAlert, UITypography } from "@guesant/saberes-ui";
import type { EditorialBlock } from "@guesant/saberes-application";

type UICalloutBlockViewProps = {
  block: Extract<EditorialBlock, { type: "callout" }>;
};

export function UICalloutBlockView(props: UICalloutBlockViewProps) {
  const { block } = props;

  return (
    <UIAlert severity={block.severity || "info"} sx={{ my: 3 }}>
      <UITypography fontWeight={700}>{block.title}</UITypography>

      <UITypography sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>{block.content}</UITypography>
    </UIAlert>
  );
}
