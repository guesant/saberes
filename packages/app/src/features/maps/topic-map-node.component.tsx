import { UIContentGroup, UIListItemButton, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getTopicLearningStateKey } from "./get-topic-learning-state-key.function";
import { TopicMapNodeDescription } from "./topic-map-node-description.component";
import { TopicMapNodeMilestoneIcon } from "./topic-map-node-milestone-icon.component";

export type TopicMapNodeProps = {
  node: Record<string, unknown>;
};

export function TopicMapNode(props: TopicMapNodeProps) {
  const { node } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const openTopic = () => {
    navigate(`/topicos/${String(node.slug)}`);
  };

  return (
    <UIListItemButton aria-label={`Abrir tópico ${String(node.label)}`} divider onClick={openTopic}>
      <TopicMapNodeMilestoneIcon milestone={Boolean(node.is_milestone)} />
      <UIContentGroup variant="content">
        <UITypography fontWeight={700}>{String(node.label)}</UITypography>
        <UIContentGroup variant="tight">
          <TopicMapNodeDescription description={String(node.description || "")} />
          <UITypography variant="caption">
            {t("map.mastery", {
              percentage: String(node.mastery_percentage || 0),
              state: t(getTopicLearningStateKey(node.learning_state)),
            })}
          </UITypography>
        </UIContentGroup>
      </UIContentGroup>
    </UIListItemButton>
  );
}
