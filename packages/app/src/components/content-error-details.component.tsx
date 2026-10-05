import { UIContentGroup, UIDisclosure, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "./error-message.component";
import { RetryButton } from "./retry-button.component";

type ContentErrorDetailsProps = {
  message: string;
  onRetry?(): void;
};

export function ContentErrorDetails(props: ContentErrorDetailsProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UIDisclosure summary={t("errors.showDetails")}>
        <ErrorMessage message={props.message} />
      </UIDisclosure>
      <UITypography color="text.secondary" variant="body2">
        {t("errors.tryAgainHint")}
      </UITypography>

      <RetryButton onRetry={props.onRetry} />
    </UIContentGroup>
  );
}
