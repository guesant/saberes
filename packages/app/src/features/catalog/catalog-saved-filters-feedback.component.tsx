import { UIButton, UIContentAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogSavedFiltersFeedbackProps } from "./catalog-saved-filters-feedback-props.type";

export function CatalogSavedFiltersFeedback(props: CatalogSavedFiltersFeedbackProps) {
  const { t } = useTranslation();

  if (props.state !== "error") {
    return null;
  }

  return (
    <UIContentAlert severity="error">
      {t("catalog.savedFiltersError", {
        message: props.error?.message || t("common.unknownError"),
      })}
      <UIButton onClick={props.onRetry} size="small" variant="text">
        {t("common.retry")}
      </UIButton>
    </UIContentAlert>
  );
}
