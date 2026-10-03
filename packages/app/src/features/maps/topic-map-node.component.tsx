import { Button, CheckCircleIcon, Stack, Step, StepButton, Typography } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";

export type TopicMapNodeProps = {
  node: Record<string, unknown>;
};

export function TopicMapNode(props: TopicMapNodeProps) {
  const { node } = props;

  return (
    <Step>
      <StepButton icon={node.is_milestone ? <CheckCircleIcon color="success" /> : undefined}>
        <Stack alignItems="flex-start">
          <Typography fontWeight={700}>{String(node.label)}</Typography>

          <Typography variant="body2">{String(node.description || "")}</Typography>

          <Button component={Link} to={`/topicos/${String(node.slug)}`} size="small">
            Abrir tópico
          </Button>
        </Stack>
      </StepButton>
    </Step>
  );
}
