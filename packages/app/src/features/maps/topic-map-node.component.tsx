import {
  UIButton,
  UICheckCircleIcon,
  UIContentGroup,
  UIStep,
  UIStepButton,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export type TopicMapNodeProps = {
  node: Record<string, unknown>;
};

export function TopicMapNode(props: TopicMapNodeProps) {
  const { node } = props;

  const { t } = useTranslation();

  return (
    <UIStep>
      <UIStepButton icon={node.is_milestone ? <UICheckCircleIcon color="success" /> : undefined}>
        <UIContentGroup variant="tight">
          <UITypography fontWeight={700}>{String(node.label)}</UITypography>

          <UITypography variant="body2">{String(node.description || "")}</UITypography>

          <UITypography variant="caption">
            {t("map.mastery", {
              percentage: String(node.mastery_percentage || 0),
              state: String(node.learning_state),
            })}
          </UITypography>

          <UIButton component={Link} to={`/topicos/${String(node.slug)}`} size="small">
            Abrir tópico
          </UIButton>
        </UIContentGroup>
      </UIStepButton>
    </UIStep>
  );
}
