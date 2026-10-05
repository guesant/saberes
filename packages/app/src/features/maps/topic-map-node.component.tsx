import {
  UICheckCircleIcon,
  UIContentGroup,
  UIStep,
  UIStepButton,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
    <UIStep>
      <UIStepButton
        aria-label={`Abrir tópico ${String(node.label)}`}
        icon={node.is_milestone ? <UICheckCircleIcon color="success" /> : undefined}
        onClick={openTopic}
      >
        <UIContentGroup variant="content">
          <UITypography fontWeight={700}>{String(node.label)}</UITypography>

          <UITypography variant="body2">{String(node.description || "")}</UITypography>

          <UITypography variant="caption">
            {t("map.mastery", {
              percentage: String(node.mastery_percentage || 0),
              state: String(node.learning_state),
            })}
          </UITypography>
        </UIContentGroup>
      </UIStepButton>
    </UIStep>
  );
}
