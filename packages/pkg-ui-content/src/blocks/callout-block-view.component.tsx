import { UIContentAlert, UIContentText } from "@guesant/saberes-ui";
import type { CalloutBlock } from "@guesant/saberes-application";

type UICalloutBlockViewProps = {
  block: CalloutBlock;
};

export function UICalloutBlockView(props: UICalloutBlockViewProps) {
  const { block } = props;

  return (
    <UIContentAlert severity={block.severity || "info"}>
      <UIContentText variant="title">{block.title}</UIContentText>

      <UIContentText preserveWhitespace variant="body">
        {block.content}
      </UIContentText>
    </UIContentAlert>
  );
}
