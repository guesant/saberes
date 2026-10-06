import { UIDisclosure, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface ActionFeedbackErrorDetailsProps {
  error: Error | null;
}

export function ActionFeedbackErrorDetails(props: ActionFeedbackErrorDetailsProps) {
  const { t } = useTranslation();

  if (!props.error) {
    return null;
  }

  return (
    <UIDisclosure summary={t("errors.showDetails")}>
      <UITypography variant="body2">{props.error.message}</UITypography>
    </UIDisclosure>
  );
}
