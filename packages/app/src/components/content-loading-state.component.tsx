import {
  UICircularProgress,
  UIContentLoadingLabel,
  UIContentLoadingLayout,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type ContentLoadingStateProps = {
  label?: string;
};

export function ContentLoadingState(props: ContentLoadingStateProps) {
  const { label } = props;

  const { t } = useTranslation();

  return (
    <UIContentLoadingLayout>
      <UICircularProgress aria-label={t("common.loadingContent")} />

      <UIContentLoadingLabel>{label || t("common.loadingContent")}</UIContentLoadingLabel>
    </UIContentLoadingLayout>
  );
}
