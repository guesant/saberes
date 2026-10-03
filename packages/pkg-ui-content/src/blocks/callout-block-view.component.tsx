import { Alert, Typography } from "@guesant/saberes-ui";
import type { EditorialBlock } from "@guesant/saberes-domain";

type CalloutBlockViewProps = {
  block: Extract<EditorialBlock, { type: "callout" }>;
};

export function CalloutBlockView(props: CalloutBlockViewProps) {
  const { block } = props;

  return (
    <Alert severity={block.severity || "info"} sx={{ my: 3 }}>
      <Typography fontWeight={700}>{block.title}</Typography>

      <Typography sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>{block.content}</Typography>
    </Alert>
  );
}
