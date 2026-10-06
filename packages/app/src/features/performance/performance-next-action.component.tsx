import {
  UIArrowForwardIcon,
  UICard,
  UICardContent,
  UIContentGroup,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export type PerformanceNextActionProps = {
  hasErrors: boolean;
  hasAttempts: boolean;
};

export function PerformanceNextActionContent(props: { description: string; label: string; title: string }) {
  return (
    <UIContentGroup variant="content">
      <UITypography variant="h5">{props.title}</UITypography>
      <UITypography color="text.secondary">{props.description}</UITypography>
      <UITypography color="primary" variant="button">
        {props.label} <UIArrowForwardIcon aria-hidden="true" fontSize="small" />
      </UITypography>
    </UIContentGroup>
  );
}

export function PerformanceNextAction(props: PerformanceNextActionProps) {
  const { t } = useTranslation();

  const to = props.hasErrors ? "/revisoes" : "/catalogo";

  const label = props.hasErrors ? t("performance.reviewErrors") : t("performance.startStudy");

  let description = t("performance.nextActionEmpty");

  if (props.hasAttempts) {
    description = t("performance.nextActionContinue");
  }

  if (props.hasErrors) {
    description = t("performance.nextActionErrors");
  }

  return (
    <UICard action={<Link aria-label={label} to={to} />}>
      <UICardContent>
        <PerformanceNextActionContent description={description} label={label} title={t("performance.nextAction")} />
      </UICardContent>
    </UICard>
  );
}
